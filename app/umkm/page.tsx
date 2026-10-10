"use client";

import Link from "next/link";
import {
  Store,
  MapPin,
  Clock,
  Search,
  Sliders,
  Navigation,
  ArrowLeft,
  CheckCircle2,
  TrendingDown,
  ShoppingBag,
} from "lucide-react";
import { UMKM_NEARBY_FARMS } from "@/data/umkm/umkm-data";

export default function UmkmDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs"
            >
              <Store className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm">
                  Radar Panen Mitra UMKM
                </span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                  Dapur Sambal Bu Lisa
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lokasi: Jl. Setiabudi, Bandung • Radius Terpasang: 5.0 KM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Keluar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Radius Filter Strip */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Cari komoditas (misal: Cabai rawit, Tomat, Bawang)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Radius:</span>
              <button
                type="button"
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
              >
                5 KM
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                10 KM
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                25 KM
              </button>
            </div>
          </div>
        </div>

        {/* Nearby Farm Listings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Kebun Petani Siap Panen Terdekat
            </h3>
            <p className="text-xs text-slate-500">
              Pesan dan amankan kuota panen, lalu ambil langsung (Self-Pick Up) tanpa ongkir.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {UMKM_NEARBY_FARMS.map((farm) => (
              <div
                key={farm.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      <span>{farm.jarakKm} km dari dapur Anda</span>
                      <span className="text-slate-400">• Rute {farm.estimasiMenit} Menit</span>
                    </div>
                    <h4 className="mt-1 text-base font-extrabold text-slate-900">
                      {farm.namaKebun}
                    </h4>
                    <p className="text-xs text-slate-500">{farm.petaniNama}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    Terverifikasi GIS
                  </span>
                </div>

                {/* Available Commodities in This Farm */}
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Komoditas Siap Petik:
                  </p>
                  {farm.komoditasTersedia.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{c.nama}</p>
                        <p className="text-[11px] text-slate-500">
                          Tersedia: {c.stokKg} kg siap petik
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-teal-700">
                          Rp {c.hargaPerKg.toLocaleString("id-ID")} / kg
                        </p>
                        <p className="text-[10px] line-through text-slate-400">
                          Pasar: Rp {c.hargaPasarPerKg.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-teal-600 py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                  >
                    Booking Stok Panen
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Rute GPS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
