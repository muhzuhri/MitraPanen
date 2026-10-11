"use client";

import { motion } from "framer-motion";
import {
  Tag,
  Scale,
  Edit2,
  Trash2,
  Clock,
  Sprout,
} from "lucide-react";
import { PanenItem } from "@/data/petani/types";

interface PanenCardProps {
  item: PanenItem;
  onEdit: (item: PanenItem) => void;
  onDelete: (id: string, nama: string) => void;
}

export default function PanenCard({ item, onEdit, onDelete }: PanenCardProps) {
  const getStatusBadge = (status: PanenItem["status"]) => {
    switch (status) {
      case "tersedia":
        return {
          label: "Tersedia di Peta",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "siap_petik":
        return {
          label: "Siap Petik Hari Ini",
          color: "bg-teal-100 text-teal-800 border-teal-200",
        };
      case "menipis":
        return {
          label: "Stok Menipis (< 30 Kg)",
          color: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "habis":
        return {
          label: "Stok Habis",
          color: "bg-rose-100 text-rose-800 border-rose-200",
        };
      default:
        return {
          label: "Tersedia",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
    }
  };

  const badge = getStatusBadge(item.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
            <Tag className="h-3 w-3" />
            <span>{item.kategori}</span>
          </span>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border uppercase tracking-wider ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Commodity Name & Variety */}
        <div className="mt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {item.nama}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Varietas: <span className="text-slate-700 font-semibold">{item.varietas}</span>
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Sprout className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50/80 p-3 border border-slate-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Stok Tersedia
            </p>
            <p className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <Scale className="h-3.5 w-3.5 text-emerald-600" />
              <span>{item.stokKg.toLocaleString("id-ID")} Kg</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Harga per Kg
            </p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">
              Rp {item.hargaPerKg.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Harvest note if present */}
        {item.catatanPetik && (
          <p className="mt-3 text-xs italic text-slate-500 line-clamp-2">
            &ldquo;{item.catatanPetik}&rdquo;
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{item.terakhirUpdate}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center gap-1 rounded-xl p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            title="Edit Stok"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id, item.nama)}
            className="flex items-center gap-1 rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Hapus Stok"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
