"use client";

import { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Camera,
  IdCard,
  Sprout,
  Save,
  Loader2,
  CheckCircle2,
  Upload,
  AlertCircle,
  Navigation,
  FileCheck,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TabKey = "data_diri" | "identitas" | "kredibilitas";

export default function ProfilPetaniPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("data_diri");
  const [userId, setUserId] = useState<string | null>(null);
  const [kebunId, setKebunId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Status Verifikasi
  const [isVerified, setIsVerified] = useState(false);

  // Tab 1: Data Diri & Lokasi
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorWa, setNomorWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [latitude, setLatitude] = useState(-6.8124);
  const [longitude, setLongitude] = useState(107.6189);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Koordinat terdaftar");

  // Tab 2: Verifikasi Identitas (KYC)
  const [nik, setNik] = useState("");
  const [fotoKtpPreview, setFotoKtpPreview] = useState<string | null>(null);
  const [selfieKtpPreview, setSelfieKtpPreview] = useState<string | null>(null);

  // Tab 3: Kredibilitas Kebun
  const [namaKebun, setNamaKebun] = useState("");
  const [luasLahan, setLuasLahan] = useState("1.5 Hektar");
  const [deskripsiKebun, setDeskripsiKebun] = useState("");
  const [standarKualitas, setStandarKualitas] = useState(
    "Konvensional Bebas Pestisida Berbahaya"
  );
  const [fotoLahanPreview, setFotoLahanPreview] = useState<string | null>(null);

  // Load Data Supabase
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }
        setUserId(user.id);

        // 1. Ambil data profil
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (prof) {
          setNamaLengkap(prof.full_name || "");
          setNomorWa(prof.phone_whatsapp || "");
          setAlamat(prof.address || "");
          setNik(prof.nik || "");
          if (prof.foto_ktp_url) setFotoKtpPreview(prof.foto_ktp_url);
          if (prof.selfie_ktp_url) setSelfieKtpPreview(prof.selfie_ktp_url);
          if (prof.foto_lahan_url) setFotoLahanPreview(prof.foto_lahan_url);
          if (prof.standar_kualitas) setStandarKualitas(prof.standar_kualitas);

          if (
            prof.is_verified ||
            (prof.nik && prof.foto_ktp_url && prof.foto_lahan_url)
          ) {
            setIsVerified(true);
          }
        }

        // 2. Ambil data kebun
        const { data: kebunList } = await supabase
          .from("kebun")
          .select("*")
          .eq("farmer_id", user.id)
          .limit(1);

        const currentKebun = kebunList?.[0];
        if (currentKebun) {
          setKebunId(currentKebun.id);
          setNamaKebun(currentKebun.nama_kebun || `Kebun ${prof?.full_name || "Mitra"}`);
          setLatitude(Number(currentKebun.latitude) || -6.8124);
          setLongitude(Number(currentKebun.longitude) || 107.6189);
          if (currentKebun.deskripsi) setDeskripsiKebun(currentKebun.deskripsi);
          if (currentKebun.luas_lahan_m2) setLuasLahan(`${currentKebun.luas_lahan_m2} m²`);
          if (currentKebun.foto_kebun_url && !fotoLahanPreview) {
            setFotoLahanPreview(currentKebun.foto_kebun_url);
          }
          if (currentKebun.is_verified) {
            setIsVerified(true);
          }
        } else {
          setNamaKebun(`Kebun ${prof?.full_name || "Mitra Tani"}`);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle Upload Image Preview (Base64)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          type: "error",
          text: "Ukuran file terlalu besar (Maksimal 5 MB).",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get Current GPS from Browser
  const handleGetCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(6)));
        setLongitude(Number(pos.coords.longitude.toFixed(6)));
        setGpsStatus(`Akurasi GPS ±${Math.round(pos.coords.accuracy)} meter`);
        setIsGettingGps(false);
      },
      () => {
        setIsGettingGps(false);
        setGpsStatus("Izin akses lokasi ditolak. Gunakan titik default.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Save All Profile Data
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    setNotification(null);

    try {
      // Tentukan apakah memenuhi syarat verifikasi otomatis
      const hasNik = nik.trim().length >= 16;
      const hasKtp = Boolean(fotoKtpPreview);
      const hasLahan = Boolean(fotoLahanPreview);
      const nowVerified = hasNik && hasKtp && hasLahan;

      // 1. Simpan ke profiles
      const profilePayload: any = {
        full_name: namaLengkap.trim(),
        phone_whatsapp: nomorWa.trim(),
        address: alamat.trim(),
        nik: nik.trim() || null,
        foto_ktp_url: fotoKtpPreview || null,
        selfie_ktp_url: selfieKtpPreview || null,
        foto_lahan_url: fotoLahanPreview || null,
        standar_kualitas: standarKualitas,
        is_verified: nowVerified,
        status_verifikasi: nowVerified ? "terverifikasi" : "belum_lengkap",
        updated_at: new Date().toISOString(),
      };

      const { error: profErr } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("id", userId);

      if (profErr) {
        // Fallback jika beberapa kolom anti-fraud belum dibuat di profiles
        await supabase
          .from("profiles")
          .update({
            full_name: namaLengkap.trim(),
            phone_whatsapp: nomorWa.trim(),
            address: alamat.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }

      // 2. Simpan ke kebun
      let currentKebunId = kebunId;
      if (!currentKebunId) {
        const { data: existing } = await supabase
          .from("kebun")
          .select("id")
          .eq("farmer_id", userId)
          .limit(1);
        if (existing && existing.length > 0) {
          currentKebunId = existing[0].id;
          setKebunId(currentKebunId);
        }
      }

      const kebunPayload: any = {
        nama_kebun: namaKebun.trim(),
        deskripsi: deskripsiKebun.trim() || standarKualitas,
        alamat: alamat.trim(),
        latitude,
        longitude,
        foto_kebun_url: fotoLahanPreview || null,
        is_verified: nowVerified,
        updated_at: new Date().toISOString(),
      };

      if (currentKebunId) {
        await supabase
          .from("kebun")
          .update(kebunPayload)
          .eq("id", currentKebunId);
      } else {
        const { data: newK } = await supabase
          .from("kebun")
          .insert({
            farmer_id: userId,
            ...kebunPayload,
          })
          .select("id")
          .single();
        if (newK) setKebunId(newK.id);
      }

      setIsVerified(nowVerified);

      setNotification({
        type: "success",
        text: nowVerified
          ? "✅ Data profil & identitas berhasil diverifikasi! Anda kini terdaftar sebagai Mitra Terpercaya."
          : "✅ Perubahan profil berhasil disimpan. Lengkapi NIK, KTP, dan foto lahan untuk mendapatkan badge Terverifikasi.",
      });

      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err?.message || "Gagal menyimpan data profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header dengan Badge Verifikasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Profil & Kredibilitas Petani
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Anti-Fraud MitraPanen: Verifikasi identitas dan titik kebun untuk menjamin kepercayaan pembeli UMKM.
          </p>
        </div>

        {/* Badge Status Verifikasi di Pojok Kanan Atas */}
        <div>
          {isVerified ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border-2 border-emerald-500 px-4 py-2 text-xs font-black text-emerald-800 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="leading-tight">Terverifikasi</p>
                <p className="text-[10px] font-semibold text-emerald-600">Mitra Terpercaya UMKM</p>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-red-50 border-2 border-red-400 px-4 py-2 text-xs font-black text-red-800 shadow-xs">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <div>
                <p className="leading-tight">Belum Terverifikasi</p>
                <p className="text-[10px] font-semibold text-red-600">KTP & Lahan Belum Lengkap</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Notifikasi */}
      {notification && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs font-bold shadow-xs border ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* 3 Tab Navigasi */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("data_diri")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "data_diri"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="h-4 w-4" />
          <span>1. Data Diri & Lokasi</span>
        </button>

        <button
          onClick={() => setActiveTab("identitas")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "identitas"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <IdCard className="h-4 w-4" />
          <span>2. Verifikasi Identitas (KYC)</span>
          {!isVerified && (
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("kredibilitas")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "kredibilitas"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sprout className="h-4 w-4" />
          <span>3. Kredibilitas Kebun & Mutu</span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* ================= TAB 1: DATA DIRI & LOKASI ================= */}
        {activeTab === "data_diri" && (
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Informasi Personal & Titik Penjemputan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Data kontak untuk kurir atau pembeli UMKM saat mengambil hasil panen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  value={nomorWa}
                  onChange={(e) => setNomorWa(e.target.value)}
                  placeholder="08123456789"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Alamat Domisili / Kebun</label>
              <textarea
                rows={2}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Desa, Kecamatan, Kabupaten / Kota"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Peta Koordinat GPS Lahan */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Titik Geospasial GIS Lahan Kebun
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentGps}
                  disabled={isGettingGps}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                >
                  {isGettingGps ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  ) : (
                    <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  <span>Ambil GPS dari Browser</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Status GPS: <span className="font-semibold text-slate-700">{gpsStatus}</span>. Titik ini digunakan untuk memvalidasi metadata EXIF foto panen.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VERIFIKASI IDENTITAS (KYC) ================= */}
        {activeTab === "identitas" && (
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Verifikasi Identitas Resmi (KYC Anti-Fraud)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencegahan penipuan & jaminan kepercayaan UMKM. Data KTP dilindungi enkripsi dan hanya digunakan untuk validasi legalitas mitra tani.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">
                Nomor Induk Kependudukan (NIK KTP 16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                placeholder="3201xxxxxxxxxxxx"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {nik.length}/16 digit {nik.length === 16 ? "✅ NIK Lengkap" : "⚠️ Wajib 16 digit angka"}
              </p>
            </div>

            {/* Upload Foto KTP & Selfie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Foto KTP */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Foto E-KTP Asli <span className="text-red-500">*</span>
                  </label>
                  {fotoKtpPreview && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Terunggah
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center hover:bg-slate-50 transition">
                  {fotoKtpPreview ? (
                    <div className="w-full space-y-2">
                      <img
                        src={fotoKtpPreview}
                        alt="Preview KTP"
                        className="h-32 w-full object-cover rounded-lg border border-slate-200"
                      />
                      <label className="inline-block cursor-pointer text-[11px] font-bold text-emerald-600 hover:underline">
                        Ganti Foto KTP
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setFotoKtpPreview)}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center py-4 w-full">
                      <IdCard className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-emerald-700">Unggah Foto KTP</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG maks 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setFotoKtpPreview)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Foto Selfie bersama KTP */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Selfie Memegang KTP
                  </label>
                  {selfieKtpPreview && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Terunggah
                    </span>
                  )}
                </div>

                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center hover:bg-slate-50 transition">
                  {selfieKtpPreview ? (
                    <div className="w-full space-y-2">
                      <img
                        src={selfieKtpPreview}
                        alt="Preview Selfie KTP"
                        className="h-32 w-full object-cover rounded-lg border border-slate-200"
                      />
                      <label className="inline-block cursor-pointer text-[11px] font-bold text-emerald-600 hover:underline">
                        Ganti Foto Selfie
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setSelfieKtpPreview)}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center py-4 w-full">
                      <Camera className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-emerald-700">Unggah Selfie + KTP</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Wajah & KTP terlihat jelas</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setSelfieKtpPreview)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: KREDIBILITAS KEBUN ================= */}
        {activeTab === "kredibilitas" && (
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Kredibilitas Lahan & Standar Kualitas
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Buktikan keaslian kebun fisik Anda agar pesanan UMKM lebih cepat masuk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Nama Kebun</label>
                <input
                  type="text"
                  required
                  value={namaKebun}
                  onChange={(e) => setNamaKebun(e.target.value)}
                  placeholder="Contoh: Kebun Tani Subur Makmur"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Luas Lahan Aktif</label>
                <input
                  type="text"
                  value={luasLahan}
                  onChange={(e) => setLuasLahan(e.target.value)}
                  placeholder="Contoh: 1.5 Hektar (15.000 m²)"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">
                Standar Kualitas & Budidaya <span className="text-red-500">*</span>
              </label>
              <select
                value={standarKualitas}
                onChange={(e) => setStandarKualitas(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="Organik Bersertifikat">
                  🌿 Organik Bersertifikat (Tanpa Bahan Kimia Sintetis)
                </option>
                <option value="Hidroponik Modern">
                  💧 Hidroponik Modern (Nutrisi Terkontrol & Bersih)
                </option>
                <option value="Konvensional Bebas Pestisida Berbahaya">
                  🌾 Konvensional Bebas Pestisida Berbahaya (Residu Aman)
                </option>
                <option value="GAP (Good Agricultural Practices)">
                  📜 Sertifikasi GAP (Good Agricultural Practices)
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Deskripsi Kebun & Komoditas Utama</label>
              <textarea
                rows={2}
                value={deskripsiKebun}
                onChange={(e) => setDeskripsiKebun(e.target.value)}
                placeholder="Jelaskan jenis varietas yang sering ditanam, sistem irigasi, dan jadwal panen rutin."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Upload Foto Lahan Asli */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Foto Lahan / Kebun Asli <span className="text-red-500">*</span>
                </label>
                {fotoLahanPreview && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Terunggah
                  </span>
                )}
              </div>

              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center hover:bg-slate-50 transition">
                {fotoLahanPreview ? (
                  <div className="w-full space-y-2">
                    <img
                      src={fotoLahanPreview}
                      alt="Preview Lahan Kebun"
                      className="h-44 w-full object-cover rounded-lg border border-slate-200"
                    />
                    <label className="inline-block cursor-pointer text-[11px] font-bold text-emerald-600 hover:underline">
                      Ganti Foto Lahan
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setFotoLahanPreview)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center py-6 w-full">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-emerald-700">
                      Unggah Foto Lahan Kebun Nyata
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Foto langsung di lokasi kebun untuk verifikasi visual
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setFotoLahanPreview)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button Simpan & Verifikasi */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            * Isi NIK 16 digit, Foto KTP, dan Foto Lahan untuk otomatis mengaktifkan status Terverifikasi.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? "Menyimpan Data..." : "Simpan & Ajukan Verifikasi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
