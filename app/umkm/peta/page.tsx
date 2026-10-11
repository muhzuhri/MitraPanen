"use client";

import PetaMockupView from "@/components/umkm/peta/peta-mockup-view";

export default function UmkmPetaPanenPage() {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Peta Lokasi Kebun
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Peta sebaran kebun petani mitra untuk penjemputan hasil panen.
        </p>
      </div>

      <PetaMockupView />
    </div>
  );
}
