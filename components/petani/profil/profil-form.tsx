"use client";

import { useState } from "react";
import { User, Phone, Sprout, Building2, MapPin, Save, Loader2, CheckCircle2 } from "lucide-react";

interface ProfilFormProps {
  initialData: {
    namaLengkap: string;
    namaKebun: string;
    nomorWa: string;
    komoditas: string;
    luasLahan: string;
    alamat: string;
  };
  isSaving: boolean;
  onSave: (data: {
    namaLengkap: string;
    namaKebun: string;
    nomorWa: string;
    komoditas: string;
    luasLahan: string;
    alamat: string;
  }) => Promise<void>;
}

export default function ProfilForm({
  initialData,
  isSaving,
  onSave,
}: ProfilFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      await onSave(formData);
      setStatusMsg({ type: "success", text: "Profil kebun berhasil disimpan ke database!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err?.message || "Gagal menyimpan perubahan." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900">
          Informasi Profil & Identitas Kebun
        </h2>
        <p className="text-xs text-slate-500">
          Data ini akan ditampilkan pada sertifikat kebun & transparansi rantai pasok UMKM
        </p>
      </div>

      {statusMsg && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold border flex items-center gap-2 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMsg.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Nama Lengkap & Nama Kebun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Nama Lengkap Petani</label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={formData.namaLengkap}
                onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Nama Kebun / Ladang</label>
            <div className="relative mt-1.5">
              <Building2 className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={formData.namaKebun}
                onChange={(e) => setFormData({ ...formData, namaKebun: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nomor WA & Fokus Komoditas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif</label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={formData.nomorWa}
                onChange={(e) => setFormData({ ...formData, nomorWa: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Fokus Komoditas Utama</label>
            <div className="relative mt-1.5">
              <Sprout className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={formData.komoditas}
                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                placeholder="Contoh: Cabai Rawit, Tomat Beef"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Alamat Fisik Kebun */}
        <div>
          <label className="text-xs font-bold text-slate-700">Alamat Lengkap Lahan / Kebun</label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <textarea
              rows={3}
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
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
          <span>{isSaving ? "Menyimpan Data..." : "Simpan Perubahan Profil"}</span>
        </button>
      </div>
    </form>
  );
}
