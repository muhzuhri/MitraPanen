"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AiInsightBanner() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-teal-50/80 border border-teal-200/70 p-3.5 sm:p-4 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="text-slate-700">
          <strong className="text-slate-900 font-bold">Wawasan Panen:</strong> Pasokan sayur & komoditas segar tersedia langsung dari kebun petani sekitar.
        </p>
      </div>

      <Link
        href="/umkm/peta"
        className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 shrink-0"
      >
        <span>Lihat Peta Panen</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
