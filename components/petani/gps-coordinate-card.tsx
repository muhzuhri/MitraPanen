"use client";

import { MapPin, Compass, Navigation, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { KebunGpsLocation } from "@/data/petani/types";

interface GpsCoordinateCardProps {
  coords: KebunGpsLocation;
  isUpdatingGPS: boolean;
  onUpdateGPS: () => void;
}

export default function GpsCoordinateCard({
  coords,
  isUpdatingGPS,
  onUpdateGPS,
}: GpsCoordinateCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900">
            Titik Koordinat Geospasial (GIS)
          </h2>
          <p className="text-xs text-slate-500">
            Lokasi fisik lahan kebun Anda untuk radar UMKM
          </p>
        </div>
      </div>

      {/* Visual GPS Radar Indicator */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white text-center">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/30">
            <MapPin className="h-8 w-8 text-emerald-400 animate-bounce" />
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
            {coords.latitude}, {coords.longitude}
          </span>
          <p className="mt-2 text-[11px] text-slate-300">
            Status: <span className="text-emerald-400 font-bold">{coords.accuracy}</span>
          </p>
        </div>
      </div>

      {/* GPS Action Button */}
      <div className="space-y-3">
        <button
          onClick={onUpdateGPS}
          disabled={isUpdatingGPS}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isUpdatingGPS ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          ) : (
            <Navigation className="h-4 w-4 text-emerald-400" />
          )}
          <span>{isUpdatingGPS ? "Mendeteksi Satelit..." : "Perbarui Titik GPS dari Lokasi Ini"}</span>
        </button>

        <a
          href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>Buka di Google Maps</span>
        </a>
      </div>
    </div>
  );
}
