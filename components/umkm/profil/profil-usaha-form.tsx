"use client";

import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Compass,
  CheckCircle2,
  Save,
  Loader2,
  Crosshair,
  Building2,
} from "lucide-react";
import { DEFAULT_UMKM_PROFILE, UmkmProfile } from "@/data/umkm/umkm-data";

export default function ProfilUsahaForm() {
  const [profile, setProfile] = useState<UmkmProfile>(DEFAULT_UMKM_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateGps = () => {
    setIsGpsLoading(true);
    setNotification(null);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setProfile((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
          setIsGpsLoading(false);
          setNotification(
            `📍 Titik GPS Dapur berhasil diperbarui ke: ${lat}, ${lng}`
          );
        },
        () => {
          const fallbackLat = -6.8612;
          const fallbackLng = 107.5932;
          setProfile((prev) => ({
            ...prev,
            latitude: fallbackLat,
            longitude: fallbackLng,
          }));
          setIsGpsLoading(false);
          setNotification(
            `📍 Koordinat disetel ke zona Sukasari Bandung: ${fallbackLat}, ${fallbackLng}`
          );
        },
        { timeout: 7000 }
      );
    } else {
      setIsGpsLoading(false);
      setNotification("⚠️ Browser tidak mendukung fitur Geolocation.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    setTimeout(() => {
      setIsSaving(false);
      setNotification("✅ Profil usaha & koordinat dapur berhasil disimpan!");
      setTimeout(() => setNotification(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {notification && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Profil Usaha & Lokasi Dapur
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur informasi badan usaha dan titik acuan GPS dapur untuk perhitungan radius panen petani.
        </p>
      </div>

      {/* Grid 2 Kolom (Kiri: Form Edit | Kanan: Card Lokasi Dapur & Peta Mini) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* KOLOM KIRI (7 SPAN): FORM EDIT PROFIL USAHA */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Informasi Entitas Usaha
              </h3>
              <p className="text-xs text-slate-500">
                Data resmi yang digunakan pada nota pemesanan dan verifikasi Geo-SCM.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Usaha / Restoran / Toko
              </label>
              <div className="relative">
                <Store className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={profile.namaUsaha}
                  onChange={(e) =>
                    setProfile({ ...profile, namaUsaha: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Operasional
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor WhatsApp Dapur
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={profile.phoneWhatsapp}
                    onChange={(e) =>
                      setProfile({ ...profile, phoneWhatsapp: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Usaha
              </label>
              <select
                value={profile.kategori}
                onChange={(e) =>
                  setProfile({ ...profile, kategori: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
              >
                <option value="Restoran & Katering">Restoran & Katering</option>
                <option value="Katering Skala Besar">Katering Skala Besar</option>
                <option value="Retail & Toko Sayur">Retail & Toko Sayur</option>
                <option value="Kafe & Minuman Buah">Kafe & Minuman Buah</option>
                <option value="Industri Olahan Pangan">Industri Olahan Pangan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Fisik Dapur / Outlet Utama
              </label>
              <textarea
                rows={3}
                required
                value={profile.alamat}
                onChange={(e) =>
                  setProfile({ ...profile, alamat: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition shadow-2xs"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-xs font-black text-white shadow-md shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 transition active:scale-[0.98] disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan Perubahan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Profil Usaha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* KOLOM KANAN (5 SPAN): CARD LOKASI DAPUR & PETA MINI */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Lokasi Dapur / Toko
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Titik Pusat Radius Penjemputan
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200">
                Live GPS
              </span>
            </div>

            {/* PETA MINI PLACEHOLDER */}
            <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-gray-200 border border-slate-300 shadow-inner select-none flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />

              <div className="absolute h-36 w-36 rounded-full border border-teal-500/30" />
              <div className="absolute h-24 w-24 rounded-full border border-teal-500/50" />
              <div className="absolute h-12 w-12 rounded-full bg-teal-500/20 animate-ping" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-xl border-2 border-white">
                  <Crosshair className="h-5 w-5" />
                </div>
                <span className="mt-1.5 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md border border-slate-700">
                  📍 Titik Dapur Anda
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/90 p-2 text-center text-[10px] font-mono font-bold text-slate-800 shadow-xs backdrop-blur-xs border border-white">
                {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Latitude
                </span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {profile.latitude}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Longitude
                </span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {profile.longitude}
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
              Titik koordinat ini menentukan daftar kebun petani terdekat yang muncul pada radar penjemputan mandiri Anda.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleUpdateGps}
              disabled={isGpsLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-black text-white shadow-md transition active:scale-[0.98] disabled:opacity-60"
            >
              {isGpsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                  <span>Mendeteksi Lokasi GPS Anda...</span>
                </>
              ) : (
                <>
                  <Compass className="h-4 w-4 text-teal-400" />
                  <span>Perbarui Lokasi GPS Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
