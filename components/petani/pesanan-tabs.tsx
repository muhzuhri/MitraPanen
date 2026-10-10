"use client";

import { OrderStatus } from "@/data/petani/types";
import { Clock, ShoppingBag, CheckCircle2 } from "lucide-react";

interface PesananTabsProps {
  activeTab: OrderStatus;
  onChangeTab: (tab: OrderStatus) => void;
  counts: {
    menunggu: number;
    disiapkan: number;
    selesai: number;
  };
}

export default function PesananTabs({
  activeTab,
  onChangeTab,
  counts,
}: PesananTabsProps) {
  const tabs = [
    {
      id: "menunggu" as OrderStatus,
      label: "Menunggu Pengambilan",
      icon: Clock,
      count: counts.menunggu,
    },
    {
      id: "disiapkan" as OrderStatus,
      label: "Sedang Disiapkan",
      icon: ShoppingBag,
      count: counts.disiapkan,
    },
    {
      id: "selesai" as OrderStatus,
      label: "Pesanan Selesai",
      icon: CheckCircle2,
      count: counts.selesai,
    },
  ];

  return (
    <div className="flex border-b border-slate-200">
      <div className="flex gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
