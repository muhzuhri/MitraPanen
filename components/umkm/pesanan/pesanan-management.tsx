"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Calendar,
  CheckCircle2,
  Navigation,
  Clock,
  Loader2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RealOrder {
  id: string;
  nomorPesanan: string;
  namaKebun: string;
  alamatKebun: string;
  namaPetani: string;
  phoneWhatsapp: string;
  totalHarga: number;
  status: string;
  tanggalAmbil: string;
  latitude?: number;
  longitude?: number;
}

export default function PesananManagement() {
  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"berjalan" | "selesai">("berjalan");

  useEffect(() => {
    async function loadOrders() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: rows, error } = await supabase
          .from("pesanan")
          .select(`
            id,
            nomor_pesanan,
            total_harga,
            status,
            tanggal_pengambilan,
            created_at,
            kebun:kebun_id (
              nama_kebun,
              alamat,
              latitude,
              longitude,
              profiles:farmer_id (
                full_name,
                phone_whatsapp
              )
            )
          `)
          .eq("umkm_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && rows) {
          const mapped: RealOrder[] = rows.map((r: any) => {
            const kebunData = Array.isArray(r.kebun) ? r.kebun[0] : r.kebun;
            const farmerProfile = kebunData?.profiles
              ? Array.isArray(kebunData.profiles)
                ? kebunData.profiles[0]
                : kebunData.profiles
              : null;

            return {
              id: r.id,
              nomorPesanan: r.nomor_pesanan || "ORD-001",
              namaKebun: kebunData?.nama_kebun || "Kebun Mitra",
              alamatKebun: kebunData?.alamat || "Lokasi Kebun",
              namaPetani: farmerProfile?.full_name || "Petani Mitra",
              phoneWhatsapp: farmerProfile?.phone_whatsapp || "",
              totalHarga: Number(r.total_harga || 0),
              status: r.status || "siap_diambil",
              tanggalAmbil: r.tanggal_pengambilan
                ? new Date(r.tanggal_pengambilan).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Sesuai Jadwal",
              latitude: kebunData?.latitude,
              longitude: kebunData?.longitude,
            };
          });
          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Gagal memuat pesanan:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  const ongoingOrders = orders.filter((o) => o.status !== "selesai" && o.status !== "dibatalkan");
  const finishedOrders = orders.filter((o) => o.status === "selesai");

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Daftar Pesanan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status penjemputan hasil panen dari kebun mitra.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("berjalan")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "berjalan"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Aktif ({ongoingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("selesai")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "selesai"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Selesai ({finishedOrders.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-teal-600" />
          <p className="mt-2 text-xs text-slate-500">Memuat data pesanan...</p>
        </div>
      ) : activeTab === "berjalan" ? (
        ongoingOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
            <h4 className="mt-3 text-sm font-bold text-slate-800">
              Belum ada pesanan aktif
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Anda belum memiliki jadwal penjemputan barang. Silakan cek kebun mitra terdekat di menu peta.
            </p>
            <div className="mt-4">
              <Link
                href="/umkm/peta"
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition"
              >
                <span>Cari di Peta Panen</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {ongoingOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                      {order.nomorPesanan}
                    </span>
                    <span className="text-xs font-semibold text-amber-600">
                      • {order.status === "siap_diambil" ? "Siap Diambil" : "Sedang Disiapkan"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {order.namaKebun}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      {order.alamatKebun}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {order.tanggalAmbil}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <p className="text-base font-bold text-slate-900">
                    Rp {order.totalHarga.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-2">
                    {order.latitude && order.longitude && (
                      <a
                        href={`https://maps.google.com/?q=${order.latitude},${order.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-3 py-1.5 text-xs font-bold text-white transition"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Rute Maps</span>
                      </a>
                    )}
                    {order.phoneWhatsapp && (
                      <a
                        href={`https://wa.me/${order.phoneWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                      >
                        WA Petani
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : finishedOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-xs font-semibold text-slate-600">
            Belum ada riwayat pesanan selesai.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {finishedOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {order.namaKebun}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({order.nomorPesanan})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Petani: {order.namaPetani} • {order.tanggalAmbil}
                </p>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Rp {order.totalHarga.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
