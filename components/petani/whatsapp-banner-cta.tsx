"use client";

import Link from "next/link";
import { Bot, ArrowRight, Sparkles, PhoneCall } from "lucide-react";

export default function WhatsappBannerCta() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/10">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI Supply Chain Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Kelola Stok Langsung dari Chat WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Tidak perlu selalu membuka laptop! Cukup ketik pesan singkat seperti{" "}
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">
              PANEN CABAI 50 40000
            </span>{" "}
            ke Bot WhatsApp resmi, sistem akan otomatis mendaftarkannya ke radar GIS.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/petani/whatsapp"
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-emerald-900 shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
          >
            <PhoneCall className="h-4 w-4 text-emerald-600" />
            <span>Buka Asisten Bot</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
