"use client";

import { useState } from "react";
import UmkmOnboardingModal from "@/components/umkm/beranda/umkm-onboarding-modal";
import AiInsightBanner from "@/components/umkm/beranda/ai-insight-banner";
import UmkmStatsCards from "@/components/umkm/beranda/umkm-stats-cards";
import SmartMatchmakingGrid from "@/components/umkm/beranda/smart-matchmaking-grid";
import { MapPin } from "lucide-react";

export default function UmkmHomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Modal Onboarding GPS */}
      <UmkmOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Hero Welcome Header & Reopen GPS */}
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

        <button
          onClick={() => setShowOnboarding(true)}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-teal-300 transition"
        >
          <MapPin className="h-3.5 w-3.5 text-teal-600" />
          <span>Kalibrasi GPS Dapur</span>
        </button>
      </div>

      {/* 2. Banner AI Predictive Insights */}
      <AiInsightBanner />

      {/* 3. Kartu Statistik Operasional */}
      <UmkmStatsCards />

      {/* 4. Rekomendasi Terdekat (Smart Matchmaking) */}
      <SmartMatchmakingGrid />
    </div>
  );
}
