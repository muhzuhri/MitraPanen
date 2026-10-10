"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { OrderItem, OrderStatus } from "@/data/petani/types";
import PesananTabs from "@/components/petani/pesanan-tabs";
import PesananCard from "@/components/petani/pesanan-card";
import PesananEmptyState from "@/components/petani/pesanan-empty-state";

export default function PesananMasukPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("menunggu");
  const [pesananList, setPesananList] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kebunId, setKebunId] = useState<string | null>(null);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Ambil kebun petani
      const { data: kebunList } = await supabase
        .from("kebun")
        .select("id")
        .eq("farmer_id", user.id);

      const userKebunId = kebunList?.[0]?.id;
      setKebunId(userKebunId || null);

      if (userKebunId) {
        const { data: rows, error } = await supabase
          .from("pesanan")
          .select("*, profiles!pesanan_umkm_id_fkey(full_name, phone_whatsapp, business_name)")
          .eq("kebun_id", userKebunId)
          .order("created_at", { ascending: false });

        if (!error && rows) {
          const mapped: OrderItem[] = rows.map((p: any) => {
            let tabStatus = "Menunggu Konfirmasi";
            if (p.status === "siap_diambil" || p.status === "dikonfirmasi") {
              tabStatus = "Sedang Disiapkan";
            } else if (p.status === "selesai") {
              tabStatus = "Selesai";
            }

            return {
              id: p.id,
              nomorPesanan: p.nomor_pesanan || "ORD-001",
              namaUmkm:
                p.profiles?.business_name ||
                p.profiles?.full_name ||
                "Mitra UMKM Kuliner",
              kategori: "Kuliner & Resto",
              jarak: "3.5 Km",
              pesanan: "Hasil Panen Segar Kebun",
              totalHarga: `Rp ${Number(p.total_harga || 0).toLocaleString("id-ID")}`,
              totalHargaNum: Number(p.total_harga) || 0,
              jadwalAmbil: new Date(
                p.tanggal_pengambilan || p.created_at
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
              catatan: p.catatan_umkm || "",
              status: tabStatus,
              noHpUmkm: p.profiles?.phone_whatsapp || "081234567890",
            };
          });

          setPesananList(mapped);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil daftar pesanan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const { error } = await supabase
        .from("pesanan")
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      await fetchPesanan();
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui status pesanan.");
    }
  };

  // Filter based on active tab
  const filteredList = pesananList.filter((item) => {
    if (activeTab === "menunggu") return item.status === "Menunggu Konfirmasi";
    if (activeTab === "disiapkan") return item.status === "Sedang Disiapkan";
    if (activeTab === "selesai") return item.status === "Selesai";
    return true;
  });

  const counts = {
    menunggu: pesananList.filter((p) => p.status === "Menunggu Konfirmasi").length,
    disiapkan: pesananList.filter((p) => p.status === "Sedang Disiapkan").length,
    selesai: pesananList.filter((p) => p.status === "Selesai").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Daftar Pesanan Masuk (UMKM)
          </h1>
          <p className="text-xs text-slate-500">
            Pantau dan kelola jadwal pengambilan pesanan langsung dari kebun Anda
          </p>
        </div>

        <button
          onClick={fetchPesanan}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* Status Tabs */}
      <PesananTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={counts}
      />

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredList.length === 0 ? (
        <PesananEmptyState
          statusTab={
            activeTab === "menunggu"
              ? "Menunggu Pengambilan"
              : activeTab === "disiapkan"
              ? "Sedang Disiapkan"
              : "Pesanan Selesai"
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredList.map((order) => (
            <PesananCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
