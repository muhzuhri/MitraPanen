"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PetaniDashboardStats, OrderItem } from "@/data/petani/types";
import OverviewStatsGrid from "@/components/petani/beranda/overview-stats-grid";
import WhatsappBannerCta from "@/components/petani/beranda/whatsapp-banner-cta";
import RecentOrdersTable from "@/components/petani/beranda/recent-orders-table";

export default function PetaniDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [farmerKebunId, setFarmerKebunId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<PetaniDashboardStats>({
    totalPendapatan: 0,
    pesananMenunggu: 0,
    stokAktifKg: 0,
    jumlahKomoditas: 0,
  });

  const [orders, setOrders] = useState<OrderItem[]>([]);

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

        // 1. Cek kelengkapan profil & status verifikasi KYC
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        const hasKtp = Boolean(prof?.foto_ktp_url || prof?.nik);
        const hasLahan = Boolean(prof?.foto_lahan_url);
        const verified = Boolean(prof?.is_verified);

        setIsVerified(verified);
        setProfileComplete(verified || (hasKtp && hasLahan));

        // 2. Ambil kebun
        const { data: kebunList } = await supabase
          .from("kebun")
          .select("id, nama_kebun, latitude, longitude, is_verified")
          .eq("farmer_id", user.id)
          .limit(1);

        const currentKebun = kebunList?.[0];
        setFarmerKebunId(currentKebun?.id || null);

        if (currentKebun?.is_verified) {
          setIsVerified(true);
          setProfileComplete(true);
        }

        // 3. Ambil stok panen milik kebun user
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
        }

        // 4. Ambil pesanan nyata
        const { data: pesananData } = await supabase
          .from("pesanan")
          .select(`
            id,
            total_harga,
            status,
            metode_pengiriman,
            created_at,
            buyer_id,
            profiles:buyer_id (
              business_name,
              full_name,
              phone_whatsapp
            )
          `)
          .order("created_at", { ascending: false });

        let totalRev = 0;
        let pendingCount = 0;
        const mappedOrders: OrderItem[] = [];

        if (pesananData) {
          pesananData.forEach((p: any) => {
            const h = Number(p.total_harga) || 0;
            if (p.status === "selesai") totalRev += h;
            if (p.status === "menunggu_konfirmasi") pendingCount++;

            const buyerProf = Array.isArray(p.profiles)
              ? p.profiles[0]
              : p.profiles;

            mappedOrders.push({
              id: p.id,
              nomorPesanan: `ORD-${p.id.slice(0, 6).toUpperCase()}`,
              namaUmkm:
                buyerProf?.business_name ||
                buyerProf?.full_name ||
                "Mitra Kuliner UMKM",
              kategori: "Bahan Baku Segar",
              jarak: "2.4 km",
              pesanan: "Hasil Panen Segar",
              totalHarga: `Rp ${h.toLocaleString("id-ID")}`,
              totalHargaNum: h,
              jadwalAmbil: "Hari ini, 14:00",
              status:
                p.status === "selesai"
                  ? "selesai"
                  : p.status === "proses"
                  ? "disiapkan"
                  : "menunggu",
              noHpUmkm: buyerProf?.phone_whatsapp || "08123456789",
            });
          });
        }

        setOrders(mappedOrders.slice(0, 5));
        setStats({
          totalPendapatan: totalRev,
          pesananMenunggu: pendingCount,
          stokAktifKg: totalKg,
          jumlahKomoditas: komoditasCount,
        });
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Dasbor Petani Mitra
            </h1>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Terverifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                Belum Terverifikasi
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau arus stok panen, verifikasi anti-fraud, dan pesanan bahan baku UMKM secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/petani/profil"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Kredibilitas & Lokasi</span>
          </Link>

          <Link
            href="/petani/panen"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Panen</span>
          </Link>
        </div>
      </div>

      {/* Trust & Anti-Fraud Banner jika belum terverifikasi */}
      {!profileComplete && (
        <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/80 to-amber-100/40 p-4 sm:p-5 text-amber-900 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-500 text-white p-2.5 shrink-0 shadow-xs">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Verifikasi Kredibilitas Diperlukan untuk Menjual Panen
                </h4>
                <p className="text-xs text-amber-700 mt-0.5 max-w-2xl leading-relaxed">
                  Sesuai standar Anti-Fraud marketplace MitraPanen, Anda wajib mengunggah foto KTP dan foto lahan kebun sebelum dapat menambah stok panen.
                </p>
              </div>
            </div>

            <Link
              href="/petani/profil"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors shrink-0"
            >
              <span>Lengkapi Verifikasi</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

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
