"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Compass, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PetaniDashboardStats, OrderItem } from "@/data/petani/types";
import OverviewStatsGrid from "@/components/petani/beranda/overview-stats-grid";
import OnboardingModal from "@/components/petani/beranda/onboarding-modal";
import WhatsappBannerCta from "@/components/petani/beranda/whatsapp-banner-cta";
import RecentOrdersTable from "@/components/petani/beranda/recent-orders-table";

export default function PetaniDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [farmerKebunId, setFarmerKebunId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedKomoditas, setSelectedKomoditas] = useState("Sayuran Buah & Rempah");
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<PetaniDashboardStats>({
    totalPendapatan: 0,
    pesananMenunggu: 0,
    stokAktifKg: 0,
    jumlahKomoditas: 0,
  });

  const [orders, setOrders] = useState<OrderItem[]>([]);

  const [locationState, setLocationState] = useState<{
    detected: boolean;
    lat?: number;
    lng?: number;
    loading: boolean;
    message?: string;
  }>({
    detected: false,
    loading: false,
  });

  // Load Real Data from Supabase
  useEffect(() => {
    async function loadDashboardData() {
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

        // Ambil kebun
        const { data: kebunList } = await supabase
          .from("kebun")
          .select("id, nama_kebun, latitude, longitude")
          .eq("farmer_id", user.id);

        const currentKebun = kebunList?.[0];
        setFarmerKebunId(currentKebun?.id || null);

        // Ambil stok panen milik kebun user
        let totalKg = 0;
        let komoditasCount = 0;

        if (currentKebun?.id) {
          const { data: stokData } = await supabase
            .from("stok_panen")
            .select("jumlah_stok_kg")
            .eq("kebun_id", currentKebun.id);

          if (stokData) {
            komoditasCount = stokData.length;
            totalKg = stokData.reduce(
              (sum: number, item: any) => sum + (Number(item.jumlah_stok_kg) || 0),
              0
            );
          }

          // Ambil pesanan riil untuk kebun ini
          const { data: pesananData } = await supabase
            .from("pesanan")
            .select("*, profiles!pesanan_umkm_id_fkey(full_name, phone_whatsapp)")
            .eq("kebun_id", currentKebun.id)
            .order("created_at", { ascending: false });

          if (pesananData && pesananData.length > 0) {
            const orderCount = pesananData.filter(
              (p: any) =>
                p.status === "menunggu_konfirmasi" ||
                p.status === "dikonfirmasi" ||
                p.status === "siap_diambil"
            ).length;

            const pendapatan = pesananData
              .filter((p: any) => p.status === "selesai")
              .reduce((sum: number, p: any) => sum + (Number(p.total_harga) || 0), 0);

            const mappedOrders: OrderItem[] = pesananData.slice(0, 5).map((p: any) => ({
              id: p.id,
              nomorPesanan: p.nomor_pesanan || "ORD-001",
              namaUmkm: p.profiles?.full_name || "Mitra UMKM",
              kategori: "Kuliner",
              jarak: "Terdekat",
              pesanan: "Bahan Baku Segar",
              totalHarga: `Rp ${Number(p.total_harga || 0).toLocaleString("id-ID")}`,
              jadwalAmbil: new Date(p.tanggal_pengambilan || p.created_at).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              status: p.status === "selesai" ? "Selesai" : "Menunggu Diambil",
              statusColor:
                p.status === "selesai"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200",
              noHpUmkm: p.profiles?.phone_whatsapp || "081234567890",
            }));

            setOrders(mappedOrders);
            setStats({
              totalPendapatan: pendapatan,
              pesananMenunggu: orderCount,
              stokAktifKg: totalKg,
              jumlahKomoditas: komoditasCount,
            });
          } else {
            setStats({
              totalPendapatan: 0,
              pesananMenunggu: 0,
              stokAktifKg: totalKg,
              jumlahKomoditas: komoditasCount,
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleGetLocation = () => {
    setLocationState({ detected: false, loading: true });

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState({
            detected: true,
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
            loading: false,
            message: "Lokasi kebun Anda berhasil terdeteksi via GPS!",
          });
        },
        () => {
          setLocationState({
            detected: true,
            lat: -6.8124,
            lng: 107.6189,
            loading: false,
            message: "Koordinat Lembang (-6.8124, 107.6189) disetel sebagai titik kebun.",
          });
        },
        { timeout: 6000 }
      );
    } else {
      setLocationState({
        detected: true,
        lat: -6.8124,
        lng: 107.6189,
        loading: false,
        message: "Koordinat default disetel (-6.8124, 107.6189).",
      });
    }
  };

  const handleSaveOnboarding = async () => {
    if (userId && farmerKebunId) {
      const lat = locationState.lat || -6.8124;
      const lng = locationState.lng || 107.6189;

      await supabase
        .from("kebun")
        .update({
          latitude: lat,
          longitude: lng,
          deskripsi: selectedKomoditas,
          updated_at: new Date().toISOString(),
        })
        .eq("id", farmerKebunId);
    }
    setShowOnboarding(false);
  };

  return (
    <div className="space-y-8">
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        selectedKomoditas={selectedKomoditas}
        setSelectedKomoditas={setSelectedKomoditas}
        locationState={locationState}
        onGetLocation={handleGetLocation}
        onSave={handleSaveOnboarding}
      />

      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Dasbor Petani & Kebun
          </h1>
          <p className="text-xs text-slate-500">
            Pantau arus stok panen, lokasi GIS, dan pesanan bahan baku UMKM secara real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Compass className="h-4 w-4 text-emerald-600" />
            <span>Setup Lokasi GIS</span>
          </button>

          <Link
            href="/petani/panen"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Panen</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          <OverviewStatsGrid stats={stats} />
          <WhatsappBannerCta />
          <RecentOrdersTable orders={orders} />
        </>
      )}
    </div>
  );
}
