"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UmkmRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/umkm");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <span className="text-xs font-bold text-slate-700">
          Mengarahkan ke Dashboard UMKM MitraPanen...
        </span>
      </div>
    </div>
  );
}
