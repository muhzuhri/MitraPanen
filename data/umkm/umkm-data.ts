export interface UmkmProfile {
  namaUsaha: string;
  pemilik: string;
  email: string;
  phoneWhatsapp: string;
  kategori: string;
  alamat: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface UmkmCommodityItem {
  nama: string;
  stokKg: number;
  hargaPerKg: number;
  hargaPasarPerKg: number;
  kategori: string;
}

export interface UmkmNearbyFarm {
  id: string;
  namaKebun: string;
  petaniNama: string;
  phone: string;
  jarakKm: number;
  estimasiMenit: number;
  alamat: string;
  rating: number;
  terverifikasiGis: boolean;
  latitude: number;
  longitude: number;
  komoditasTersedia: UmkmCommodityItem[];
}

export interface UmkmOrder {
  id: string;
  nomorPesanan: string;
  namaKebun: string;
  namaPetani: string;
  noHpPetani: string;
  komoditas: string;
  jumlahKg: number;
  totalHarga: number;
  penghematan: number;
  status: "siap_diambil" | "sedang_disiapkan" | "selesai" | "dibatalkan";
  jarakKm: number;
  estimasiMenit: number;
  jadwalAmbil: string;
  alamatKebun: string;
  latitude: number;
  longitude: number;
  kodeQrPickup: string;
}

export const DEFAULT_UMKM_PROFILE: UmkmProfile = {
  namaUsaha: "Dapur Sambal Bu Lisa",
  pemilik: "Lisa Anggraeni",
  email: "bulisa@kulinerbandung.com",
  phoneWhatsapp: "081298765432",
  kategori: "Restoran & Katering",
  alamat: "Jl. Dr. Setiabudi No. 128, Gegerkalong, Sukasari, Kota Bandung",
  latitude: -6.8612,
  longitude: 107.5932,
  radiusKm: 5.0,
};

export const UMKM_NEARBY_FARMS: UmkmNearbyFarm[] = [
  {
    id: "farm-1",
    namaKebun: "Kebun Berkah Lembang",
    petaniNama: "Pak Sukirno",
    phone: "081234567891",
    jarakKm: 1.2,
    estimasiMenit: 7,
    alamat: "Jl. Raya Tangkuban Parahu No. 45, Lembang",
    rating: 4.9,
    terverifikasiGis: true,
    latitude: -6.8124,
    longitude: 107.6189,
    komoditasTersedia: [
      {
        nama: "Cabai Rawit Merah",
        stokKg: 50,
        hargaPerKg: 22000,
        hargaPasarPerKg: 34000,
        kategori: "Sayuran Buah & Rempah",
      },
      {
        nama: "Cabai Merah Keriting",
        stokKg: 75,
        hargaPerKg: 26000,
        hargaPasarPerKg: 39000,
        kategori: "Sayuran Buah & Rempah",
      },
    ],
  },
  {
    id: "farm-2",
    namaKebun: "Agro Sayur Cisarua",
    petaniNama: "Bu Sri Rahayu",
    phone: "081234567892",
    jarakKm: 2.5,
    estimasiMenit: 12,
    alamat: "Desa Jambudipa, Kec. Cisarua, Bandung Barat",
    rating: 4.8,
    terverifikasiGis: true,
    latitude: -6.8241,
    longitude: 107.5891,
    komoditasTersedia: [
      {
        nama: "Tomat Segar Petik Pagi",
        stokKg: 90,
        hargaPerKg: 8500,
        hargaPasarPerKg: 14000,
        kategori: "Sayuran Buah",
      },
      {
        nama: "Selada Keriting Hidroponik",
        stokKg: 40,
        hargaPerKg: 16000,
        hargaPasarPerKg: 24000,
        kategori: "Sayuran Daun",
      },
    ],
  },
  {
    id: "farm-3",
    namaKebun: "Tani Makmur Parongpong",
    petaniNama: "Kang Asep Kurnia",
    phone: "081234567893",
    jarakKm: 3.8,
    estimasiMenit: 15,
    alamat: "Jl. Kolonel Masturi KM 4, Parongpong",
    rating: 4.9,
    terverifikasiGis: true,
    latitude: -6.8415,
    longitude: 107.5782,
    komoditasTersedia: [
      {
        nama: "Bawang Merah Super",
        stokKg: 85,
        hargaPerKg: 27000,
        hargaPasarPerKg: 38000,
        kategori: "Rempah & Bumbu",
      },
      {
        nama: "Buncis Prancis",
        stokKg: 60,
        hargaPerKg: 14000,
        hargaPasarPerKg: 21000,
        kategori: "Sayuran Polong",
      },
    ],
  },
];

export const UMKM_INITIAL_ORDERS: UmkmOrder[] = [
  {
    id: "ord-1",
    nomorPesanan: "MP-UMKM-2026-081",
    namaKebun: "Kebun Berkah Lembang",
    namaPetani: "Pak Sukirno",
    noHpPetani: "081234567891",
    komoditas: "Cabai Rawit Merah",
    jumlahKg: 50,
    totalHarga: 1100000,
    penghematan: 600000,
    status: "siap_diambil",
    jarakKm: 1.2,
    estimasiMenit: 7,
    jadwalAmbil: "Hari Ini, 14:00 - 17:00 WIB",
    alamatKebun: "Jl. Raya Tangkuban Parahu No. 45, Lembang",
    latitude: -6.8124,
    longitude: 107.6189,
    kodeQrPickup: "PICKUP-81-SUKIRNO",
  },
  {
    id: "ord-2",
    nomorPesanan: "MP-UMKM-2026-083",
    namaKebun: "Agro Sayur Cisarua",
    namaPetani: "Bu Sri Rahayu",
    noHpPetani: "081234567892",
    komoditas: "Tomat Segar Petik Pagi",
    jumlahKg: 30,
    totalHarga: 255000,
    penghematan: 165000,
    status: "siap_diambil",
    jarakKm: 2.5,
    estimasiMenit: 12,
    jadwalAmbil: "Hari Ini, 15:30 - 18:00 WIB",
    alamatKebun: "Desa Jambudipa, Kec. Cisarua, Bandung Barat",
    latitude: -6.8241,
    longitude: 107.5891,
    kodeQrPickup: "PICKUP-83-SRI",
  },
  {
    id: "ord-3",
    nomorPesanan: "MP-UMKM-2026-074",
    namaKebun: "Tani Makmur Parongpong",
    namaPetani: "Kang Asep Kurnia",
    noHpPetani: "081234567893",
    komoditas: "Bawang Merah Super",
    jumlahKg: 40,
    totalHarga: 1080000,
    penghematan: 440000,
    status: "selesai",
    jarakKm: 3.8,
    estimasiMenit: 15,
    jadwalAmbil: "8 Oktober 2026, 11:20 WIB",
    alamatKebun: "Jl. Kolonel Masturi KM 4, Parongpong",
    latitude: -6.8415,
    longitude: 107.5782,
    kodeQrPickup: "PICKUP-74-ASEP",
  },
];
