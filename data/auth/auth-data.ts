import { RoleOption } from "@/lib/types";

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "petani",
    title: "Petani / BUMDes",
    badge: "Harga Adil Petani",
    description: "Jual langsung ke UMKM, terima notifikasi order instan via WhatsApp Bot.",
    icon: "Sprout",
    features: [
      "Notifikasi pesanan masuk via WhatsApp",
      "Bebas potongan calo & tengkulak",
      "Stok panen terdata otomatis di peta GIS",
    ],
  },
  {
    id: "umkm",
    title: "Pelaku UMKM Kuliner",
    badge: "Hemat Modal s/d 35%",
    description: "Cari bahan baku segar di sekitar Anda dan ambil langsung (Self-Pick Up).",
    icon: "Store",
    features: [
      "Harga tangan pertama langsung dari kebun",
      "Pantau titik panen terdekat via Radar GIS",
      "Ambil sendiri tanpa biaya ongkir ekspedisi",
    ],
  },
];

export const AUTH_QUOTES = [
  {
    quote: "Menghubungkan langsung ladang petani dengan dapur usaha adalah kunci kemandirian pangan nasional.",
    author: "Tim Inovasi MitraPanen",
    role: "Agritech & Geo-SCM Platform",
  },
  {
    quote: "Tanpa tengkulak berlapis, petani sejahtera dan UMKM kuliner mendapatkan bahan baku tersegar.",
    author: "Ir. Sukirno",
    role: "Ketua Kelompok Tani Mandiri",
  },
];
