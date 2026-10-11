"use client";

import {
  Wallet,
  Truck,
  TrendingDown,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function UmkmStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* KARTU 1: Total Belanja Bulan Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 shadow-xs">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-800 border border-emerald-200">
            <TrendingDown className="h-3 w-3 text-emerald-600" />
            -18% vs Pasar
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-slate-500">
            Total Belanja Bulan Ini
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Rp 4.850.000
          </h3>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="text-teal-700 font-bold">140 Kg komoditas segar</span>
            <span>dari 4 mitra tani</span>
          </p>
        </div>
      </div>

      {/* KARTU 2: Penghematan Ongkir (Self-Pick Up) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs">
            <Truck className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-black text-teal-800 border border-teal-200">
            <CheckCircle2 className="h-3 w-3 text-teal-600" />
            100% Tanpa Ekspedisi
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-slate-500">
            Penghematan Ongkir (Self-Pick Up)
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-emerald-600">
            Rp 640.000
          </h3>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="text-emerald-700 font-bold">8 trip mandiri</span>
            <span>rute terpendek GIS</span>
          </p>
        </div>
      </div>

      {/* KARTU 3: Pesanan Siap Ambil Hari Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shadow-xs">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800 border border-amber-200 animate-pulse">
            QR Ready
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-slate-500">
            Pesanan Siap Ambil Hari Ini
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            2 Pesanan
          </h3>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="text-amber-700 font-bold">Cabai & Tomat</span>
            <span>est. 15-20 mnt perjalanan</span>
          </p>
        </div>
      </div>

      {/* KARTU 4: Rata-Rata Jarak Kebun Mitra */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-xs">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-black text-sky-800 border border-sky-200">
            Radius Cepat
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-slate-500">
            Rata-rata Jarak Kebun Mitra
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            2.1 KM
          </h3>
          <p className="mt-1.5 text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span className="text-sky-700 font-bold">10 menit berkendara</span>
            <span>dari dapur Setiabudi</span>
          </p>
        </div>
      </div>
    </div>
  );
}
