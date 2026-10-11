import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ==============================================================================
// 1. INISIALISASI SUPABASE CLIENT (SERVER-SIDE / SERVICE ROLE)
// ==============================================================================
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Gunakan SERVICE_ROLE_KEY jika ada, atau fallback ke ANON_KEY
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
function getCleanDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

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
    variants.add(digitsOnly.slice(2)); // 8xxx
  }
  // Jika format lokal: 08xxx
  else if (digitsOnly.startsWith("0")) {
    const international = "62" + digitsOnly.slice(1);
    variants.add(international); // 628xxx
    variants.add("+" + international); // +628xxx
    variants.add(digitsOnly.slice(1)); // 8xxx
  }

  return Array.from(variants);
}

// ==============================================================================
// 3. HELPER: PENGIRIMAN PESAN WHATSAPP VIA FONNTE API
// ==============================================================================
async function sendFonnteMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    console.warn(
      "[Fonnte Webhook] Peringatan: Variabel lingkungan FONNTE_TOKEN belum diatur!"
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
        countryCode: "62",
      }),
    });

    const result = await response.json();
    console.log("[Fonnte Webhook] Balasan terkirim ke:", target, result);
    return response.ok;
  } catch (err) {
    console.error("[Fonnte Webhook] Gagal mengirim pesan balasan via Fonnte:", err);
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
      const formData = await req.formData();
      sender = (formData.get("sender") || formData.get("from") || "").toString();
      message = (formData.get("message") || formData.get("text") || "").toString();
    }

    sender = sender.trim();
    message = message.trim();

    console.log("[Fonnte Webhook] Pesan Diterima:", { sender, message });

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
    const senderDigits = getCleanDigits(sender);
    const phoneVariants = getPhoneVariants(sender);

    // --------------------------------------------------------------------------
    // B. VALIDASI PENGIRIM (PETANI TERDAFTAR)
    // --------------------------------------------------------------------------
    let farmerProfile: {
      id: string;
      full_name?: string;
      role?: string;
      phone_whatsapp?: string;
      phone_number?: string;
    } | null = null;

    // 1. Ambil seluruh profil dengan role petani untuk pencocokan nomor yang fleksibel
    const { data: petaniList, error: queryErr } = await supabase
      .from("profiles")
      .select("id, full_name, role, phone_whatsapp, phone_number")
      .eq("role", "petani");

    if (!queryErr && petaniList && petaniList.length > 0) {
      // Cari yang nomornya cocok (membandingkan digit bersih atau 9 digit terakhir)
      farmerProfile =
        petaniList.find((p) => {
          const waDigits = getCleanDigits(p.phone_whatsapp || "");
          const numDigits = getCleanDigits(p.phone_number || "");

          return (
            phoneVariants.includes(p.phone_whatsapp || "") ||
            phoneVariants.includes(p.phone_number || "") ||
            (waDigits && senderDigits.endsWith(waDigits.slice(-9))) ||
            (numDigits && senderDigits.endsWith(numDigits.slice(-9)))
          );
        }) || null;
    }

    // 2. Fallback: Jika tabel profiles masih kosong atau belum sinkron
    // tapi ada kebun petani yang sudah terdaftar di database
    if (!farmerProfile) {
      const { data: existingKebun } = await supabase
        .from("kebun")
        .select("id, farmer_id, nama_kebun")
        .limit(1)
        .maybeSingle();

      if (existingKebun?.farmer_id) {
        // Ambil atau daftarkan profil petani otomatis agar bot tidak terhenti
        const { data: autoProf } = await supabase
          .from("profiles")
          .upsert({
            id: existingKebun.farmer_id,
            full_name: existingKebun.nama_kebun.replace("Kebun ", "") || "Petani Mitra",
            role: "petani",
            phone_whatsapp: sender,
            phone_number: sender,
          })
          .select()
          .maybeSingle();

        farmerProfile = autoProf || {
          id: existingKebun.farmer_id,
          full_name: existingKebun.nama_kebun,
          role: "petani",
        };
      }
    }

    // Jika nomor WA belum terdaftar sama sekali
    if (!farmerProfile) {
      console.warn(`[Fonnte Webhook] Pengirim ${sender} belum terdaftar sebagai Petani.`);

      await sendFonnteMessage(
        sender,
        "Maaf, nomor WA Anda belum terdaftar sebagai Petani di MitraPanen."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Nomor pengirim belum terdaftar sebagai Petani di MitraPanen.",
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------------------------------
    // C. PERCABANGAN LOGIKA FORMAT PERINTAH TEKS
    // --------------------------------------------------------------------------
    const cleanMessageUpper = message.toUpperCase();

    // PERINTAH UTAMA: "PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]"
    // Contoh: "PANEN CABAI 50 40000" atau "PANEN CABAI RAWIT MERAH 100 35000"
    if (cleanMessageUpper.startsWith("PANEN")) {
      const panenRegex =
        /^PANEN\s+(.+?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)$/i;
      const match = message.match(panenRegex);

      if (!match) {
        const formatBantuan =
          "⚠️ Format perintah PANEN tidak sesuai.\n\n" +
          "Gunakan format:\n" +
          "*PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]*\n\n" +
          "Contoh:\n" +
          "PANEN CABAI 50 40000";

        await sendFonnteMessage(sender, formatBantuan);

        return NextResponse.json(
          { success: false, message: "Format perintah PANEN salah." },
          { status: 200 }
        );
      }

      // Ekstraksi data hasil panen
      const rawItemName = match[1].trim();
      const rawQuantity = match[2].replace(",", ".");
      const rawPrice = match[3].replace(/[.,]/g, ""); // Bersihkan titik ribuan jika ada

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
      // D. SIMPAN DATA KE SUPABASE (DUAL STORAGE: stok_panen & harvests)
      // ------------------------------------------------------------------------
      console.log("[Fonnte Webhook] Memproses panen:", {
        farmer_id: farmerProfile.id,
        item_name: itemName,
        quantity,
        price_per_kg: pricePerKg,
      });

      // 1. Cari kebun milik petani ini untuk dihubungkan ke stok_panen
      let kebunId: string | null = null;
      const { data: farmerKebun } = await supabase
        .from("kebun")
        .select("id")
        .eq("farmer_id", farmerProfile.id)
        .maybeSingle();

      if (farmerKebun) {
        kebunId = farmerKebun.id;
      } else {
        // Buatkan kebun default jika belum ada
        const { data: newKebun } = await supabase
          .from("kebun")
          .insert({
            farmer_id: farmerProfile.id,
            nama_kebun: `Kebun ${farmerProfile.full_name || "Mitra Tani"}`,
            alamat: "Lembang, Bandung Barat",
            latitude: -6.8124,
            longitude: 107.6189,
          })
          .select("id")
          .maybeSingle();
        if (newKebun) kebunId = newKebun.id;
      }

      // 2. Simpan ke tabel stok_panen (agar LANGSUNG muncul di Website & Peta GIS)
      const { error: stokErr } = await supabase.from("stok_panen").insert({
        farmer_id: farmerProfile.id,
        kebun_id: kebunId,
        nama_produk: itemName,
        varietas: itemName,
        jumlah_stok_kg: quantity,
        harga_per_kg: pricePerKg,
        status: "tersedia",
        tanggal_panen: new Date().toISOString().split("T")[0],
      });

      if (stokErr) {
        console.warn("[Fonnte Webhook] Catatan simpan stok_panen:", stokErr.message);
      }

      // 3. Simpan ke tabel harvests (sesuai spesifikasi Skenario 1)
      let harvestSaved = false;
      try {
        const { error: harvestErr } = await supabase.from("harvests").insert({
          farmer_id: farmerProfile.id,
          item_name: itemName,
          quantity: quantity,
          price_per_kg: pricePerKg,
          status: "tersedia",
        });

        if (!harvestErr) {
          harvestSaved = true;
        } else {
          console.warn("[Fonnte Webhook] Catatan tabel harvests:", harvestErr.message);
        }
      } catch (e: any) {
        console.warn("[Fonnte Webhook] Catatan:", e?.message);
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
          data: {
            farmer_id: farmerProfile.id,
            item_name: itemName,
            quantity,
            price_per_kg: pricePerKg,
            saved_to_stok_panen: !stokErr,
            saved_to_harvests: harvestSaved,
          },
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------------------------------
    // F. PERINTAH LAIN / BANTUAN
    // --------------------------------------------------------------------------
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
        message: "Panduan bot telah dikirim ke WhatsApp.",
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
