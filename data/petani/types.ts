export type PanenStatus = "tersedia" | "siap_petik" | "menipis" | "habis";

export interface PanenItem {
  id: string;
  nama: string;
  kategori: string;
  varietas: string;
  stokKg: number;
  hargaPerKg: number;
  status: PanenStatus;
  catatanPetik?: string;
  terakhirUpdate: string;
}

export interface KomoditasMaster {
  id: string;
  nama: string;
  kategori: string;
}

export type OrderStatus = "menunggu" | "disiapkan" | "selesai";

export interface OrderItem {
  id: string;
  nomorPesanan: string;
  namaUmkm: string;
  kategori: string;
  jarak: string;
  pesanan: string;
  totalHarga: string;
  totalHargaNum?: number;
  jadwalAmbil: string;
  status: string;
  statusColor?: string;
  noHpUmkm: string;
  catatan?: string;
}

export interface PetaniDashboardStats {
  totalPendapatan: number;
  pesananMenunggu: number;
  stokAktifKg: number;
  jumlahKomoditas: number;
}

export interface PetaniProfile {
  fullName: string;
  initials: string;
  farmName: string;
  phone: string;
  address?: string;
  commodities?: string;
  landArea?: string;
}

export interface KebunGpsLocation {
  latitude: number;
  longitude: number;
  accuracy: string;
  lastUpdated: string;
}

export interface WhatsAppMessage {
  sender: "petani" | "bot";
  text: string;
  time: string;
}

export interface WhatsAppCommand {
  command: string;
  tujuan: string;
  keterangan: string;
  badge: string;
}
