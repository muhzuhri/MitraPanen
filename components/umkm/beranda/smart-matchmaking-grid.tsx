"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, ArrowRight, Loader2, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FarmItem {
  id: string;
  namaKebun: string;
  alamat: string;
  petaniNama: string;
  phoneWhatsapp: string;
  latitude?: number;
  longitude?: number;
  komoditasRingkas?: string;
}

export default function SmartMatchmakingGrid() {
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFarms() {
      try {
        const { data: rows } = await supabase
          .from("kebun")
          .select(`
            id,
            nama_kebun,
            alamat,
            latitude,
            longitude,
            profiles:farmer_id (
              full_name,
              phone_whatsapp
            )
          `)
          .limit(6);

        if (rows && rows.length > 0) {
          const mapped: FarmItem[] = rows.map((k: any) => {
            const prof = Array.isArray(k.profiles) ? k.profiles[0] : k.profiles;
            return {
              id: k.id,
              namaKebun: k.nama_kebun || "Kebun Mitra",
              alamat: k.alamat || "Lokasi Kebun",
              petaniNama: prof?.full_name || "Petani Mitra",
              phoneWhatsapp: prof?.phone_whatsapp || "",
              latitude: k.latitude,
              longitude: k.longitude,
            };
          });
          setFarms(mapped);
        } else {
          setFarms([]);
        }
      } catch (err) {
        console.error("Gagal memuat kebun:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFarms();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Kebun Mitra Terdaftar
          </h3>
          <p className="text-xs text-slate-500">
            Petani lokal yang terhubung dalam sistem.
          </p>
        </div>

        <Link
          href="/umkm/peta"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
        >
          <span>Buka Peta</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-teal-600" />
          <p className="mt-2 text-xs text-slate-500">Memeriksa data kebun...</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <Store className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-xs font-semibold text-slate-700">
            Belum ada kebun mitra terdaftar
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Data kebun akan otomatis tampil setelah petani mendaftar di sistem.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-teal-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 text-xs font-bold">
                    {farm.namaKebun.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {farm.namaKebun}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Petani: {farm.petaniNama}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="truncate">{farm.alamat}</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex gap-2">
                <Link
                  href={`/umkm/peta?farm=${farm.id}`}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-50 hover:bg-teal-50 py-2 text-[11px] font-bold text-slate-700 hover:text-teal-700 transition"
                >
                  <Navigation className="h-3 w-3 text-teal-600" />
                  <span>Lihat di Peta</span>
                </Link>

                {farm.phoneWhatsapp && (
                  <a
                    href={`https://wa.me/${farm.phoneWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-2.5 py-2 text-[11px] font-semibold text-slate-600"
                    title="Kontak Petani"
                  >
                    WA
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
