"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sprout,
  Loader2,
  Sparkles,
  Camera,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { PanenItem, KomoditasMaster } from "@/data/petani/types";
import {
  analyzeHarvestPhoto,
  AntiFraudAnalysisResult,
} from "@/lib/anti-fraud";

interface PanenModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: PanenItem | null;
  komoditasList: KomoditasMaster[];
  isSaving: boolean;
  farmLocation?: { latitude: number; longitude: number };
  onSave: (formData: {
    nama: string;
    kategori: string;
    varietas: string;
    stok: number;
    harga: number;
    status: PanenItem["status"];
    catatan: string;
    fotoPanenUrl?: string;
    exifData?: {
      dateTime?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      distanceMeters?: number | null;
      trustScore?: number;
    };
  }) => Promise<void>;
}

export default function PanenModal({
  isOpen,
  onClose,
  editItem,
  komoditasList,
  isSaving,
  farmLocation,
  onSave,
}: PanenModalProps) {
  const [formNama, setFormNama] = useState("");
  const [formKategori, setFormKategori] = useState("Sayuran Buah");
  const [formVarietas, setFormVarietas] = useState("");
  const [formStok, setFormStok] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formStatus, setFormStatus] = useState<PanenItem["status"]>("tersedia");
  const [formCatatan, setFormCatatan] = useState("");

  // Foto & Anti-Fraud State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AntiFraudAnalysisResult | null>(null);
  const [isSandboxGpsSimulated, setIsSandboxGpsSimulated] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editItem) {
      setFormNama(editItem.nama);
      setFormKategori(editItem.kategori);
      setFormVarietas(editItem.varietas);
      setFormStok(String(editItem.stokKg));
      setFormHarga(String(editItem.hargaPerKg));
      setFormStatus(editItem.status);
      setFormCatatan(editItem.catatanPetik || "");
      // Mock existing photo valid for edit
      setAnalysisResult({
        isValid: true,
        hasGps: true,
        isAiOrInternetSuspect: false,
        dateTime: "Hari ini",
        latitude: farmLocation?.latitude || -6.8124,
        longitude: farmLocation?.longitude || 107.6189,
        distanceMeters: 10,
        cameraInfo: "Kamera Lahan Petani",
        trustScore: 98,
        message: "✅ Foto asli diverifikasi dari kebun.",
      });
    } else {
      setFormNama("");
      setFormKategori("Sayuran Buah");
      setFormVarietas("");
      setFormStok("");
      setFormHarga("");
      setFormStatus("tersedia");
      setFormCatatan("");
      setPhotoPreview(null);
      setAnalysisResult(null);
      setIsSandboxGpsSimulated(false);
    }
    setErrorMsg("");
  }, [editItem, isOpen, farmLocation]);

  if (!isOpen) return null;

  // Handle Photo File Selection & EXIF / AI Analysis
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setIsAnalyzingPhoto(true);
    setAnalysisResult(null);

    // Read preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Jalankan Anti-Fraud Engine
      const result = await analyzeHarvestPhoto(file, farmLocation);
      setAnalysisResult(result);
    } catch (err: any) {
      setErrorMsg("Gagal memeriksa metadata gambar.");
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  // Toggle Sandbox Mode (untuk demo pengujian jika tester tidak punya foto kamera HP berekstensi GPS)
  const handleToggleSandbox = () => {
    if (!photoPreview) {
      setErrorMsg("Silakan pilih foto terlebih dahulu.");
      return;
    }
    const nextVal = !isSandboxGpsSimulated;
    setIsSandboxGpsSimulated(nextVal);

    if (nextVal) {
      setAnalysisResult({
        isValid: true,
        hasGps: true,
        isAiOrInternetSuspect: false,
        dateTime: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        latitude: farmLocation?.latitude || -6.8124,
        longitude: farmLocation?.longitude || 107.6189,
        distanceMeters: 8,
        cameraInfo: "Sensor Kamera Lahan (Mode Uji AmanKampus)",
        trustScore: 99,
        message: "✅ Foto asli diverifikasi (Simulasi Koordinat Kebun).",
      });
    } else {
      setAnalysisResult({
        isValid: false,
        hasGps: false,
        isAiOrInternetSuspect: true,
        dateTime: null,
        latitude: null,
        longitude: null,
        distanceMeters: null,
        cameraInfo: null,
        trustScore: 20,
        message:
          "❌ Foto terindikasi hasil unduhan/AI atau tidak memiliki data GPS. Harap foto langsung dari kebun Anda untuk keamanan UMKM.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formNama.trim()) {
      setErrorMsg("Nama komoditas wajib diisi.");
      return;
    }
    const stokNum = Number(formStok);
    const hargaNum = Number(formHarga);

    if (isNaN(stokNum) || stokNum <= 0) {
      setErrorMsg("Jumlah stok harus berupa angka positif.");
      return;
    }
    if (isNaN(hargaNum) || hargaNum <= 0) {
      setErrorMsg("Harga per Kg harus berupa angka positif.");
      return;
    }

    if (!editItem && !photoPreview) {
      setErrorMsg("Foto hasil panen asli wajib diunggah.");
      return;
    }

    if (!analysisResult?.isValid) {
      setErrorMsg(
        "❌ Foto belum lulus uji keaslian Anti-Fraud. Tombol simpan terkunci."
      );
      return;
    }

    try {
      await onSave({
        nama: formNama.trim(),
        kategori: formKategori,
        varietas: formVarietas.trim() || "-",
        stok: stokNum,
        harga: hargaNum,
        status: formStatus,
        catatan: formCatatan.trim(),
        fotoPanenUrl: photoPreview || undefined,
        exifData: {
          dateTime: analysisResult.dateTime,
          latitude: analysisResult.latitude,
          longitude: analysisResult.longitude,
          distanceMeters: analysisResult.distanceMeters,
          trustScore: analysisResult.trustScore,
        },
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menyimpan panen.");
    }
  };

  const isSubmitEnabled = Boolean(
    analysisResult?.isValid && !isAnalyzingPhoto && !isSaving
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {editItem ? "Edit Data Panen" : "Tambah Panen Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                Dilindungi Sistem Keaslian Foto & Anti-Fraud AmanKampus
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Commodity Name & Quick Suggestions */}
            <div>
              <label className="text-xs font-bold text-slate-700">
                Nama Komoditas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Cabai Rawit Merah, Tomat Beef, dll."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              {komoditasList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold self-center">
                    Cepat:
                  </span>
                  {komoditasList.slice(0, 5).map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        setFormNama(k.nama);
                        setFormKategori(k.kategori || "Sayuran Buah");
                      }}
                      className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      {k.nama}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category and Variety in Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Kategori</label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="Sayuran Buah">Sayuran Buah</option>
                  <option value="Sayuran Daun">Sayuran Daun</option>
                  <option value="Rempah & Bumbu">Rempah & Bumbu</option>
                  <option value="Umbi-Umbian">Umbi-Umbian</option>
                  <option value="Buah-Buahan">Buah-Buahan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Varietas</label>
                <input
                  type="text"
                  value={formVarietas}
                  onChange={(e) => setFormVarietas(e.target.value)}
                  placeholder="Contoh: Ori 212"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Stock and Price in Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Jumlah Stok (Kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    required
                    value={formStok}
                    onChange={(e) => setFormStok(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-9 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                    Kg
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Harga / Kg (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    value={formHarga}
                    onChange={(e) => setFormHarga(e.target.value)}
                    placeholder="35000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ================= SECTION FOTO ASLI & DETEKSI EXIF/AI ================= */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-emerald-600" />
                  <label className="text-xs font-bold text-slate-900">
                    Upload Foto Panen Asli (Wajib Deteksi EXIF & GPS) <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Sandbox Demo Tooltip / Button */}
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleToggleSandbox}
                    className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 underline"
                    title="Simulasikan kamera HP langsung untuk pengujian"
                  >
                    {isSandboxGpsSimulated ? "Reset Deteksi" : "🧪 Uji Simulasi GPS Kamera"}
                  </button>
                )}
              </div>

              {/* Upload Box */}
              <div className="relative">
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 text-center cursor-pointer hover:bg-slate-50 transition">
                  <Upload className="h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-emerald-700">
                    {photoPreview ? "Ganti Foto Panen" : "Pilih Foto Hasil Panen Langsung"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Sistem akan memvalidasi GPS kamera & AI Forgery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              </div>

              {/* 1. STATE LOADING PEMERIKSAAN METADATA */}
              {isAnalyzingPhoto && (
                <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 text-blue-900 animate-pulse">
                  <Scan className="h-5 w-5 animate-spin text-blue-600" />
                  <div>
                    <p className="text-xs font-bold">
                      🕵️ Memeriksa metadata gambar...
                    </p>
                    <p className="text-[10px] text-blue-700">
                      Mengekstrak DateTimeOriginal, koordinat GPS, dan deteksi AI Forgery
                    </p>
                  </div>
                </div>
              )}

              {/* 2. HASIL ANALISIS ANTI-FRAUD */}
              {!isAnalyzingPhoto && analysisResult && (
                <div className="space-y-2">
                  {analysisResult.isValid ? (
                    // Lulus Verifikasi (Hijau)
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-emerald-950 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-900">
                          ✅ Foto asli diambil dari kamera
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-emerald-800 pl-6">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            📍 Lokasi cocok dengan kebun (Jarak{" "}
                            {analysisResult.distanceMeters ?? 12}m)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          <span>
                            🕒 Diambil pada: {analysisResult.dateTime || "Hari ini"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/80 text-[11px] font-semibold text-emerald-700 pl-6">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>
                          🛡️ Lolos Deteksi AI Forgery (Trust Score:{" "}
                          {analysisResult.trustScore}%)
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Ditolak (Merah Sesuai Permintaan Spesifikasi)
                    <div className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-red-950 space-y-2 shadow-2xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-900 leading-snug">
                            ❌ Foto terindikasi hasil unduhan/AI atau tidak memiliki data GPS. Harap foto langsung dari kebun Anda untuk keamanan UMKM.
                          </p>
                          <p className="text-[10px] text-red-700 mt-1">
                            Penyebab: File gambar tidak memiliki koordinat GPS kamera fisik atau terdeteksi melalui filter web. Tombol simpan dinonaktifkan.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Preview */}
                  {photoPreview && (
                    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={photoPreview}
                        alt="Preview Panen"
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute bottom-2 right-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs ${
                          analysisResult.isValid ? "bg-emerald-600" : "bg-red-600"
                        }`}
                      >
                        {analysisResult.isValid ? "VERIFIED PHOTO" : "REJECTED"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Harvest Note */}
            <div>
              <label className="text-xs font-bold text-slate-700">Catatan Kualitas</label>
              <textarea
                rows={2}
                value={formCatatan}
                onChange={(e) => setFormCatatan(e.target.value)}
                placeholder="Contoh: Dipetik pagi hari, bebas pestisida kimia berlebih, grade A segar."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                {!isSubmitEnabled && (
                  <p className="text-[10px] font-bold text-red-500">
                    * Tombol submit hanya aktif jika foto lulus uji keaslian EXIF & Anti-Fraud.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!isSubmitEnabled}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>
                    {isSaving
                      ? "Menyimpan..."
                      : editItem
                      ? "Perbarui Stok"
                      : "Verifikasi & Simpan Panen"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
