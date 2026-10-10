"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sprout,
  Plus,
  Scale,
  Sparkles,
  Loader2,
  DollarSign,
  Tag,
} from "lucide-react";
import { PanenItem, KomoditasMaster } from "@/data/petani/types";

interface PanenModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: PanenItem | null;
  komoditasList: KomoditasMaster[];
  isSaving: boolean;
  onSave: (formData: {
    nama: string;
    kategori: string;
    varietas: string;
    stok: number;
    harga: number;
    status: PanenItem["status"];
    catatan: string;
  }) => Promise<void>;
}

export default function PanenModal({
  isOpen,
  onClose,
  editItem,
  komoditasList,
  isSaving,
  onSave,
}: PanenModalProps) {
  const [formNama, setFormNama] = useState("");
  const [formKategori, setFormKategori] = useState("Sayuran Buah");
  const [formVarietas, setFormVarietas] = useState("");
  const [formStok, setFormStok] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formStatus, setFormStatus] = useState<PanenItem["status"]>("tersedia");
  const [formCatatan, setFormCatatan] = useState("");
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
    } else {
      setFormNama("");
      setFormKategori("Sayuran Buah");
      setFormVarietas("");
      setFormStok("");
      setFormHarga("");
      setFormStatus("tersedia");
      setFormCatatan("");
    }
    setErrorMsg("");
  }, [editItem, isOpen]);

  if (!isOpen) return null;

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

    try {
      await onSave({
        nama: formNama.trim(),
        kategori: formKategori,
        varietas: formVarietas.trim() || "-",
        stok: stokNum,
        harga: hargaNum,
        status: formStatus,
        catatan: formCatatan.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menyimpan panen.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 z-10"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {editItem ? "Edit Stok Panen" : "Tambah Panen Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                Stok ini akan langsung terdeteksi di radar peta UMKM terdekat
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Commodity Name & Quick Suggestions */}
            <div>
              <label className="text-xs font-bold text-slate-700">
                Nama Komoditas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Cabai Rawit Merah, Tomat Beef, dll."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              {komoditasList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold self-center">Pilihan Cepat:</span>
                  {komoditasList.slice(0, 5).map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        setFormNama(k.nama);
                        setFormKategori(k.kategori || "Sayuran");
                      }}
                      className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
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
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="Sayuran Buah">Sayuran Buah</option>
                  <option value="Sayuran Daun">Sayuran Daun</option>
                  <option value="Rempah & Bumbu">Rempah & Bumbu</option>
                  <option value="Umbi-Umbian">Umbi-Umbian</option>
                  <option value="Buah-Buahan">Buah-Buahan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Varietas / Jenis</label>
                <input
                  type="text"
                  value={formVarietas}
                  onChange={(e) => setFormVarietas(e.target.value)}
                  placeholder="Contoh: Ori 212, Super Bima"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Stock and Price in Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Jumlah Stok (Kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    value={formStok}
                    onChange={(e) => setFormStok(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    Kg
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Harga / Kg (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={formHarga}
                    onChange={(e) => setFormHarga(e.target.value)}
                    placeholder="35000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700">Status Ketersediaan</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as PanenItem["status"])}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="tersedia">Tersedia di Peta (Stok Normal)</option>
                <option value="siap_petik">Siap Petik Hari Ini (Super Segar)</option>
                <option value="menipis">Stok Menipis (&lt; 30 Kg)</option>
                <option value="habis">Stok Habis (Sembunyikan dari Peta)</option>
              </select>
            </div>

            {/* Harvest Note */}
            <div>
              <label className="text-xs font-bold text-slate-700">Catatan Petik / Kualitas</label>
              <textarea
                rows={2}
                value={formCatatan}
                onChange={(e) => setFormCatatan(e.target.value)}
                placeholder="Contoh: Dipetik pagi hari, bebas pestisida kimia berlebih, grade A segar."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>{isSaving ? "Menyimpan..." : editItem ? "Perbarui Stok" : "Simpan ke Peta"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
