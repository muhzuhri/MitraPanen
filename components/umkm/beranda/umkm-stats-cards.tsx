"use client";

import { useEffect, useState } from "react";
import { Wallet, ShoppingBag, MapPin, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatsData {
  totalBelanja: number;
  totalPenghematan: number;
  pesananAktif: number;
  totalMitraKebun: number;
}

export default function UmkmStatsCards() {
  const [stats, setStats] = useState<StatsData>({
    totalBelanja: 0,
    totalPenghematan: 0,
    pesananAktif: 0,
    totalMitraKebun: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let totalBelanja = 0;
        let totalPenghematan = 0;
        let pesananAktif = 0;

        if (user) {
          // 1. Ambil pesanan milik UMKM ini
          const { data: orders } = await supabase
            .from("pesanan")
            .select("total_harga, status")
            .eq("umkm_id", user.id);

          if (orders && orders.length > 0) {
            orders.forEach((o: any) => {
              const harga = Number(o.total_harga || 0);
              if (o.status === "selesai") {
                totalBelanja += harga;
                totalPenghematan += Math.round(harga * 0.15); // estimasi hemat vs pasar
              } else if (o.status !== "dibatalkan") {
                pesananAktif += 1;
              }
            });
          }
        }

        // 2. Ambil jumlah kebun petani yang terdaftar
        const { count: kebunCount } = await supabase
          .from("kebun")
          .select("id", { count: "exact", head: true });

        setStats({
          totalBelanja,
          totalPenghematan,
          pesananAktif,
          totalMitraKebun: kebunCount || 0,
        });
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Belanja */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Belanja</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Rp {stats.totalBelanja.toLocaleString("id-ID")}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          {stats.totalBelanja > 0 ? "Transaksi selesai" : "Belum ada transaksi"}
        </p>
      </div>

      {/* 2. Estimasi Hemat */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Penghematan</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-emerald-600">
          Rp {stats.totalPenghematan.toLocaleString("id-ID")}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">Langsung dari petani</p>
      </div>

      {/* 3. Pesanan Aktif */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Pesanan Aktif</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          {stats.pesananAktif}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          {stats.pesananAktif > 0 ? "Dalam penyiapan" : "Tidak ada pesanan aktif"}
        </p>
      </div>

      {/* 4. Mitra Kebun */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Mitra Kebun</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <MapPin className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          {stats.totalMitraKebun}
        </p>
        <p className="mt-1 text-[11px] text-slate-400">Kebun terdaftar di sistem</p>
      </div>
    </div>
  );
}
