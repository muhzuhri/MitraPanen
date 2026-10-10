export interface PetaniHarvestSummary {
  id: string;
  komoditas: string;
  varietas: string;
  stokTersediaKg: number;
  hargaPerKg: number;
  jadwalPanen: string;
  status: "siap_petik" | "proses_petik" | "habis";
}

export const PETANI_SAMPLE_HARVESTS: PetaniHarvestSummary[] = [
  {
    id: "harv-1",
    komoditas: "Cabai Rawit Merah",
    varietas: "Ori 212",
    stokTersediaKg: 120,
    hargaPerKg: 22000,
    jadwalPanen: "Hari Ini, Pukul 14.00 WIB",
    status: "siap_petik",
  },
  {
    id: "harv-2",
    komoditas: "Tomat Beef Super",
    varietas: "Mawar Indah",
    stokTersediaKg: 85,
    hargaPerKg: 8500,
    jadwalPanen: "Besok Pagi, 07.00 WIB",
    status: "siap_petik",
  },
  {
    id: "harv-3",
    komoditas: "Bawang Merah Brebes",
    varietas: "Bima Brebes Super",
    stokTersediaKg: 200,
    hargaPerKg: 28000,
    jadwalPanen: "2 Hari Lagi",
    status: "proses_petik",
  },
];

export const PETANI_STATS = {
  totalPenjualanBulanIni: "Rp 14.850.000",
  transaksiSelesai: 48,
  pelangganUmkmSetia: 12,
  ratingKepuasan: "4.9 / 5.0",
};
