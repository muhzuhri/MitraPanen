"use client";

import Link from "next/link";
import { Menu, Bell, Sprout, Sparkles } from "lucide-react";
import { PetaniProfile } from "@/data/petani/types";

interface PetaniTopbarProps {
  profile: PetaniProfile;
  hasUnreadNotification: boolean;
  onOpenMobileSidebar: () => void;
}

export default function PetaniTopbar({
  profile,
  hasUnreadNotification,
  onOpenMobileSidebar,
}: PetaniTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-8 backdrop-blur-md">
      {/* Left Mobile Menu Toggle + Farm Identification */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {profile.farmName}
            </h1>
            
          </div>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        

        {/* Notification Bell */}
        <button
          title="Notifikasi"
          className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotification && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>

        {/* Topbar User Avatar */}
        <Link
          href="/petani/profil"
          className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-xs font-black shadow-xs">
            {profile.initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {profile.fullName}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium">Petani</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
