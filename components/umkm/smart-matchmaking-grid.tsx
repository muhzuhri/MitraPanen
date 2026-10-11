"use client";

import Link from "next/link";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Navigation,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
} from "lucide-react";
import { UMKM_NEARBY_FARMS } from "@/data/umkm/umkm-data";

export default function SmartMatchmakingGrid() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              Rekomendasi Terdekat (Smart Matchmaking)
            </h3>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-extrabold text-teal-800 border border-teal-200">
              Geo-AI Match
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Daftar kebun petani siap panen di sekitar dapur Anda dengan rute pengambilan mandiri tercepat.
          </p>
        </div>

        <Link
          href="/dashboard/umkm/peta"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
        >
          <span>Eksplorasi Seluruh Peta GIS</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {UMKM_NEARBY_FARMS.map((farm) => {
          const mainProduct = farm.komoditasTersedia[0];
          const secondProduct = farm.komoditasTersedia[1];

          return (
            <div
              key={farm.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:border-teal-300 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Header Card: Jarak & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-black text-teal-800 border border-teal-200">
                    <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>{farm.jarakKm} KM</span>
                    <span className="text-teal-400 font-normal">•</span>
                    <span className="text-teal-700 font-semibold">{farm.estimasiMenit} Menit</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{farm.rating}</span>
                  </div>
                </div>

                {/* Farm Name & Owner */}
                <div className="mt-3.5">
                  <h4 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                    {farm.namaKebun}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <span>Petani: {farm.petaniNama}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {farm.alamat}
                  </p>
                </div>

                {/* Available Commodities */}
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Komoditas Siap Petik Hari Ini:
                  </span>

                  {/* Primary Item */}
                  {mainProduct && (
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {mainProduct.nama}
                        </span>
                        <span className="font-black text-teal-700">
                          Rp {mainProduct.hargaPerKg.toLocaleString("id-ID")}/kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span>Sisa Kuota: <strong className="text-slate-800">{mainProduct.stokKg} Kg</strong></span>
                        <span className="line-through text-slate-400 text-[10px]">
                          Pasar Rp {mainProduct.hargaPasarPerKg.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Secondary Item (if available) */}
                  {secondProduct && (
                    <div className="rounded-2xl bg-slate-50/70 p-2.5 border border-slate-100/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 text-[11px]">
                          + {secondProduct.nama} ({secondProduct.stokKg} Kg)
                        </span>
                        <span className="font-bold text-slate-700 text-[11px]">
                          Rp {secondProduct.hargaPerKg.toLocaleString("id-ID")}/kg
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/dashboard/umkm/peta?farm=${farm.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-bold text-white shadow-xs transition"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Lihat di Peta</span>
                </Link>

                <Link
                  href={`/dashboard/umkm/pesanan?booking=${farm.id}`}
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 p-2.5 text-slate-700 transition"
                  title="Pesan Langsung"
                >
                  <ShoppingBag className="h-4 w-4 text-slate-600" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
