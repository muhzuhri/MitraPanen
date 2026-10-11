"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import UmkmSidebar from "@/components/umkm/layout/umkm-sidebar";
import UmkmTopbar from "@/components/umkm/layout/umkm-topbar";
import { UmkmProvider, useUmkm } from "@/components/umkm/layout/umkm-context";
import { supabase } from "@/lib/supabase";

function UmkmLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, isLoading } = useUmkm();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session && !isLoading) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [isLoading, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-xs font-semibold text-slate-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const defaultProfile = profile || {
    id: "",
    namaUsaha: "Mitra UMKM",
    pemilik: "Pemilik",
    email: "",
    phoneWhatsapp: "",
    kategori: "Kuliner",
    alamat: "",
    latitude: -6.9175,
    longitude: 107.6191,
  };

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased">
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:block lg:shrink-0">
        <div className="sticky top-0 h-screen">
          <UmkmSidebar profile={defaultProfile} onLogout={handleLogout} />
        </div>
      </div>

      {/* 2. Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
            <UmkmSidebar
              profile={defaultProfile}
              onLogout={handleLogout}
              isMobile={true}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex flex-1 flex-col min-w-0">
        <UmkmTopbar
          profile={defaultProfile}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function UmkmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UmkmProvider>
      <UmkmLayoutContent>{children}</UmkmLayoutContent>
    </UmkmProvider>
  );
}
