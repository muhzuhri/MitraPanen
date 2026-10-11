"use client";

import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CloudRain,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AiInsightBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-6 sm:p-7 text-white shadow-xl border border-teal-700/60">
      {/* Background High-Tech Grid & Lighting Effects */}
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-300 border border-teal-400/30 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>AI Predictive Geo-Intelligence</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Warning Text */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug">
                ⚠️ Peringatan AI: Harga Tomat diprediksi naik 15% minggu depan karena curah hujan tinggi. Rekomendasi: Amankan stok hari ini.
              </h3>
              <p className="mt-1.5 text-xs text-teal-100/80 leading-relaxed">
                Sensor iklim dan data histori Geo-SCM mendeteksi penurunan volume panen tomat di Lembang sebesar 22%. Mengamankan pesanan hari ini menghemat biaya operasional dapur Anda hingga Rp 180.000.
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-teal-200">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              <CloudRain className="h-3.5 w-3.5 text-sky-300" />
              Curah Hujan Tinggi: 88 mm/hari
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              <TrendingUp className="h-3.5 w-3.5 text-amber-300" />
              Tingkat Akurasi AI: 94.2%
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Mitra Kebun Tersedia: 3 Titik
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex sm:flex-col gap-2.5">
          <Link
            href="/dashboard/umkm/peta?search=tomat"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/30 hover:from-teal-300 hover:to-emerald-300 transition-all active:scale-[0.98]"
          >
            <span>Amankan Stok Hari Ini</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/umkm/peta"
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition text-center"
          >
            <span>Lihat Peta Panen</span>
            <ChevronRight className="h-3.5 w-3.5 text-teal-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
