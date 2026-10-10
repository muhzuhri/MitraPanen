"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, LogOut, ChevronRight, PhoneCall } from "lucide-react";
import { PETANI_NAV_ITEMS } from "@/data/petani/petani-nav";
import { PetaniProfile } from "@/data/petani/types";

interface PetaniSidebarProps {
  profile: PetaniProfile;
  onLogout: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function PetaniSidebar({
  profile,
  onLogout,
  isMobile = false,
  onCloseMobile,
}: PetaniSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col h-full bg-white ${isMobile ? "w-full" : "w-64 border-r border-slate-200/90 shadow-xs"}`}>
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900">
              Mitra<span className="text-emerald-600">Panen</span>
            </span>
            <span className="ml-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200">
              Petani
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Menu Utama
          </p>
          {PETANI_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/petani"
                ? pathname === "/petani"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-emerald-700 text-emerald-100"
                        : item.badgeColor || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Bot Support & Profile */}
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
          {/* Quick WA Bot Banner */}
          <Link
            href="/petani/whatsapp"
            onClick={onCloseMobile}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 p-3 border border-emerald-100 hover:border-emerald-300 transition-all group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-800">Bot WhatsApp</p>
              <p className="text-[10px] text-teal-700 font-medium truncate">Update stok via WA</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* User Profile Mini Bar */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs">
                {profile.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  {profile.fullName}
                </p>
                <p className="truncate text-[10px] text-emerald-600 font-medium">
                  {profile.farmName}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Keluar Akun"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
