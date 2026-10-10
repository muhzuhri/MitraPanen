"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { KebunGpsLocation } from "@/data/petani/types";
import ProfilForm from "@/components/petani/profil-form";
import GpsCoordinateCard from "@/components/petani/gps-coordinate-card";

export default function ProfilKebunPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [kebunId, setKebunId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingGPS, setIsUpdatingGPS] = useState(false);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    namaKebun: "",
    nomorWa: "",
    komoditas: "",
    luasLahan: "",
    alamat: "",
  });

  const [coords, setCoords] = useState<KebunGpsLocation>({
    latitude: -6.8124,
    longitude: 107.6189,
    accuracy: "Satelit GPS",
    lastUpdated: "Hari ini",
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }
        setUserId(user.id);

        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        const { data: kebun } = await supabase
          .from("kebun")
          .select("*")
          .eq("farmer_id", user.id)
          .maybeSingle();

        const defaultName =
          prof?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "";

        setFormData({
          namaLengkap: defaultName,
          namaKebun: kebun?.nama_kebun || `Kebun ${defaultName || "Mitra"}`,
          nomorWa:
            prof?.phone_whatsapp ||
            user.user_metadata?.phone_whatsapp ||
            "",
          komoditas: kebun?.deskripsi || "Cabai Rawit, Tomat, Bawang Merah",
          luasLahan: kebun?.luas_lahan_m2
            ? `${kebun.luas_lahan_m2} m²`
            : "1.5 Hektar (15.000 m²)",
          alamat: prof?.address || kebun?.alamat || "Lembang, Bandung Barat",
        });

        if (kebun) {
          setKebunId(kebun.id);
          setCoords({
            latitude: kebun.latitude || -6.8124,
            longitude: kebun.longitude || 107.6189,
            accuracy: "Akurat (Tersimpan di Supabase)",
            lastUpdated: new Date(
              kebun.updated_at || kebun.created_at || Date.now()
            ).toLocaleDateString("id-ID"),
          });
        }
      } catch (err: any) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSaveProfile = async (data: typeof formData) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      // 1. Simpan ke profiles
      await supabase
        .from("profiles")
        .update({
          full_name: data.namaLengkap.trim(),
          phone_whatsapp: data.nomorWa.trim(),
          address: data.alamat.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // 2. Simpan ke kebun
      if (kebunId) {
        await supabase
          .from("kebun")
          .update({
            nama_kebun: data.namaKebun.trim(),
            deskripsi: data.komoditas.trim(),
            alamat: data.alamat.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", kebunId);
      } else {
        const { data: newKebun } = await supabase
          .from("kebun")
          .insert({
            farmer_id: userId,
            nama_kebun: data.namaKebun.trim(),
            deskripsi: data.komoditas.trim(),
            alamat: data.alamat.trim(),
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
          .select("id")
          .maybeSingle();

        if (newKebun) {
          setKebunId(newKebun.id);
        }
      }

      setFormData(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateGPS = () => {
    setIsUpdatingGPS(true);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));

          setCoords({
            latitude: lat,
            longitude: lng,
            accuracy: "Akurat (Sensor GPS Aktif)",
            lastUpdated: "Baru saja",
          });

          if (kebunId) {
            await supabase
              .from("kebun")
              .update({
                latitude: lat,
                longitude: lng,
                updated_at: new Date().toISOString(),
              })
              .eq("id", kebunId);
          }
          setIsUpdatingGPS(false);
        },
        () => {
          alert("Gagal membaca sensor GPS perangkat. Menggunakan titik default.");
          setIsUpdatingGPS(false);
        },
        { timeout: 7000 }
      );
    } else {
      alert("Browser tidak mendukung sensor GPS.");
      setIsUpdatingGPS(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Pengaturan Profil & Lahan Kebun
        </h1>
        <p className="text-xs text-slate-500">
          Kelola profil petani Anda dan koordinat satelit geospasial lahan
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ProfilForm
              initialData={formData}
              isSaving={isSaving}
              onSave={handleSaveProfile}
            />
          </div>

          <div className="lg:col-span-5">
            <GpsCoordinateCard
              coords={coords}
              isUpdatingGPS={isUpdatingGPS}
              onUpdateGPS={handleUpdateGPS}
            />
          </div>
        </div>
      )}
    </div>
  );
}
