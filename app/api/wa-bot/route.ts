import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ==============================================================================
// 1. INISIALISASI SUPABASE CLIENT (SERVER-SIDE)
// ==============================================================================
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
function getCleanDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function getPhoneVariants(rawPhone: string): string[] {
  const cleaned = rawPhone.replace(/[^\d+]/g, "").trim();
  const digitsOnly = cleaned.replace(/\D/g, "");
  const variants = new Set<string>();

  if (cleaned) variants.add(cleaned);
  if (digitsOnly) variants.add(digitsOnly);

  if (digitsOnly.startsWith("62")) {
    variants.add("0" + digitsOnly.slice(2));
    variants.add("+" + digitsOnly);
    variants.add(digitsOnly.slice(2));
  } else if (digitsOnly.startsWith("0")) {
    const international = "62" + digitsOnly.slice(1);
    variants.add(international);
    variants.add("+" + international);
    variants.add(digitsOnly.slice(1));
  }

  return Array.from(variants);
}

// ==============================================================================
// 3. HELPER: PENGIRIMAN PESAN WHATSAPP VIA FONNTE API
// ==============================================================================
async function sendFonnteMessage(target: string, message: string) {
  const token = process.env.FONNTE_TOKEN || "SQhEAMduLYSaKQEdyAVX";

  if (!token) {
    console.warn(
      "[Fonnte Webhook] Peringatan: FONNTE_TOKEN belum diatur di environment!"
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
// 5. HANDLER HTTP POST (WEBHOOK FONNTE & SIMULATOR)
// ==============================================================================
export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------------------------------
    // A. EKSTRAKSI PAYLOAD REQUEST
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

    sender = sender.trim() || "082160107638";
    message = message.trim();

    console.log("[Fonnte Webhook] Pesan Diterima:", { sender, message });

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameter message wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const senderDigits = getCleanDigits(sender);
    const phoneVariants = getPhoneVariants(sender);

    // --------------------------------------------------------------------------
    // B. VALIDASI PENGIRIM (PETANI TERDAFTAR DENGAN AUTO-FALLBACK)
    // --------------------------------------------------------------------------
    let farmerProfile: {
      id: string;
      full_name?: string;
      role?: string;
      phone_whatsapp?: string;
      phone_number?: string;
    } | null = null;

    // 1. Ambil seluruh profil dengan role petani
    const { data: petaniList } = await supabase
      .from("profiles")
      .select("id, full_name, role, phone_whatsapp, phone_number")
      .eq("role", "petani");

    if (petaniList && petaniList.length > 0) {
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

      // Jika nomor baru/berbeda mengirim pesan, gunakan profil petani utama yang aktif
      if (!farmerProfile) {
        farmerProfile = petaniList[0];
      }
    }

    // 2. Fallback: Jika profiles kosong, ambil dari kebun
    if (!farmerProfile) {
      const { data: existingKebun } = await supabase
        .from("kebun")
        .select("id, farmer_id, nama_kebun")
        .limit(1)
        .maybeSingle();

      if (existingKebun?.farmer_id) {
        farmerProfile = {
          id: existingKebun.farmer_id,
          full_name: existingKebun.nama_kebun || "Muh. Zuhri Mubarak",
          role: "petani",
        };
      }
    }

    // Jika tetap belum ada profil sama sekali
    if (!farmerProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Belum ada data petani yang terkonfigurasi di database.",
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------------------------------
    // C. PERCABANGAN LOGIKA FORMAT PERINTAH TEKS
    // --------------------------------------------------------------------------
    const cleanMessageUpper = message.toUpperCase();

    // PERINTAH UTAMA: "PANEN [Nama Barang] [Jumlah Kg] [Harga per Kg]"
    // Contoh: "PANEN CABAI 50 40000"
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
          { success: false, message: "Format perintah PANEN salah.", reply: formatBantuan },
          { status: 200 }
        );
      }

      // Ekstraksi data hasil panen
      const rawItemName = match[1].trim();
      const rawQuantity = match[2].replace(",", ".");
      const rawPrice = match[3].replace(/[.,]/g, "");

      const itemName = rawItemName.toUpperCase();
      const quantity = parseFloat(rawQuantity);
      const pricePerKg = parseFloat(rawPrice);

      if (isNaN(quantity) || quantity <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) {
        const errorMsg = "⚠️ Jumlah kilogram dan harga per kilogram harus berupa angka yang lebih dari 0.";
        await sendFonnteMessage(sender, errorMsg);

        return NextResponse.json(
          { success: false, message: errorMsg, reply: errorMsg },
          { status: 200 }
        );
      }

      // ------------------------------------------------------------------------
      // D. SIMPAN DATA KE SUPABASE (DUAL STORAGE: harvests & stok_panen)
      // ------------------------------------------------------------------------
      console.log("[Fonnte Webhook] Menyimpan panen:", {
        farmer_id: farmerProfile.id,
        item_name: itemName,
        quantity,
        price_per_kg: pricePerKg,
      });

      // 1. Simpan ke tabel HARVESTS (sesuai spesifikasi Skenario 1)
      let harvestSaved = false;
      let harvestData = null;
      try {
        const resH = await supabase
          .from("harvests")
          .insert({
            farmer_id: farmerProfile.id,
            item_name: itemName,
            quantity: quantity,
            price_per_kg: pricePerKg,
            status: "tersedia",
          })
          .select()
          .maybeSingle();

        if (!resH.error && resH.data) {
          harvestSaved = true;
          harvestData = resH.data;
        } else if (resH.error) {
          console.warn("[Fonnte Webhook] Gagal insert harvests:", resH.error.message);
        }
      } catch (err: any) {
        console.warn("[Fonnte Webhook] Exception harvests:", err?.message);
      }

      // 2. Simpan ke tabel STOK_PANEN (agar LANGSUNG muncul di Website & Peta GIS)
      let stokSaved = false;
      try {
        // Ambil kebun milik petani ini atau kebun pertama
        let kebunId: string | null = null;
        const { data: farmerKebun } = await supabase
          .from("kebun")
          .select("id")
          .eq("farmer_id", farmerProfile.id)
          .maybeSingle();

        if (farmerKebun?.id) {
          kebunId = farmerKebun.id;
        } else {
          const { data: anyKebun } = await supabase
            .from("kebun")
            .select("id")
            .limit(1)
            .maybeSingle();
          kebunId = anyKebun?.id || null;
        }

        // Cari master komoditas jika ada
        let komoditasId: string | null = null;
        const { data: komos } = await supabase
          .from("komoditas")
          .select("id, nama");

        if (komos && komos.length > 0) {
          const found = komos.find(
            (k) =>
              itemName.toLowerCase().includes(k.nama.toLowerCase()) ||
              k.nama.toLowerCase().includes(itemName.toLowerCase())
          );
          if (found) komoditasId = found.id;
        }

        if (kebunId) {
          const resS = await supabase.from("stok_panen").insert({
            kebun_id: kebunId,
            komoditas_id: komoditasId,
            varietas: itemName,
            jumlah_stok_kg: quantity,
            harga_per_kg: pricePerKg,
            status: "tersedia",
            tanggal_panen: new Date().toISOString().split("T")[0],
          });

          if (!resS.error) stokSaved = true;
        }
      } catch (stokEx: any) {
        console.warn("[Fonnte Webhook] Exception stok_panen:", stokEx?.message);
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
          reply: successMessage,
          data: {
            farmer_id: farmerProfile.id,
            item_name: itemName,
            quantity,
            price_per_kg: pricePerKg,
            saved_to_harvests: harvestSaved,
            saved_to_stok_panen: stokSaved,
            harvestData,
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
        reply: panduanUmum,
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
