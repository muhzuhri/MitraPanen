"use client";

import { useState } from "react";
import {
  Menu,
  Sparkles,
  MapPin,
  Bell,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { UmkmProfile } from "@/data/umkm/umkm-data";

interface UmkmTopbarProps {
  profile: UmkmProfile;
  onOpenMobile: () => void;
}

export default function UmkmTopbar({ profile, onOpenMobile }: UmkmTopbarProps) {
  const [showAiPopover, setShowAiPopover] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          type="button"
          aria-label="Buka Menu Navigasi"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              Halo, <span className="text-teal-600">{profile.namaUsaha}</span>!
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Mitra Terverifikasi
            </span>
          </div>
          <p className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-teal-600" />
            <span>Lokasi Operasional Dapur Aktif: {profile.alamat.split(",")[0]}</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold">Radius Pantau {profile.radiusKm} KM</span>
          </p>
        </div>
      </div>

      {/* Right: AI Sparkles & Quick Info */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* GPS Active Pill */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          <span>GPS Live SCM</span>
        </div>

        {/* AI Notification Button (Sparkles) with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAiPopover(!showAiPopover)}
            type="button"
            className={`relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-xs ${
              showAiPopover
                ? "border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
            </div>
            <span className="hidden sm:inline font-bold">Wawasan AI</span>
            <span className="rounded-full bg-teal-600 px-1.5 py-0.2 text-[10px] font-extrabold text-white">
              1
            </span>
          </button>

          {/* AI Intelligence Popover */}
          {showAiPopover && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Wawasan & Prediksi AI Pasar
                    </h4>
                    <p className="text-[10px] text-slate-500">Real-time SCM Intelligence</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  Prioritas Tinggi
                </span>
              </div>

              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold text-amber-950">
                        Prediksi Kenaikan Harga Tomat (+15%)
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-amber-900">
                        Curah hujan tinggi di sentra Lembang memicu potensi kelangkaan pasokan minggu depan. Kami menyarankan untuk memesan stok panen hari ini.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-2.5 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    <span className="text-[11px] font-bold text-slate-800">
                      Stok Cabai Terdekat Tersedia
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-teal-700">1.2 KM (Rp 22.000)</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAiPopover(false)}
                  className="w-full rounded-xl bg-teal-600 py-2 text-center text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
