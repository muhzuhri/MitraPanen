"use client";

import { Sprout, Plus } from "lucide-react";

interface PanenEmptyStateProps {
  onAddClick: () => void;
  isFiltered?: boolean;
}

export default function PanenEmptyState({
  onAddClick,
  isFiltered = false,
}: PanenEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Sprout className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-black text-slate-900">
        {isFiltered ? "Tidak Ada Stok yang Cocok" : "Belum Ada Stok Panen Terdaftar"}
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        {isFiltered
          ? "Coba ubah kata kunci pencarian atau filter kategori komoditas Anda."
          : "Tambahkan hasil panen ladang Anda sekarang agar UMKM terdekat bisa melihat dan langsung memesan tanpa tengkulak."}
      </p>
      {!isFiltered && (
        <button
          onClick={onAddClick}
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Panen Pertama</span>
        </button>
      )}
    </div>
  );
}
