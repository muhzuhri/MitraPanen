"use client";

import AiInsightBanner from "@/components/umkm/beranda/ai-insight-banner";
import UmkmStatsCards from "@/components/umkm/beranda/umkm-stats-cards";
import SmartMatchmakingGrid from "@/components/umkm/beranda/smart-matchmaking-grid";
import { useUmkm } from "@/components/umkm/layout/umkm-context";

export default function UmkmHomePage() {
  const { profile } = useUmkm();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bersih */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Ringkasan {profile?.namaUsaha || "Dapur UMKM"}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau pasokan segar dari kebun petani mitra dan aktivitas pesanan Anda.
        </p>
      </div>

      {/* Banner Wawasan AI Singkat */}
      <AiInsightBanner />

      {/* Statistik Riil */}
      <UmkmStatsCards />

      {/* Kebun Mitra Terdaftar */}
      <SmartMatchmakingGrid />
    </div>
  );
}
