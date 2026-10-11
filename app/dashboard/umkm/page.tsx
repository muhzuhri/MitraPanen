"use client";

import { useState } from "react";
import UmkmOnboardingModal from "@/components/umkm/umkm-onboarding-modal";
import AiInsightBanner from "@/components/umkm/ai-insight-banner";
import UmkmStatsCards from "@/components/umkm/umkm-stats-cards";
import SmartMatchmakingGrid from "@/components/umkm/smart-matchmaking-grid";
import { Sparkles, MapPin, SlidersHorizontal, RefreshCw } from "lucide-react";

export default function UmkmDashboardHomePage() {
  // State Onboarding Modal GPS (default true untuk demo sesuai spesifikasi)
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ==================================================================== */}
      {/* KOMPONEN 1: MODAL ONBOARDING GPS (POP-UP)                           */}
      {/* ==================================================================== */}
      <UmkmOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Hero Welcome & Quick Reopen Onboarding Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Dashboard Geo-SCM Pembeli
            </h2>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-800 border border-teal-200">
              High-Tech SCM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimalisasi rantai pasok dapur Anda berbasis titik radius kebun petani lokal.
          </p>
        </div>

        {/* Tombol Demo Buka Ulang Onboarding GPS */}
        <button
          onClick={() => setShowOnboarding(true)}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-teal-300 transition"
        >
          <MapPin className="h-3.5 w-3.5 text-teal-600" />
          <span>Kalibrasi GPS Dapur</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* KOMPONEN 2: KONTEN BERANDA                                          */}
      {/* ==================================================================== */}
      
      {/* 1. Dashboard AI (Banner Lebar Bergradien Emerald Gelap) */}
      <AiInsightBanner />

      {/* 2. Widget Statistik: Total Belanja & Penghematan Ongkir (Self-Pick Up) */}
      <UmkmStatsCards />

      {/* 3. Seksi Rekomendasi Terdekat (Smart Matchmaking) 3 Kartu Petani */}
      <SmartMatchmakingGrid />
    </div>
  );
}
