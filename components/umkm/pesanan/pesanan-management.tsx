"use client";

import { useState } from "react";
import {
  ShoppingBag,
  MapPin,
  Calendar,
  CheckCircle2,
  Navigation,
  QrCode,
  Check,
  Clock,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { UMKM_INITIAL_ORDERS, UmkmOrder } from "@/data/umkm/umkm-data";

export default function PesananManagement() {
  const [orders, setOrders] = useState<UmkmOrder[]>(UMKM_INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"berjalan" | "selesai">("berjalan");
  const [selectedQrOrder, setSelectedQrOrder] = useState<UmkmOrder | null>(null);

  const handleConfirmReceived = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "selesai" } : o
      )
    );
  };

  const ongoingOrders = orders.filter((o) => o.status === "siap_diambil");
  const historyOrders = orders.filter((o) => o.status === "selesai");

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Pesanan & Rute Pengambilan
            </h2>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-800 border border-teal-200">
              Self-Pick Up
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jadwal penjemputan mandiri langsung ke kebun petani tanpa perantara.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex rounded-2xl bg-slate-200/70 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("berjalan")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "berjalan"
                ? "bg-white text-teal-800 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Sedang Berjalan</span>
            <span
              className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                activeTab === "berjalan"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-300 text-slate-700"
              }`}
            >
              {ongoingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("selesai")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "selesai"
                ? "bg-white text-teal-800 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Riwayat Selesai</span>
            <span
              className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                activeTab === "selesai"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-300 text-slate-700"
              }`}
            >
              {historyOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: KONTEN SEDANG BERJALAN */}
      {activeTab === "berjalan" && (
        <div className="space-y-4">
          {ongoingOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
              <h4 className="mt-3 text-base font-black text-slate-800">
                Tidak ada pesanan aktif
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Semua barang telah Anda ambil atau belum ada pesanan baru dari kebun mitra.
              </p>
            </div>
          ) : (
            ongoingOrders.map((order) => (
              <div
                key={order.id}
                className="relative overflow-hidden rounded-3xl border border-teal-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                        Status: Siap Diambil di Kebun
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {order.nomorPesanan}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {order.komoditas} ({order.jumlahKg} Kg)
                      </h3>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        Kebun: {order.namaKebun} • Petani: {order.namaPetani}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {order.alamatKebun}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Jarak: {order.jarakKm} KM ({order.estimasiMenit} Menit)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{order.jadwalAmbil}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Hemat Ongkir Rp {order.penghematan.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Bayar Petani:
                      </span>
                      <h4 className="text-xl font-black text-slate-900">
                        Rp {order.totalHarga.toLocaleString("id-ID")}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedQrOrder(order)}
                        className="rounded-xl border border-slate-200 hover:bg-slate-50 p-2.5 text-slate-700 transition"
                        title="Tampilkan Kode QR Pickup"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>

                      {/* TOMBOL BIRU SOLID DENGAN EFEK PULSE ANIMASI */}
                      <a
                        href={`https://maps.google.com/?q=${order.latitude},${order.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="relative flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/30 transition active:scale-[0.98] overflow-hidden group"
                      >
                        <span className="absolute -inset-1 rounded-xl bg-blue-400 opacity-30 animate-pulse pointer-events-none" />
                        <Navigation className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="relative z-10 whitespace-nowrap">
                          🗺️ Navigasi ke Lokasi
                        </span>
                      </a>

                      {/* TOMBOL HIJAU KONFIRMASI BARANG DITERIMA */}
                      <button
                        type="button"
                        onClick={() => handleConfirmReceived(order.id)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition active:scale-[0.98]"
                      >
                        <Check className="h-4 w-4" />
                        <span className="whitespace-nowrap">
                          Konfirmasi Barang Diterima
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: RIWAYAT SELESAI */}
      {activeTab === "selesai" && (
        <div className="space-y-3">
          {historyOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Selesai & Diterima
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {order.nomorPesanan}
                  </span>
                </div>
                <h4 className="mt-1 text-sm font-black text-slate-900">
                  {order.komoditas} ({order.jumlahKg} Kg)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kebun: {order.namaKebun} • {order.alamatKebun}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-black text-slate-900 block">
                  Rp {order.totalHarga.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                  Hemat Ongkir Rp {order.penghematan.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP MODAL QR PICKUP */}
      {selectedQrOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
            <button
              onClick={() => setSelectedQrOrder(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            <h4 className="text-base font-black text-slate-900">
              Kode QR Pengambilan Mandiri
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Tunjukkan kode ini kepada {selectedQrOrder.namaPetani} di kebun.
            </p>

            <div className="my-6 flex justify-center">
              <div className="rounded-2xl border-4 border-dashed border-teal-500 p-4 bg-teal-50/50">
                <div className="h-44 w-44 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono text-center p-4">
                  <div>
                    <QrCode className="h-20 w-20 mx-auto text-teal-400" />
                    <p className="mt-2 text-[10px] font-bold text-slate-300">
                      {selectedQrOrder.kodeQrPickup}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 font-semibold">
              Pesanan: {selectedQrOrder.komoditas} ({selectedQrOrder.jumlahKg} Kg)
            </div>

            <button
              onClick={() => setSelectedQrOrder(null)}
              className="mt-4 w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
            >
              Tutup QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
