export interface UmkmNearbyFarm {
  id: string;
  namaKebun: string;
  petaniNama: string;
  jarakKm: number;
  estimasiMenit: number;
  alamat: string;
  komoditasTersedia: {
    nama: string;
    stokKg: number;
    hargaPerKg: number;
    hargaPasarPerKg: number;
  }[];
}

export const UMKM_NEARBY_FARMS: UmkmNearbyFarm[] = [
  {
    id: "kebun-1",
    namaKebun: "Kebun Berkah Lembang",
    petaniNama: "Pak Sukirno",
    jarakKm: 2.4,
    estimasiMenit: 10,
    alamat: "Jl. Raya Tangkuban Parahu No. 45, Lembang",
    komoditasTersedia: [
      {
        nama: "Cabai Rawit Merah",
        stokKg: 120,
        hargaPerKg: 22000,
        hargaPasarPerKg: 34000,
      },
      {
        nama: "Tomat Segar",
        stokKg: 75,
        hargaPerKg: 8500,
        hargaPasarPerKg: 14000,
      },
    ],
  },
  {
    id: "kebun-2",
    namaKebun: "Agro Sayur Cisarua",
    petaniNama: "Bu Sri Rahayu",
    jarakKm: 4.1,
    estimasiMenit: 16,
    alamat: "Desa Jambudipa, Cisarua",
    komoditasTersedia: [
      {
        nama: "Bawang Merah Super",
        stokKg: 90,
        hargaPerKg: 27000,
        hargaPasarPerKg: 38000,
      },
      {
        nama: "Selada Keriting Hidroponik",
        stokKg: 40,
        hargaPerKg: 16000,
        hargaPasarPerKg: 24000,
      },
    ],
  },
];
