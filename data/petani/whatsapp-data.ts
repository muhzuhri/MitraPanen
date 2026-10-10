import { WhatsAppCommand } from "./types";

export const WHATSAPP_CHEAT_SHEET: WhatsAppCommand[] = [
  {
    command: "PANEN CABAI 50 40000",
    tujuan: "Menambah stok panen baru langsung ke Radar GIS",
    keterangan: "Format: PANEN [Spasi] NAMA_BARANG [Spasi] JUMLAH_KG [Spasi] HARGA_KG",
    badge: "Paling Sering Digunakan",
  },
  {
    command: "HABIS CABAI",
    tujuan: "Menghapus / menonaktifkan stok barang dari Peta GIS",
    keterangan: "Format: HABIS [Spasi] NAMA_BARANG (Agar UMKM tidak memesan lagi)",
    badge: "Stok Habis",
  },
  {
    command: "CEK PESANAN",
    tujuan: "Melihat daftar pesanan aktif UMKM yang belum diambil",
    keterangan: "Bot membalas nama UMKM, jumlah kilo, jam jemput, dan nomor HP pembeli",
    badge: "Cek Antrean",
  },
  {
    command: "HARGA PASAR CABAI",
    tujuan: "Mengecek tren dan rekomendasi harga pasar dari Agro-AI",
    keterangan: "Bot memberikan harga rata-rata pasar induk terdekat hari ini",
    badge: "AI Market Intel",
  },
  {
    command: "SIAP AMBIL ORD-001",
    tujuan: "Mengabari UMKM bahwa barang sudah ditimbang dan siap diambil",
    keterangan: "Bot otomatis mengirim WhatsApp ke pembeli bahwa pesanan sudah ready",
    badge: "Notifikasi Cepat",
  },
  {
    command: "BANTUAN",
    tujuan: "Menampilkan panduan lengkap seluruh perintah sistem",
    keterangan: "Ketik BANTUAN kapan saja jika lupa format penulisan pesan",
    badge: "Panduan",
  },
];

export const MOCK_BOT_RESPONSES: Record<string, string> = {
  PANEN: "✅ Berhasil! Stok telah terdaftar di database dan langsung tayang pada Radar Peta GIS untuk semua pembeli UMKM di sekitar Anda.",
  HABIS: "✅ Berhasil! Status komoditas diubah menjadi HABIS. Pin di radar GIS telah dinonaktifkan.",
  CEK: "📋 Terdapat 2 pesanan menunggu pengambilan hari ini: 1. Warung Bu Sri (25 Kg) jam 14:00, 2. Resto Sambal Nusantara (40 Kg) jam 16:30.",
  HARGA: "📊 Info Harga Pasar Induk Caringin Hari Ini: Rata-rata Rp 42.000/Kg (Tren Stabil). Rekomendasi jual kebun: Rp 38.000 - Rp 40.000/Kg.",
  SIAP: "🚀 Notifikasi terkirim! Sistem telah mengirimkan pesan WhatsApp ke pembeli bahwa panen sudah siap diambil di lokasi kebun Anda.",
  BANTUAN: "🌾 Panduan Bot MitraPanen:\n1. PANEN [KOMODITAS] [KG] [HARGA]\n2. HABIS [KOMODITAS]\n3. CEK PESANAN\n4. HARGA PASAR [KOMODITAS]\n5. SIAP AMBIL [NOMOR_ORDER]",
};
