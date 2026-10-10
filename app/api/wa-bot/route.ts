import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ==============================================================================
// 1. INISIALISASI SUPABASE CLIENT (SERVER-SIDE / SERVICE ROLE)
// ==============================================================================
// Menggunakan createClient dengan Service Role Key untuk melewati batasan RLS
// sehingga webhook dapat mencari nomor pengirim dan memasukkan data panen secara aman.
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ==============================================================================
// 2. HELPER: NORMALISASI NOMOR TELEPON
// ==============================================================================
// Mengubah nomor ke berbagai variasi umum (08xx, 628xx, +628xx) untuk memastikan
// pencocokan nomor antara Fonnte (gateway) dan database Supabase berjalan akurat.
function getPhoneVariants(rawPhone: string): string[] {
  const cleaned = rawPhone.replace(/[^\d+]/g, "").trim();
  const digitsOnly = cleaned.replace(/\D/g, "");
  const variants = new Set<string>();

  if (cleaned) variants.add(cleaned);
  if (digitsOnly) variants.add(digitsOnly);

  // Jika format internasional tanpa plus: 628xxx
  if (digitsOnly.startsWith("62")) {
    variants.add("0" + digitsOnly.slice(2)); // Format lokal: 08xxx
    variants.add("+" + digitsOnly); // Format E.164: +628xxx
  }
  // Jika format lokal: 08xxx
  else if (digitsOnly.startsWith("0")) {
    const international = "62" + digitsOnly.slice(1);
    variants.add(international); // 628xxx
    variants.add("+" + international); // +628xxx
  }

  return Array.from(variants);
}

// ==============================================================================
// 3. HELPER: PENGIRIMAN PESAN WHATSAPP VIA FONNTE API
// ==============================================================================
// Mengirim pesan balasan ke pengguna WhatsApp melalui endpoint resmi Fonnte
async function sendFonnteMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.error(
      "[Fonnte Webhook] Error: Variabel lingkungan FONNTE_TOKEN belum diatur!"
    );
    return false;
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: target,
        message: message,
        countryCode: "62", // Default kode negara Indonesia
      }),
    });

    const result = await response.json();
    console.log("[Fonnte Webhook] Balasan terkirim:", {
      target,
      status: result.status,
    });
    return response.ok;
  } catch (err) {
    console.error("[Fonnte Webhook] Gagal mengirim pesan balasan:", err);
    return false;
  }
}

// ==============================================================================
// 4. HANDLER HTTP GET (CEK STATUS ENDPOINT)
// ==============================================================================
export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "MitraPanen WhatsApp Webhook Gateway",
    timestamp: new Date().toISOString(),
  });
}

