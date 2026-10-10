import {
  NavLink,
  StatItem,
  WhyUsCard,
  FeatureItem,
  StepItem,
  FooterLinkGroup,
} from "@/lib/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Mengapa MitraPanen", href: "#mengapa" },
  { label: "Fitur Unggulan", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Untuk Petani", href: "#petani" },
];

export const HERO_STATS: StatItem[] = [
  { value: "1.250+", label: "Petani Terverifikasi", description: "Siap panen langsung di kebun" },
  { value: "480+", label: "UMKM Kuliner Aktif", description: "Restoran, katering & warung" },
  { value: "35%", label: "Efisiensi Biaya Bahan", description: "Terbebas dari mark-up perantara" },
  { value: "0 Rp", label: "Biaya Ongkos Kirim", description: "Sistem jemput mandiri (Self-Pick Up)" },
];

export const WHY_US_DATA: WhyUsCard[] = [
  {
    id: "harga-tangan-pertama",
    title: "Harga Tangan Pertama",
    highlight: "Hemat s/d 35% Modal Pokok",
    description:
      "Potong 2-3 lapis tengkulak konvensional. Dapatkan harga langsung dari kebun tanpa biaya perantara tersembunyi, sementara petani tetap menerima kompensasi yang adil.",
    iconName: "TrendingDown",
    tag: "Efisiensi Biaya",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "peta-panen-realtime",
    title: "Peta Panen Real-time",
    highlight: "Berbasis Radius GIS Presisi",
    description:
      "Pantau stok bahan pangan siap petik di sekitar lokasi usaha Anda. Eksplorasi ketersediaan cabai, tomat, bawang, dan sayuran segar dengan radius jarak tempuh nyata.",
    iconName: "MapPin",
    tag: "Geo-SCM Cerdas",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "ambil-sendiri-tanpa-ongkir",
    title: "Ambil Sendiri Tanpa Ongkir",
    highlight: "Kualitas 100% Segar Maksimal",
    description:
      "Skema Self-Pick Up terjadwal. Bebas ketergantungan armada kurir mahal, minim risiko sayur layu akibat transit berhari-hari, dan Anda bisa memverifikasi mutu langsung di kebun.",
    iconName: "Store",
    tag: "Self-Pick Up",
    badgeColor: "bg-lime-50 text-lime-700 border-lime-200",
  },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "gis-map",
    badge: "Teknologi Geo-SCM",
    title: "Peta Panen Cerdas (GIS): Temukan Panen Terdekat Sekejap Mata",
    description:
      "MitraPanen menyatukan data agrikultur dengan Sistem Informasi Geografis (GIS). UMKM dapat melihat klaster kebun aktif, jadwal petik panen, dan estimasi waktu tempuh dari lokasi dapur usaha Anda.",
    highlights: [
      "Filter radius fleksibel (1 km - 25 km) dari dapur katering / resto Anda",
      "Indikator status panen: 'Siap Petik Hari Ini', 'Panen Besok', atau 'Pre-order 3 Hari'",
      "Navigasi rute terintegrasi langsung ke titik koordinat gerbang kebun petani",
      "Estimasi volume komoditas siap panen secara transparan",
    ],
    mockupType: "gis-map",
  },
  {
    id: "whatsapp-bot",
    badge: "Ramah Petani & Inklusif",
    title: "WhatsApp Bot untuk Petani: Tanpa Instal Aplikasi Rumit",
    description:
      "Kami mendesain platform ini agar dapat digunakan oleh semua petani tanpa kendala literasi digital. Petani cukup menggunakan WhatsApp yang sudah mereka gunakan sehari-hari untuk mengelola stok dan pesanan.",
    highlights: [
      "Petani cukup chat untuk update ketersediaan panen dan harga kebun",
      "Notifikasi pemesanan otomatis masuk ke WhatsApp dengan rincian nama UMKM dan jam ambil",
      "Konfirmasi pesanan cukup menekan tombol 'Terima Pesanan' di chat WhatsApp",
      "Tidak memerlukan smartphone spesifikasi tinggi atau kuota aplikasi tambahan",
    ],
    mockupType: "whatsapp-bot",
  },
];

export const HOW_IT_WORKS_DATA: StepItem[] = [
  {
    step: "01",
    title: "Cari di Peta Pintar",
    subtitle: "Temukan panen terdekat",
    description:
      "Buka radar GIS MitraPanen. Pilih komoditas yang dibutuhkan (misal: Cabai Rawit, Tomat, Bawang Merah) dan atur radius jangkauan dari lokasi resto atau dapur usaha Anda.",
    iconName: "Search",
    tip: "Filter berdasarkan kesiapan panen hari ini untuk kebutuhan darurat.",
  },
  {
    step: "02",
    title: "Pesan & Amankan Stok",
    subtitle: "Booking kuota panen terpercaya",
    description:
      "Tentukan jumlah kilogram yang ingin dibeli dan pilih slot waktu pengambilan. Sistem langsung mengirim konfirmasi pesanan ke WhatsApp petani untuk menyiapkan petikan terbaik.",
    iconName: "CheckCircle2",
    tip: "Stok terkunci seketika sehingga Anda terhindar dari kehabisan bahan baku.",
  },
  {
    step: "03",
    title: "Ikuti Navigasi & Ambil Sendiri",
    subtitle: "Jemput di kebun tanpa ongkir",
    description:
      "Gunakan navigasi koordinat presisi langsung menuju kebun petani. Periksa kesegaran bahan baku tangan pertama di tempat, angkut pesanan, dan selesaikan transaksi secara transparan.",
    iconName: "Navigation2",
    tip: "Bahan baku lebih renyah & tahan lama karena dipetik hanya beberapa jam sebelum diambil.",
  },
];

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Solusi Kami",
    links: [
      { label: "Peta Panen GIS", href: "#fitur" },
      { label: "Kemitraan UMKM Kuliner", href: "#mengapa" },
      { label: "WhatsApp Bot Petani", href: "#fitur" },
      { label: "Katalog Komoditas", href: "#" },
    ],
  },
  {
    title: "Komoditas Utama",
    links: [
      { label: "Cabai Rawit & Merah", href: "#" },
      { label: "Bawang Merah & Putih", href: "#" },
      { label: "Sayuran Daun Segar", href: "#" },
      { label: "Tomat & Palawija", href: "#" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang MitraPanen", href: "#" },
      { label: "Dampak Sosial Petani", href: "#" },
      { label: "Pusat Bantuan UMKM", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
];
