"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Package, Sparkles } from "lucide-react";
import { PetaniDashboardStats } from "@/data/petani/types";

interface OverviewStatsGridProps {
  stats: PetaniDashboardStats;
}

export default function OverviewStatsGrid({ stats }: OverviewStatsGridProps) {
  const statCards = [
    {
      title: "Total Omzet Penjualan",
      value: `Rp ${stats.totalPendapatan.toLocaleString("id-ID")}`,
      subtitle: "Akumulasi pesanan selesai",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-700",
      borderColor: "border-emerald-100",
    },
    {
      title: "Pesanan Menunggu Ambil",
      value: `${stats.pesananMenunggu} Pesanan`,
      subtitle: "Siap dipetik & diserahkan",
      icon: ShoppingBag,
      color: "from-teal-500 to-cyan-600",
      lightBg: "bg-teal-50 text-teal-700",
      borderColor: "border-teal-100",
    },
    {
      title: "Total Stok Aktif",
      value: `${stats.stokAktifKg.toLocaleString("id-ID")} Kg`,
      subtitle: "Tayang di Radar Peta GIS",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-100",
    },
    {
      title: "Komoditas Siap Pasok",
      value: `${stats.jumlahKomoditas} Jenis`,
      subtitle: "Tersedia untuk UMKM sekitar",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 text-amber-700",
      borderColor: "border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className={`relative overflow-hidden rounded-2xl bg-white p-5 border ${card.borderColor} shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                {card.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.lightBg}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                {card.value}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
