"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PetaniProfile } from "@/data/petani/types";
import PetaniSidebar from "@/components/petani/layout/petani-sidebar";
import PetaniTopbar from "@/components/petani/layout/petani-topbar";

export default function PetaniDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  const [profile, setProfile] = useState<PetaniProfile>({
    fullName: "Petani Mitra",
    initials: "PM",
    farmName: "Kebun Mitra",
    phone: "-",
  });

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        const { data: kebunList } = await supabase
          .from("kebun")
          .select("id, nama_kebun")
          .eq("farmer_id", user.id)
          .limit(1);

        const farmName =
          kebunList?.[0]?.nama_kebun ||
          `Kebun ${prof?.full_name || user.user_metadata?.full_name || "Mitra"}`;

        const rawName =
          prof?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Petani";

        const parts = rawName.trim().split(" ");
        const initials =
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : rawName.slice(0, 2).toUpperCase();

        setProfile({
          fullName: rawName,
          initials,
          farmName: farmName || "Kebun Mitra",
          phone:
            prof?.phone_whatsapp || user.user_metadata?.phone_whatsapp || "-",
        });
      } catch (err) {
        console.error("Gagal memuat profil Supabase:", err);
      }
    }

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Abaikan jika error
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 bg-white">
        <PetaniSidebar profile={profile} onLogout={handleLogout} />
      </aside>

      {/* 2. Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 bg-white flex flex-col z-10 shadow-2xl"
            >
              <PetaniSidebar
                profile={profile}
                onLogout={handleLogout}
                isMobile
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Content Container */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <PetaniTopbar
          profile={profile}
          hasUnreadNotification={hasUnreadNotification}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
