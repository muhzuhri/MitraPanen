"use client";

import { useState } from "react";
import {
  ShoppingBag,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  PhoneCall,
  QrCode,
  Calendar,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { UMKM_INITIAL_ORDERS, UmkmOrder } from "@/data/umkm/umkm-data";

export default function PesananManagement() {
  const [activeTab, setActiveTab] = useState<"berjalan" | "selesai">("berjalan");
  const [orders, setOrders] = useState<UmkmOrder[]>(UMKM_INITIAL_ORDERS);
  const [selectedQrOrder, setSelectedQrOrder] = useState<UmkmOrder | null>(null);
  const [confirmModalOrder, setConfirmModalOrder] = useState<UmkmOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ongoingOrders = orders.filter((o) => o.status !== "selesai");
  const completedOrders = orders.filter((o) => o.status === "selesai");

  const handleConfirmReceived = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "selesai" as const,
              jadwalAmbil: `Selesai ${new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })} WIB`,
            }
          : o
      )
    );
    setConfirmModalOrder(null);
    setToastMessage("✅ Pesanan berhasil dikonfirmasi! Stok bahan baku telah diterima di dapur.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Pesanan & Rute Pengambilan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jadwal pengambilan mandiri (Self-Pick Up) langsung ke kebun petani tanpa perantara.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100/80 p-1 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setActiveTab("berjalan")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
              activeTab === "berjalan"
                ? "bg-white text-teal-800 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Sedang Berjalan</span>
            <span
              className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                activeTab === "berjalan"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {ongoingOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("selesai")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
              activeTab === "selesai"
                ? "bg-white text-teal-800 shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Riwayat Selesai</span>
            <span
              className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                activeTab === "selesai"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {completedOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: SEDANG BERJALAN                                              */}
      {/* ==================================================================== */}
      {activeTab === "berjalan" && (
        <div className="space-y-4">
          {ongoingOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-base font-black text-slate-800">
                Tidak Ada Pesanan Berjalan
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Semua pesanan bahan baku telah diambil dan selesai. Buka Peta Panen untuk booking panen berikutnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {ongoingOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-teal-300 transition-all space-y-4"
                >
                  {/* Top: Order Number & Status Pill */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {order.nomorPesanan}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">
                        {order.komoditas}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        Jumlah: <strong className="text-slate-900 font-black">{order.jumlahKg} Kg</strong> siap petik
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-300 shadow-2xs">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                      <span>Siap Diambil</span>
                    </span>
                  </div>

                  {/* Kebun & Petani Info Strip */}
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                        <div>
                          <p className="font-black text-slate-800">{order.namaKebun}</p>
                          <p className="text-[11px] text-slate-500 font-medium">Petani: {order.namaPetani}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-black text-teal-800 border border-teal-200">
                          {order.jarakKm} KM ({order.estimasiMenit} Menit)
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                      📍 {order.alamatKebun}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-600 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Jadwal: {order.jadwalAmbil}
                      </span>
                      <button
                        onClick={() => setSelectedQrOrder(order)}
                        className="flex items-center gap-1 text-teal-700 font-black hover:underline"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Lihat QR Token</span>
                      </button>
                    </div>
                  </div>

                  {/* Total Tag & Penghematan */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Tagihan:</p>
                      <p className="text-lg font-black text-slate-900">
                        Rp {order.totalHarga.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                        <TrendingDown className="h-3 w-3 text-emerald-600" />
                        Hemat Ongkir Rp {order.penghematan.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi: Navigasi (Biru Solid Pulse) & Konfirmasi (Hijau) */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                    {/* Tombol Biru Solid Navigasi ke Lokasi dengan Efek Pulse */}
                    <a
                      href={`https://maps.google.com/?q=${order.latitude},${order.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-black text-white shadow-md shadow-blue-600/30 transition active:scale-[0.98] overflow-hidden"
                    >
                      {/* Pulse Wave Animation */}
                      <span className="absolute -inset-1 rounded-xl bg-blue-400/30 opacity-75 animate-pulse" />
                      <Navigation className="relative h-4 w-4 transition-transform group-hover:scale-110" />
                      <span className="relative">🗺️ Navigasi ke Lokasi</span>
                    </a>

                    {/* Tombol Hijau Konfirmasi Barang Diterima */}
                    <button
                      type="button"
                      onClick={() => setConfirmModalOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/25 transition active:scale-[0.98]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Konfirmasi Barang Diterima</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: RIWAYAT SELESAI                                              */}
      {/* ==================================================================== */}
      {activeTab === "selesai" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-4 px-5">Nomor Pesanan</th>
                    <th className="py-4 px-5">Komoditas & Kebun</th>
                    <th className="py-4 px-5">Jumlah (Kg)</th>
                    <th className="py-4 px-5">Total Bayar</th>
                    <th className="py-4 px-5">Penghematan</th>
                    <th className="py-4 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {completedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-5 font-black text-slate-900">
                        {order.nomorPesanan}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900">{order.komoditas}</p>
                        <p className="text-[11px] text-slate-500">{order.namaKebun} ({order.namaPetani})</p>
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900">
                        {order.jumlahKg} Kg
                      </td>
                      <td className="py-4 px-5 font-black text-teal-800">
                        Rp {order.totalHarga.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-5 text-emerald-700 font-bold">
                        Rp {order.penghematan.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-700 border border-slate-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: QR TOKEN PICKUP                                             */}
      {/* ==================================================================== */}
      {selectedQrOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
            <h4 className="text-base font-black text-slate-900">
              Kode QR Pengambilan (Pickup Token)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Tunjukkan kode ini kepada petani saat mengambil pesanan di kebun.
            </p>

            {/* Mock QR Code Pattern */}
            <div className="my-5 mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-slate-900 p-4 shadow-md text-white">
              <QrCode className="h-36 w-36 text-emerald-400" />
            </div>

            <div className="rounded-xl bg-slate-100 p-2.5 text-xs font-mono font-bold text-slate-800 tracking-wider">
              {selectedQrOrder.kodeQrPickup}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSelectedQrOrder(null)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition"
              >
                Tutup QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: KONFIRMASI PENERIMAAN BARANG                               */}
      {/* ==================================================================== */}
      {confirmModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h4 className="text-base font-black text-slate-900">
              Konfirmasi Barang Diterima
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Apakah Anda telah menerima seluruh {confirmModalOrder.jumlahKg} Kg {confirmModalOrder.komoditas} dari {confirmModalOrder.namaKebun}?
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">
                Total Pembayaran: Rp {confirmModalOrder.totalHarga.toLocaleString("id-ID")}
              </p>
              <p className="text-emerald-700 font-semibold text-[11px]">
                Efisiensi biaya logistik: Rp {confirmModalOrder.penghematan.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModalOrder(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmReceived(confirmModalOrder.id)}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-black text-white transition shadow-sm"
              >
                Ya, Selesaikan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
