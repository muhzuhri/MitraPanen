"use client";

import PetaMockupView from "@/components/umkm/peta-mockup-view";

export default function UmkmPetaPanenPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Peta Panen GIS Mitra Tani
            </h2>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-800 border border-teal-200">
              Radar Geospasial
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau sebaran titik panen petani lokal secara real-time dan pesan langsung untuk penjemputan mandiri.
          </p>
        </div>
      </div>

      {/* Fullscreen Map Mockup View */}
      <PetaMockupView />
    </div>
  );
}
