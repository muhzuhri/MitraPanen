"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  Home,
  MapPin,
  ShoppingBag,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { UmkmProfile } from "@/data/umkm/umkm-data";

interface UmkmSidebarProps {
  profile: UmkmProfile;
  onLogout: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const UMKM_NAV_ITEMS = [
  {
    label: "Beranda",
    href: "/umkm",
    icon: Home,
    badge: "AI Aktif",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    label: "Peta Panen",
    href: "/umkm/peta",
    icon: MapPin,
    badge: "GIS Radar",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    label: "Pesanan & Rute",
    href: "/umkm/pesanan",
    icon: ShoppingBag,
    badge: "2 Siap",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    label: "Profil Usaha",
    href: "/umkm/profil",
    icon: Settings,
  },
];

export default function UmkmSidebar({
  profile,
  onLogout,
  isMobile = false,
  onCloseMobile,
}: UmkmSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-full bg-white select-none ${
        isMobile
          ? "w-full"
          : "w-64 border-r border-slate-200/90 shadow-sm transition-all duration-200"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Link
          href="/umkm"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-emerald-700 text-white shadow-md shadow-teal-600/20 transition-transform group-hover:scale-105">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900">
              Mitra<span className="text-teal-600">Panen</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-teal-50 px-2 py-0.2 text-[9px] font-bold text-teal-800 border border-teal-200">
                UMKM Pembeli
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
            Menu Geo-SCM
          </p>

          {UMKM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/umkm"
                ? pathname === "/umkm"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/25"
                    : "text-slate-600 hover:bg-teal-50/70 hover:text-teal-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-teal-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : item.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Geo Radar Info & Profile Card */}
        <div className="mt-6 space-y-3.5 border-t border-slate-100 pt-4">
          {/* Quick GIS Radar Banner */}
          <Link
            href="/umkm/peta"
            onClick={onCloseMobile}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-950 p-3 text-white shadow-sm hover:shadow-md transition-all group border border-teal-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Navigation className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-teal-200">
                  Radar Mandiri
                </span>
                <Sparkles className="h-3 w-3 text-amber-400" />
              </div>
              <p className="text-[10px] text-teal-100/70 truncate">
                Radius {profile.radiusKm} KM Aktif
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-teal-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* User Profile Mini Bar */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2.5 border border-slate-200/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white text-xs font-black shadow-xs">
                {profile.namaUsaha.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-slate-800">
                  {profile.namaUsaha}
                </p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <p className="truncate text-[10px] text-emerald-700 font-bold">
                    {profile.kategori}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              type="button"
              title="Keluar Akun"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
