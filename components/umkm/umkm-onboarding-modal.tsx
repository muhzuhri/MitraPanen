"use client";

import { useState } from "react";
import {
  Store,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Loader2,
  Building2,
  UtensilsCrossed,
} from "lucide-react";

interface UmkmOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLocation?: (category: string, coords: { lat: number; lng: number }) => void;
}

export default function UmkmOnboardingModal({
  isOpen,
  onClose,
  onSaveLocation,
}: UmkmOnboardingModalProps) {
  const [selectedKategori, setSelectedKategori] = useState("Restoran");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    setIsLoadingGps(true);
    setGpsMessage(null);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const detectedLat = Number(position.coords.latitude.toFixed(4));
          const detectedLng = Number(position.coords.longitude.toFixed(4));
          setCoords({ lat: detectedLat, lng: detectedLng });
          setIsLoadingGps(false);
          setGpsMessage(
            `✅ Lokasi usaha terdeteksi: Latitude ${detectedLat}, Longitude ${detectedLng}`
          );
        },
        () => {
          // Fallback koordinat Sukasari / Lembang Bandung
          const fallbackLat = -6.8612;
          const fallbackLng = 107.5932;
          setCoords({ lat: fallbackLat, lng: fallbackLng });
          setIsLoadingGps(false);
          setGpsMessage(
            `✅ Titik default terpasang (Sukasari Bandung): ${fallbackLat}, ${fallbackLng}`
          );
        },
        { timeout: 7000 }
      );
    } else {
      const fallbackLat = -6.8612;
      const fallbackLng = 107.5932;
      setCoords({ lat: fallbackLat, lng: fallbackLng });
      setIsLoadingGps(false);
      setGpsMessage(
        `✅ Titik default disetel: ${fallbackLat}, ${fallbackLng}`
      );
    }
  };

  const handleFinish = () => {
    if (onSaveLocation && coords) {
      onSaveLocation(selectedKategori, coords);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-teal-800 border border-teal-200">
              Geo-SCM Onboarding
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Selamat datang di MitraPanen! 🌾
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          Sistem Geo-SCM menghubungkan dapur atau toko Anda langsung dengan kebun petani terdekat. Dapatkan bahan baku segar siap petik dengan harga petani tanpa biaya kirim perantara.
        </p>

        {/* Form Selection */}
        <div className="mt-6 space-y-4">
          {/* Dropdown Kategori Usaha */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Kategori Usaha Anda:
            </label>
            <div className="relative">
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
              >
                <option value="Katering">Katering (Porsi Besar & Rutin)</option>
                <option value="Restoran">Restoran & Rumah Makan</option>
                <option value="Retail">Retail & Toko Kelontong Bahan Makanan</option>
                <option value="Kafe & Minuman">Kafe & Kedai Minuman Segar</option>
                <option value="Industri Olahan">Industri Olahan Pangan Rumah Tangga</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Tombol Besar Dapatkan Lokasi Usaha Saya */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Titik Koordinat Dapur/Toko Anda:
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLoadingGps}
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-teal-500 bg-teal-50/60 p-4 text-xs font-black text-teal-800 hover:bg-teal-100/70 active:scale-[0.99] transition shadow-xs"
            >
              {isLoadingGps ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                  <span>Mendeteksi Sinyal GPS Dapur Anda...</span>
                </>
              ) : (
                <>
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs group-hover:scale-110 transition-transform">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm">📍 Dapatkan Lokasi Usaha Saya</span>
                </>
              )}
            </button>

            {/* Sukses Text Hijau */}
            {gpsMessage && (
              <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-bold text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">{gpsMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-7 pt-4 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-700 py-3.5 text-xs font-black text-white shadow-lg shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-800 transition active:scale-[0.98]"
          >
            <span>Mulai Cari Bahan Baku</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
