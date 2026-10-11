"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import UmkmSidebar from "@/components/umkm/umkm-sidebar";
import UmkmTopbar from "@/components/umkm/umkm-topbar";
import { DEFAULT_UMKM_PROFILE } from "@/data/umkm/umkm-data";
import { supabase } from "@/lib/supabase";

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile] = useState(DEFAULT_UMKM_PROFILE);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* 1. DESKTOP SIDEBAR */}
      <div className="hidden lg:block lg:shrink-0">
        <div className="sticky top-0 h-screen">
          <UmkmSidebar profile={profile} onLogout={handleLogout} />
        </div>
      </div>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
            <UmkmSidebar
              profile={profile}
              onLogout={handleLogout}
              isMobile={true}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA WITH TOPBAR */}
      <div className="flex flex-1 flex-col min-w-0">
        <UmkmTopbar
          profile={profile}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
