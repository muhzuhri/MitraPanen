// Public & Landing Types
export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface WhyUsCard {
  id: string;
  title: string;
  highlight: string;
  description: string;
  iconName: "TrendingDown" | "MapPin" | "Store";
  tag: string;
  badgeColor: string;
}

export interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  mockupType: "gis-map" | "whatsapp-bot";
}

export interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "Search" | "CheckCircle2" | "Navigation2";
  tip: string;
}

export interface FooterLinkGroup {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

// Auth & User Role Types
export type UserRole = "petani" | "umkm" | "bumdes" | "admin";

export interface RoleOption {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: string;
  features: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneWhatsapp: string;
  role: UserRole;
  businessName?: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
}

// Petani & Kebun Types
export interface Kebun {
  id: string;
  petaniId: string;
  namaKebun: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radiusLayananKm: number;
  luasLahanM2?: number;
}

export interface StokPanen {
  id: string;
  kebunId: string;
  komoditasNama: string;
  varietas: string;
  jumlahStokKg: number;
  hargaPerKg: number;
  tanggalPanen: string;
  status: "tersedia" | "siap_petik" | "menipis" | "habis";
}

// UMKM & Pesanan Types
export interface Pesanan {
  id: string;
  nomorPesanan: string;
  umkmId: string;
  kebunId: string;
  totalHarga: number;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "siap_diambil" | "selesai" | "dibatalkan";
  tanggalPengambilan: string;
  metodePembayaran: "self_pickup_cash" | "qris_di_kebun";
}
