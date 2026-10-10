"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PanenItem, KomoditasMaster } from "@/data/petani/types";
import PanenCard from "@/components/petani/panen-card";
import PanenModal from "@/components/petani/panen-modal";
import PanenEmptyState from "@/components/petani/panen-empty-state";

export default function ManajemenPanenPage() {
  const [daftarPanen, setDaftarPanen] = useState<PanenItem[]>([]);
  const [komoditasList, setKomoditasList] = useState<KomoditasMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [farmerKebunId, setFarmerKebunId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PanenItem | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchPanenData = async () => {
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

      // 1. Ambil master komoditas
      const { data: kData } = await supabase
        .from("komoditas")
        .select("id, nama, kategori");
      if (kData && kData.length > 0) {
        setKomoditasList(kData);
      }

      // 2. Cari kebun milik petani ini
      let { data: kebunList } = await supabase
        .from("kebun")
        .select("id, nama_kebun")
        .eq("farmer_id", user.id);

      let currentKebunId = kebunList?.[0]?.id;

      if (!currentKebunId) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, address")
          .eq("id", user.id)
          .maybeSingle();

        const { data: newKebun } = await supabase
          .from("kebun")
          .insert({
            farmer_id: user.id,
            nama_kebun: `Kebun ${prof?.full_name || "Mitra Tani"}`,
            alamat: prof?.address || "Lembang, Bandung Barat",
            latitude: -6.8124,
            longitude: 107.6189,
          })
          .select()
          .maybeSingle();

        currentKebunId = newKebun?.id;
      }

      setFarmerKebunId(currentKebunId || null);

      if (!currentKebunId) {
        setDaftarPanen([]);
        setIsLoading(false);
        return;
      }

      // 3. Ambil stok_panen dengan relasi komoditas
      const { data: stokRows, error: stokErr } = await supabase
        .from("stok_panen")
        .select(`
          id,
          kebun_id,
          komoditas_id,
          varietas,
          jumlah_stok_kg,
          harga_per_kg,
          status,
          catatan_petik,
          created_at,
          updated_at,
          komoditas (
            id,
            nama,
            kategori
          )
        `)
        .eq("kebun_id", currentKebunId)
        .order("created_at", { ascending: false });

      if (stokErr) {
        console.error("Gagal mengambil stok_panen:", stokErr);
      } else if (stokRows) {
        const mapped: PanenItem[] = stokRows.map((row: any) => {
          const dateStr = row.updated_at || row.created_at || new Date().toISOString();
          const parsedDate = new Date(dateStr);
          const formattedDate = isNaN(parsedDate.getTime())
            ? "Baru saja"
            : parsedDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              });

          return {
            id: row.id,
            nama: row.komoditas?.nama || row.varietas || "Komoditas Pertanian",
            kategori: row.komoditas?.kategori || "Sayuran Segar",
            varietas: row.varietas || "-",
            stokKg: Number(row.jumlah_stok_kg) || 0,
            hargaPerKg: Number(row.harga_per_kg) || 0,
            status: (row.status as PanenItem["status"]) || "tersedia",
            catatanPetik: row.catatan_petik || "",
            terakhirUpdate: formattedDate,
          };
        });

        setDaftarPanen(mapped);
      }
    } catch (err) {
      console.error("Error loading harvest data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPanenData();
  }, []);

  const handleSavePanen = async (formData: {
    nama: string;
    kategori: string;
    varietas: string;
    stok: number;
    harga: number;
    status: PanenItem["status"];
    catatan: string;
  }) => {
    if (!farmerKebunId) {
      throw new Error("Kebun belum terhubung. Silakan muat ulang halaman.");
    }

    setIsSaving(true);
    try {
      // 1. Temukan atau buat komoditas
      let komoditasId: string | null = null;
      const existingKomoditas = komoditasList.find(
        (k) => k.nama.toLowerCase() === formData.nama.toLowerCase()
      );

      if (existingKomoditas) {
        komoditasId = existingKomoditas.id;
      } else {
        const { data: newKomo, error: komoErr } = await supabase
          .from("komoditas")
          .insert({
            nama: formData.nama,
            kategori: formData.kategori,
          })
          .select("id")
          .maybeSingle();

        if (!komoErr && newKomo) {
          komoditasId = newKomo.id;
        }
      }

      if (editItem) {
        const updatePayload: Record<string, any> = {
          varietas: formData.varietas,
          jumlah_stok_kg: formData.stok,
          harga_per_kg: formData.harga,
          status: formData.status,
          catatan_petik: formData.catatan,
          updated_at: new Date().toISOString(),
        };

        if (komoditasId) {
          updatePayload.komoditas_id = komoditasId;
        }

        const { error } = await supabase
          .from("stok_panen")
          .update(updatePayload)
          .eq("id", editItem.id);

        if (error) throw error;
        setNotification(`Stok "${formData.nama}" berhasil diperbarui!`);
      } else {
        const insertPayload: Record<string, any> = {
          kebun_id: farmerKebunId,
          varietas: formData.varietas,
          jumlah_stok_kg: formData.stok,
          harga_per_kg: formData.harga,
          status: formData.status,
          catatan_petik: formData.catatan,
          tanggal_panen: new Date().toISOString(),
        };

        if (komoditasId) {
          insertPayload.komoditas_id = komoditasId;
        }

        const { error } = await supabase.from("stok_panen").insert(insertPayload);
        if (error) throw error;
        setNotification(`Stok "${formData.nama}" berhasil ditambahkan ke peta!`);
      }

      await fetchPanenData();
      setTimeout(() => setNotification(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePanen = async (id: string, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus data stok "${nama}"?`)) return;

    try {
      const { error } = await supabase.from("stok_panen").delete().eq("id", id);
      if (error) throw error;

      setNotification(`Stok "${nama}" telah dihapus.`);
      await fetchPanenData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus stok.");
    }
  };

  const filteredPanen = daftarPanen.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.varietas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori =
      filterKategori === "Semua" || item.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Manajemen Stok Panen
          </h1>
          <p className="text-xs text-slate-500">
            Kelola stok komoditas aktif Anda yang langsung terdeteksi oleh radar UMKM
          </p>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Panen Baru</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama komoditas atau varietas..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 ml-1" />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Sayuran Buah">Sayuran Buah</option>
            <option value="Sayuran Daun">Sayuran Daun</option>
            <option value="Rempah & Bumbu">Rempah & Bumbu</option>
            <option value="Umbi-Umbian">Umbi-Umbian</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredPanen.length === 0 ? (
        <PanenEmptyState
          onAddClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          isFiltered={daftarPanen.length > 0}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPanen.map((item) => (
            <PanenCard
              key={item.id}
              item={item}
              onEdit={(itm) => {
                setEditItem(itm);
                setIsModalOpen(true);
              }}
              onDelete={handleDeletePanen}
            />
          ))}
        </div>
      )}

      {/* Panen Add/Edit Modal */}
      <PanenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editItem={editItem}
        komoditasList={komoditasList}
        isSaving={isSaving}
        onSave={handleSavePanen}
      />
    </div>
  );
}
