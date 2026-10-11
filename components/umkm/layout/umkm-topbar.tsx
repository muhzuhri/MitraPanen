"use client";

import Link from "next/link";
import { Menu, User, Store } from "lucide-react";

interface UmkmTopbarProfile {
  namaUsaha: string;
  pemilik?: string;
  email?: string;
}

interface UmkmTopbarProps {
  profile: UmkmTopbarProfile;
  onOpenMobile: () => void;
}

export default function UmkmTopbar({ profile, onOpenMobile }: UmkmTopbarProps) {
  const initial = (profile.namaUsaha || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          type="button"
          aria-label="Buka Menu"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
            {profile.namaUsaha}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {profile.pemilik ? `Pemilik: ${profile.pemilik}` : "Dashboard Operasional"}
          </p>
        </div>
      </div>

      {/* Right: Quick Profile Link */}
      <div className="flex items-center gap-3">
        <Link
          href="/umkm/profil"
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition text-xs font-semibold text-slate-700"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white text-[11px] font-bold">
            {initial}
          </div>
          <span className="hidden sm:inline">Profil Usaha</span>
        </Link>
      </div>
    </header>
  );
}
