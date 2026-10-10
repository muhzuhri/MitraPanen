"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sprout,
  X,
  Loader2,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKomoditas: string;
  setSelectedKomoditas: (v: string) => void;
  locationState: {
    detected: boolean;
    lat?: number;
    lng?: number;
    loading: boolean;
    message?: string;
  };
  onGetLocation: () => void;
  onSave: () => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  selectedKomoditas,
  setSelectedKomoditas,
  locationState,
  onGetLocation,
  onSave,
}: OnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Setup Pin Lokasi Kebun
              </h3>
              <p className="text-xs text-slate-500">
                Akurasi GPS memungkinkan UMKM terdekat menemukan Anda
              </p>
            </div>
          </div>

          {/* Form Step Body */}
          <div className="mt-6 space-y-5">
            {/* GPS Detection Box */}
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Titik Koordinat Ladang Anda
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    {locationState.message ||
                      "Klik tombol di samping untuk mendeteksi koordinat kebun Anda via sensor perangkat."}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={onGetLocation}
                  disabled={locationState.loading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {locationState.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>
                    {locationState.loading
                      ? "Mendeteksi Sinyal..."
                      : "Deteksi GPS Sekarang"}
                  </span>
                </button>

                {locationState.detected && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1.5 rounded-lg">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      {locationState.lat}, {locationState.lng}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Komoditas Unggulan */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Fokus Komoditas Utama
              </label>
              <select
                value={selectedKomoditas}
                onChange={(e) => setSelectedKomoditas(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="Sayuran Buah & Rempah">
                  Sayuran Buah & Rempah (Cabai, Tomat, Bawang)
                </option>
                <option value="Sayuran Daun Hijau">
                  Sayuran Daun Hijau (Bayam, Kangkung, Selada)
                </option>
                <option value="Umbi-Umbian & Kentang">
                  Umbi-Umbian & Kentang
                </option>
                <option value="Buah-Buahan Kebun">
                  Buah-Buahan Kebun Lokal
                </option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Nanti Saja
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
            >
              <span>Simpan & Aktifkan Kebun</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
