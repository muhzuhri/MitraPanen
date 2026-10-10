"use client";

import { motion } from "framer-motion";
import { OrderItem } from "@/data/petani/types";
import {
  Store,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  Check,
  RotateCcw,
} from "lucide-react";

interface PesananCardProps {
  order: OrderItem;
  onUpdateStatus: (orderId: string, nextStatus: string) => void;
}

export default function PesananCard({ order, onUpdateStatus }: PesananCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                {order.namaUmkm}
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {order.nomorPesanan}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {order.kategori} • Radius: {order.jarak}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            {order.status}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Komoditas & Total
          </p>
          <p className="mt-1 text-xs font-extrabold text-slate-800">
            {order.pesanan}
          </p>
          <p className="mt-0.5 text-base font-black text-emerald-600">
            {order.totalHarga}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Waktu Pengambilan Sendiri (Self Pick-up)
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>{order.jadwalAmbil}</span>
          </div>
          {order.catatan && (
            <p className="mt-1 text-[11px] text-slate-500 italic">
              Catatan: &ldquo;{order.catatan}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
        <a
          href={`https://wa.me/${order.noHpUmkm.replace(/\D/g, "")}?text=Halo%20${encodeURIComponent(order.namaUmkm)},%20pesanan%20Anda%20(${order.nomorPesanan})%20sedang%20kami%20siapkan%20di%20kebun.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>Hubungi Pembeli</span>
        </a>

        <div className="flex items-center gap-2">
          {order.status !== "Selesai" && (
            <button
              onClick={() => onUpdateStatus(order.id, "selesai")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Tandai Selesai (Diambil)</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
