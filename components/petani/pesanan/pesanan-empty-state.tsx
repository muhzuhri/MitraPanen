"use client";

import { ShoppingCart } from "lucide-react";

interface PesananEmptyStateProps {
  statusTab: string;
}

export default function PesananEmptyState({ statusTab }: PesananEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <ShoppingCart className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-black text-slate-900">
        Tidak Ada Pesanan pada Status Ini
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        Saat ini belum ada pesanan baru untuk tab &ldquo;{statusTab}&rdquo;. Pesanan yang masuk dari UMKM akan otomatis muncul di sini.
      </p>
    </div>
  );
}
