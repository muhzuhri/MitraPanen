"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Navigation,
  ShoppingBag,
  Clock,
  Compass,
  Crosshair,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { UMKM_NEARBY_FARMS, UmkmNearbyFarm } from "@/data/umkm/umkm-data";

export default function PetaMockupView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState("5 KM");
  const [selectedFarm, setSelectedFarm] = useState<UmkmNearbyFarm>(UMKM_NEARBY_FARMS[0]);
  const [showDetailCard, setShowDetailCard] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Pin coordinates for mockup map display
  const farmPins = [
    { farm: UMKM_NEARBY_FARMS[0], top: "38%", left: "42%" },
    { farm: UMKM_NEARBY_FARMS[1], top: "54%", left: "68%" },
    { farm: UMKM_NEARBY_FARMS[2], top: "66%", left: "28%" },
  ];

  return (
    <div className="relative h-[calc(100vh-8.5rem)] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-md">
      {/* 1. MOCKUP PETA BASE */}
      <div className="relative h-full w-full bg-slate-200 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />

        <svg
          className="absolute inset-0 h-full w-full opacity-40 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -50 200 Q 250 150 450 350 T 950 400 T 1500 300"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="12"
          />
          <path
            d="M -50 200 Q 250 150 450 350 T 950 400 T 1500 300"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="6"
          />
          <path
            d="M 300 -50 Q 400 300 350 700 T 500 1200"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="8"
          />
          <path
            d="M 300 -50 Q 400 300 350 700 T 500 1200"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <ellipse cx="45%" cy="40%" rx="180" ry="120" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <ellipse cx="45%" cy="40%" rx="320" ry="240" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
        </svg>

        {/* Central Buyer Location Marker */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
          style={{ top: "45%", left: "45%" }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute h-24 w-24 rounded-full bg-teal-500/20 animate-ping" />
            <span className="absolute h-16 w-16 rounded-full bg-teal-500/30" />
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-xl border-2 border-white">
              <Crosshair className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-1 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md border border-slate-700 whitespace-nowrap backdrop-blur-xs">
            📍 Dapur Anda (Sukasari)
          </div>
        </div>

        {/* Interactive Farm Pins */}
        {farmPins.map(({ farm, top, left }) => {
          const isSelected = selectedFarm.id === farm.id;
          return (
            <button
              key={farm.id}
              onClick={() => {
                setSelectedFarm(farm);
                setShowDetailCard(true);
              }}
              style={{ top, left }}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform hover:scale-110 active:scale-95 group focus:outline-none`}
            >
              <div className="relative">
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping" />
                )}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-xl transition-all border-2 ${
                    isSelected
                      ? "bg-emerald-600 text-white border-white scale-110 ring-4 ring-emerald-500/30"
                      : "bg-white text-emerald-700 border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <MapPin className="h-6 w-6 fill-current" />
                </div>
              </div>

              <div
                className={`mt-1.5 rounded-xl px-2.5 py-1 text-[10px] font-black shadow-md border whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-emerald-950 text-emerald-100 border-emerald-700 scale-105"
                    : "bg-white text-slate-800 border-slate-200 group-hover:border-emerald-300"
                }`}
              >
                <span>{farm.namaKebun.split(" ")[1] || farm.namaKebun}</span>
                <span className="ml-1 text-emerald-500 font-extrabold">• {farm.jarakKm} km</span>
              </div>
            </button>
          );
        })}

        {/* Controls */}
        <div className="absolute right-4 bottom-6 z-20 flex flex-col gap-2">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/90 shadow-md backdrop-blur-md overflow-hidden">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
              className="p-2.5 text-slate-700 hover:bg-slate-100 transition border-b border-slate-200"
              title="Perbesar Peta"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
              className="p-2.5 text-slate-700 hover:bg-slate-100 transition"
              title="Perkecil Peta"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur-md">
            <Compass className="h-5 w-5 text-teal-600" />
          </div>
        </div>
      </div>

      {/* 2. FLOATING SEARCH BAR */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-30 pointer-events-none">
        <div className="mx-auto max-w-3xl pointer-events-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
            <div className="relative flex-1 w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4 text-teal-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari komoditas (misal: Cabai rawit, Tomat, Bawang)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-bold text-slate-500">Radius:</span>
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-teal-500 focus:outline-none shadow-2xs"
                >
                  <option value="3 KM">Di bawah 3 KM</option>
                  <option value="5 KM">Di bawah 5 KM</option>
                  <option value="10 KM">Di bawah 10 KM</option>
                  <option value="Semua">Semua Radius</option>
                </select>
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FLOATING DETAIL CARD */}
      {showDetailCard && selectedFarm && (
        <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-30 max-w-sm w-[calc(100%-2rem)] sm:w-96 animate-in slide-in-from-bottom-4 duration-300">
          <div className="relative rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setShowDetailCard(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Tutup Kartu"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-6">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200">
                  Terverifikasi GIS
                </span>
                <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Rute {selectedFarm.estimasiMenit} Menit
                </span>
              </div>

              <h3 className="mt-1.5 text-base font-black text-slate-900 leading-tight">
                {selectedFarm.namaKebun}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Petani: {selectedFarm.petaniNama}
              </p>
            </div>

            <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3">
              {selectedFarm.komoditasTersedia.map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-black text-slate-800">{c.nama}</p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      Sisa Stok: {c.stokKg} Kg Siap Petik
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-teal-700">
                      Rp {c.hargaPerKg.toLocaleString("id-ID")}/kg
                    </p>
                    <p className="text-[10px] line-through text-slate-400">
                      Pasar Rp {c.hargaPasarPerKg.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  Jarak: <strong className="text-slate-800 font-bold">{selectedFarm.jarakKm} KM</strong> dari Dapur Anda
                </span>
                <span className="font-bold text-emerald-600">Self-Pick Up</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-xs font-black text-white shadow-md shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 transition active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Pesan & Ambil Sekarang</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${selectedFarm.latitude},${selectedFarm.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 px-3 text-slate-700 transition"
                title="Buka Navigasi Google Maps"
              >
                <Navigation className="h-4 w-4 text-teal-600" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL DIALOG PEMESANAN */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-base font-black text-slate-900">
              Konfirmasi Pemesanan Panen
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {selectedFarm.namaKebun} ({selectedFarm.petaniNama}) • Jarak {selectedFarm.jarakKm} KM
            </p>

            <div className="mt-4 rounded-2xl bg-teal-50/70 p-4 border border-teal-200/70 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Komoditas</span>
                <span>{selectedFarm.komoditasTersedia[0].nama}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Jumlah Ambil</span>
                <span>50 Kg</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>Harga per Kg</span>
                <span>Rp {selectedFarm.komoditasTersedia[0].hargaPerKg.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t border-teal-200 pt-2 flex justify-between font-black text-teal-900 text-sm">
                <span>Total Estimasi</span>
                <span>Rp {(50 * selectedFarm.komoditasTersedia[0].hargaPerKg).toLocaleString("id-ID")}</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              *Pesanan akan langsung masuk ke sistem petani dan dapat diambil mandiri menggunakan kode QR pickup.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <Link
                href="/umkm/pesanan"
                className="flex-1 rounded-xl bg-teal-600 py-2.5 text-xs font-black text-white text-center hover:bg-teal-700 transition shadow-xs"
              >
                Konfirmasi Pesanan
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
