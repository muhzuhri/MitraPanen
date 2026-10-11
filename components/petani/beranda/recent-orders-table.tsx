"use client";

import Link from "next/link";
import { OrderItem } from "@/data/petani/types";
import { ShoppingCart, PhoneCall, ArrowRight, Clock, Store } from "lucide-react";

interface RecentOrdersTableProps {
  orders: OrderItem[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            Antrean Pesanan Masuk Terbaru
          </h2>
          <p className="text-xs text-slate-500">
            Daftar UMKM yang telah memesan dan menjadwalkan pengambilan
          </p>
        </div>
        <Link
          href="/petani/pesanan"
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
        >
          <span>Lihat Semua Pesanan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-800">
            Belum Ada Pesanan Masuk
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Pastikan stok panen Anda sudah ditambahkan agar UMKM di sekitar lokasi Anda dapat mulai memesan.
          </p>
          <div className="mt-5">
            <Link
              href="/petani/panen"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              Tambah Stok Panen
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 hover:bg-slate-50/60 rounded-xl px-2.5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      {order.namaUmkm}
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                      {order.nomorPesanan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {order.pesanan} •{" "}
                    <span className="font-bold text-emerald-600">
                      {order.totalHarga}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Jadwal Pengambilan: {order.jadwalAmbil}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold border ${order.statusColor || "bg-emerald-100 text-emerald-800 border-emerald-200"}`}
                >
                  {order.status}
                </span>

                <a
                  href={`https://wa.me/${order.noHpUmkm.replace(/\D/g, "")}?text=Halo%20${encodeURIComponent(order.namaUmkm)},%20kami%20dari%20MitraPanen%20mengonfirmasi%20pesanan%20${order.nomorPesanan}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
