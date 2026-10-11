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
} from "lucide-react";

interface UmkmSidebarProfile {
  namaUsaha: string;
  pemilik?: string;
  kategori?: string;
}

interface UmkmSidebarProps {
  profile: UmkmSidebarProfile;
  onLogout: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const UMKM_NAV_ITEMS = [
  {
    label: "Beranda",
    href: "/umkm",
    icon: Home,
  },
  {
    label: "Peta Panen",
    href: "/umkm/peta",
    icon: MapPin,
  },
  {
    label: "Pesanan",
    href: "/umkm/pesanan",
    icon: ShoppingBag,
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

  const initial = (profile.namaUsaha || "U").charAt(0).toUpperCase();

  return (
    <aside
      className={`flex flex-col h-full bg-white select-none ${
        isMobile
          ? "w-full"
          : "w-64 border-r border-slate-200/80 shadow-xs transition-all duration-200"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link
          href="/umkm"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900">
                Mitra<span className="text-teal-600">Panen</span>
              </span>
              <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                UMKM
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav className="space-y-1">
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
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-800 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-teal-600" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Mini Bar at Bottom */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white text-xs font-bold">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {profile.namaUsaha}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {profile.pemilik || "Pemilik Usaha"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              type="button"
              title="Keluar"
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
