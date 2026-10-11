"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface UmkmUserProfile {
  id: string;
  namaUsaha: string;
  pemilik: string;
  email: string;
  phoneWhatsapp: string;
  kategori: string;
  alamat: string;
  latitude: number;
  longitude: number;
}

interface UmkmContextValue {
  profile: UmkmUserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const UmkmContext = createContext<UmkmContextValue>({
  profile: null,
  isLoading: true,
  refreshProfile: async () => {},
});

export function UmkmProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UmkmUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const businessName =
        prof?.business_name ||
        user.user_metadata?.business_name ||
        "Usaha Kuliner Mitra";

      const ownerName =
        prof?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Mitra UMKM";

      const phone =
        prof?.phone_whatsapp ||
        user.user_metadata?.phone_whatsapp ||
        "";

      const address = prof?.address || "Bandung, Jawa Barat";

      setProfile({
        id: user.id,
        namaUsaha: businessName,
        pemilik: ownerName,
        email: user.email || "",
        phoneWhatsapp: phone,
        kategori: "Kuliner & Restoran",
        alamat: address,
        latitude: -6.9175,
        longitude: 107.6191,
      });
    } catch (err) {
      console.error("Gagal memuat profil UMKM:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UmkmContext.Provider
      value={{
        profile,
        isLoading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </UmkmContext.Provider>
  );
}

export function useUmkm() {
  return useContext(UmkmContext);
}