// ==============================================================================
// 5. HANDLER HTTP POST (WEBHOOK FONNTE UTAMA)
// ==============================================================================
export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------------------------------
    // A. EKSTRAKSI PAYLOAD REQUEST DARI FONNTE
    // --------------------------------------------------------------------------
    let sender = "";
    let message = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      sender = (body.sender || body.from || body.phone || "").toString();
      message = (body.message || body.text || "").toString();
    } else {
      // Mendukung request multipart/form-data atau urlencoded dari Fonnte
      const formData = await req.formData();
      sender = (formData.get("sender") || formData.get("from") || "").toString();
      message = (
        formData.get("message") ||
        formData.get("text") ||
        ""
      ).toString();
    }

    sender = sender.trim();
    message = message.trim();

    console.log("[Fonnte Webhook] Pesan Masuk:", { sender, message });

    // Validasi kelengkapan data dasar
    if (!sender || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameter sender dan message wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // --------------------------------------------------------------------------
    // B. VALIDASI PENGIRIM (HARUS PETANI TERDAFTAR DI MITRAPANEN)
    // --------------------------------------------------------------------------
    const phoneVariants = getPhoneVariants(sender);

    // Cari petani di tabel profiles berdasarkan phone_number dan role = 'petani'
    // Catatan: Kode ini juga mengantisipasi kolom phone_whatsapp agar fleksibel
    let farmerProfile: { id: string; full_name?: string; role?: string } | null =
      null;

    // 1. Coba pencarian dengan kolom `phone_number`
    const { data: profileByPhoneNumber, error: phoneErr } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .in("phone_number", phoneVariants)
      .eq("role", "petani")
      .maybeSingle();

    if (!phoneErr && profileByPhoneNumber) {
      farmerProfile = profileByPhoneNumber;
    } else {
      // 2. Fallback pencarian dengan kolom `phone_whatsapp` jika skema database menggunakannya
      const { data: profileByPhoneWa } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("phone_whatsapp", phoneVariants)
        .eq("role", "petani")
        .maybeSingle();

      if (profileByPhoneWa) {
        farmerProfile = profileByPhoneWa;
      }
    }

    // Jika nomor WA tidak ditemukan atau bukan berstatus Petani:
    if (!farmerProfile) {
      console.warn(
        `[Fonnte Webhook] Pengirim ${sender} belum terdaftar sebagai Petani.`
      );

      // Kirim balasan error ke WhatsApp pengirim
      await sendFonnteMessage(
        sender,
        "Maaf, nomor WA Anda belum terdaftar sebagai Petani di MitraPanen."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Nomor pengirim belum terdaftar sebagai Petani di MitraPanen.",
        },
        { status: 200 } // Kembalikan 200 agar gateway Fonnte tidak mengulang retry berlebihan
      );
    }

    // --------------------------------------------------------------------------
    // C. PERCABANGAN LOGIKA FORMAT PERINTAH TEKS
    // --------------------------------------------------------------------------
    const cleanMessageUpper = message.toUpperCase();

    // PERINTAH UTAMA: "PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]"
    // Contoh format: "PANEN CABAI 50 40000" atau "PANEN CABAI RAWIT MERAH 100 35000"
    if (cleanMessageUpper.startsWith("PANEN")) {
      // Regex untuk memisahkan:
      // Group 1: Nama Barang (bisa lebih dari satu kata, misal "CABAI RAWIT MERAH")
      // Group 2: Jumlah (angka, bisa desimal)
      // Group 3: Harga per Kg (angka)
      const panenRegex =
        /^PANEN\s+(.+?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)$/i;
      const match = message.match(panenRegex);

      if (!match) {
        // Balasan jika format penulisan salah
        const formatBantuan =
          "⚠️ Format perintah PANEN tidak sesuai.\n\n" +
          "Gunakan format:\n" +
          "*PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]*\n\n" +
          "Contoh:\n" +
          "PANEN CABAI 50 40000";

        await sendFonnteMessage(sender, formatBantuan);

        return NextResponse.json(
          {
            success: false,
            message: "Format perintah PANEN salah.",
          },
          { status: 200 }
        );
      }

      // Ekstraksi data hasil panen
      const rawItemName = match[1].trim();
      const rawQuantity = match[2].replace(",", ".");
      const rawPrice = match[3].replace(/[.,]/g, ""); // Bersihkan titik/koma separator ribuan jika ada

      const itemName = rawItemName.toUpperCase();
      const quantity = parseFloat(rawQuantity);
      const pricePerKg = parseFloat(rawPrice);

      if (isNaN(quantity) || quantity <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) {
        await sendFonnteMessage(
          sender,
          "⚠️ Jumlah kilogram dan harga per kilogram harus berupa angka yang lebih dari 0."
        );

        return NextResponse.json(
          { success: false, message: "Nilai kuantitas atau harga tidak valid." },
          { status: 200 }
        );
      }

      // ------------------------------------------------------------------------
      // D. SIMPAN DATA KE TABEL `harvests` SUPABASE
      // ------------------------------------------------------------------------
      console.log("[Fonnte Webhook] Menyimpan panen ke tabel harvests:", {
        farmer_id: farmerProfile.id,
        item_name: itemName,
        quantity,
        price_per_kg: pricePerKg,
      });

      const { data: harvestData, error: insertError } = await supabase
        .from("harvests")
        .insert({
          farmer_id: farmerProfile.id,
          item_name: itemName,
          quantity: quantity,
          price_per_kg: pricePerKg,
          status: "tersedia",
        })
        .select()
        .single();

      if (insertError) {
        console.error(
          "[Fonnte Webhook] Gagal insert ke tabel harvests:",
          insertError
        );

        await sendFonnteMessage(
          sender,
          "❌ Terjadi kesalahan pada sistem saat menyimpan data panen Anda. Silakan coba beberapa saat lagi."
        );

        return NextResponse.json(
          {
            success: false,
            error: insertError.message,
          },
          { status: 500 }
        );
      }

      // ------------------------------------------------------------------------
      // E. KIRIM BALASAN SUKSES KE WHATSAPP PENGIRIM VIA FONNTE
      // ------------------------------------------------------------------------
      const successMessage = `✅ Berhasil! ${quantity} kg ${itemName} dengan harga Rp${pricePerKg}/kg sudah ditambahkan ke Peta MitraPanen.`;

      await sendFonnteMessage(sender, successMessage);

      return NextResponse.json(
        {
          success: true,
          message: "Data panen berhasil diproses dan disimpan.",
          data: harvestData,
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------------------------------
    // F. PERINTAH LAIN / BANTUAN
    // --------------------------------------------------------------------------
    // Jika pesan yang dikirim bukan diawali perintah "PANEN"
    const panduanUmum =
      "🌾 Halo dari Bot Asisten MitraPanen!\n\n" +
      "Untuk menambahkan stok hasil panen Anda ke Peta GIS, silakan ketik pesan dengan format:\n\n" +
      "*PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]*\n\n" +
      "Contoh:\n" +
      "PANEN CABAI 50 40000";

    await sendFonnteMessage(sender, panduanUmum);

    return NextResponse.json(
      {
        success: true,
        message: "Perintah umum telah direspon dengan panduan bot.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Fonnte Webhook] Terjadi kesalahan fatal:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error.",
      },
      { status: 500 }
    );
  }
}
