"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Navigation,
  Crosshair,
  X,
  Plus,
  Minus,
  Loader2,
  Store,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface KebunPoint {
  id: string;
  namaKebun: string;
  alamat: string;
  petaniNama: string;
  phoneWhatsapp: string;
  latitude: number;
  longitude: number;
}

export default function PetaMockupView() {
  const [kebunList, setKebunList] = useState<KebunPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarm, setSelectedFarm] = useState<KebunPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState(14);

  useEffect(() => {
    async function loadKebun() {
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
          `);

        if (rows && rows.length > 0) {
          const mapped: KebunPoint[] = rows.map((k: any, idx: number) => {
            const prof = Array.isArray(k.profiles) ? k.profiles[0] : k.profiles;
            return {
              id: k.id,
              namaKebun: k.nama_kebun || `Kebun Mitra ${idx + 1}`,
              alamat: k.alamat || "Jawa Barat",
              petaniNama: prof?.full_name || "Petani Mitra",
              phoneWhatsapp: prof?.phone_whatsapp || "",
              latitude: Number(k.latitude) || -6.8124,
              longitude: Number(k.longitude) || 107.6189,
            };
          });
          setKebunList(mapped);
          setSelectedFarm(mapped[0] || null);
        } else {
          setKebunList([]);
        }
      } catch (err) {
        console.error("Gagal memuat kebun untuk peta:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadKebun();
  }, []);

  const filteredKebun = kebunList.filter((k) =>
    k.namaKebun.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.petaniNama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-[calc(100vh-11rem)] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
      {/* 1. MOCKUP PETA BASE */}
      <div className="relative h-full w-full select-none overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

        {/* Central Buyer Location Marker */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
          style={{ top: "48%", left: "45%" }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute h-12 w-12 rounded-full bg-teal-500/20 animate-ping" />
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md border-2 border-white">
              <Crosshair className="h-4 w-4" />
            </div>
          </div>
          <span className="mt-1 rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            Dapur Anda
          </span>
        </div>

        {/* Real Kebun Pins */}
        {filteredKebun.map((farm, idx) => {
          const isSelected = selectedFarm?.id === farm.id;
          // Calculate spread for mockup map visualization
          const topPos = `${35 + ((idx * 23) % 45)}%`;
          const leftPos = `${25 + ((idx * 31) % 55)}%`;

          return (
            <button
              key={farm.id}
              onClick={() => setSelectedFarm(farm)}
              style={{ top: topPos, left: leftPos }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none transition-transform hover:scale-105"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md border-2 transition ${
                  isSelected
                    ? "bg-teal-600 text-white border-white ring-3 ring-teal-500/30 scale-110"
                    : "bg-white text-teal-700 border-teal-500 hover:bg-teal-50"
                }`}
              >
                <MapPin className="h-4 w-4 fill-current" />
              </div>

              <div
                className={`mt-1 rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs border whitespace-nowrap ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-700"
                    : "bg-white text-slate-800 border-slate-200"
                }`}
              >
                {farm.namaKebun}
              </div>
            </button>
          );
        })}

        {/* Map Zoom Controls */}
        <div className="absolute right-3 bottom-4 z-20 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="p-2 text-slate-700 hover:bg-slate-50 transition border-b border-slate-100"
            title="Perbesar"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
            className="p-2 text-slate-700 hover:bg-slate-50 transition"
            title="Perkecil"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR BERSIH */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-30 pointer-events-none">
        <div className="max-w-md pointer-events-auto">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kebun atau lokasi..."
              className="w-full rounded-xl border border-slate-200 bg-white/95 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. DETAIL CARD BERSIH */}
      {selectedFarm && (
        <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 z-30 max-w-xs w-[calc(100%-1.5rem)] sm:w-80">
          <div className="relative rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setSelectedFarm(null)}
              className="absolute top-3 right-3 rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="pr-5">
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                Kebun Terdaftar
              </span>
              <h4 className="mt-1 text-sm font-bold text-slate-900 truncate">
                {selectedFarm.namaKebun}
              </h4>
              <p className="text-[11px] text-slate-500">
                Petani: {selectedFarm.petaniNama}
              </p>
            </div>

            <div className="mt-2.5 text-[11px] text-slate-600 space-y-1 border-t border-slate-100 pt-2">
              <div className="flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{selectedFarm.alamat}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
              <a
                href={`https://maps.google.com/?q=${selectedFarm.latitude},${selectedFarm.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Rute Maps</span>
              </a>

              {selectedFarm.phoneWhatsapp && (
                <a
                  href={`https://wa.me/${selectedFarm.phoneWhatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 flex items-center justify-center"
                  title="Hubungi Petani"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center z-40">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      )}
    </div>
  );
}
