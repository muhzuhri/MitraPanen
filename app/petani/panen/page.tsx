"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Loader2,
  Sparkles,
  Lock,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PanenItem, KomoditasMaster } from "@/data/petani/types";
import PanenCard from "@/components/petani/panen/panen-card";
import PanenModal from "@/components/petani/panen/panen-modal";
import PanenEmptyState from "@/components/petani/panen/panen-empty-state";

export default function ManajemenPanenPage() {
  const [daftarPanen, setDaftarPanen] = useState<PanenItem[]>([]);
  const [komoditasList, setKomoditasList] = useState<KomoditasMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [farmerKebunId, setFarmerKebunId] = useState<string | null>(null);
  const [farmLocation, setFarmLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: -6.8124, longitude: 107.6189 });

  // Status Verifikasi & Anti-Fraud Locking
  const [isVerified, setIsVerified] = useState(false);

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

      // 1. Cek Verifikasi Profil Petani (KYC & Lahan)
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const hasNik = Boolean(prof?.nik && prof.nik.length >= 16);
      const hasKtp = Boolean(prof?.foto_ktp_url);
      const hasLahan = Boolean(prof?.foto_lahan_url);
      const profileVerified =
        Boolean(prof?.is_verified) || (hasNik && hasKtp && hasLahan);

      // 2. Ambil Kebun Petani
      const { data: kebunList } = await supabase
        .from("kebun")
        .select("id, nama_kebun, latitude, longitude, foto_kebun_url, is_verified")
        .eq("farmer_id", user.id)
        .limit(1);

      const currentKebun = kebunList?.[0];
      const kebunId = currentKebun?.id;
      setFarmerKebunId(kebunId || null);

      if (currentKebun?.latitude && currentKebun?.longitude) {
        setFarmLocation({
          latitude: Number(currentKebun.latitude),
          longitude: Number(currentKebun.longitude),
        });
      }

      const isFinalVerified =
        profileVerified ||
        Boolean(currentKebun?.is_verified) ||
        (hasNik && hasKtp && Boolean(currentKebun?.foto_kebun_url));

      setIsVerified(isFinalVerified);

      // 3. Ambil Master Komoditas
      const { data: kData } = await supabase
        .from("komoditas")
        .select("id, nama, kategori");
      if (kData && kData.length > 0) {
        setKomoditasList(kData);
      }

      if (!kebunId) {
        setDaftarPanen([]);
        setIsLoading(false);
        return;
      }

      // 4. Ambil stok_panen
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
        .eq("kebun_id", kebunId)
        .order("created_at", { ascending: false });

      if (stokErr) {
        console.error("Gagal mengambil stok_panen:", stokErr);
      } else if (stokRows) {
        const mapped: PanenItem[] = stokRows.map((row: any) => {
          const dateStr =
            row.updated_at || row.created_at || new Date().toISOString();
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

  // Simpan / Tambah Panen Baru
  const handleSavePanen = async (formData: {
    nama: string;
    kategori: string;
    varietas: string;
    stok: number;
    harga: number;
    status: PanenItem["status"];
    catatan: string;
    fotoPanenUrl?: string;
    exifData?: {
      dateTime?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      distanceMeters?: number | null;
      trustScore?: number;
    };
  }) => {
    if (!farmerKebunId) {
      throw new Error("Kebun belum terhubung. Silakan muat ulang halaman.");
    }

    if (!isVerified) {
      throw new Error(
        "Profil belum terverifikasi. Lengkapi NIK dan KTP Anda terlebih dahulu."
      );
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

        const { error } = await supabase
          .from("stok_panen")
          .insert(insertPayload);
        if (error) throw error;
        setNotification(
          `✅ Panen "${formData.nama}" berhasil diverifikasi & ditambahkan ke peta!`
        );
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

      {/* BANNER SISTEM BLOKIR: Jika belum terverifikasi */}
      {!isVerified && !isLoading && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-4 sm:p-5 text-amber-950 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-500 text-white p-2.5 shrink-0 shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-950">
                  ⚠️ Lengkapi Profil & Verifikasi KTP Anda di menu Profil untuk mulai menjual.
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Sistem keamanan Anti-Fraud mengunci penambahan stok panen sampai Anda mengunggah nomor NIK, foto KTP asli, dan foto lahan kebun.
                </p>
              </div>
            </div>

            <Link
              href="/petani/profil"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors shrink-0"
            >
              <span>Verifikasi Sekarang</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Manajemen Stok Panen
            </h1>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                Anti-Fraud Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                <ShieldAlert className="h-3 w-3 text-red-600" />
                Fitur Jual Terkunci
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap stok panen wajib divalidasi keaslian fotonya melalui sensor EXIF kamera dan koordinat kebun.
          </p>
        </div>

        {/* Tombol Tambah Panen Baru: DIBLOKIR / DIKUNCI JIKA PROFIL BELUM LENGKAP */}
        {isVerified ? (
          <button
            onClick={() => {
              setEditItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Tambah Panen Baru</span>
          </button>
        ) : (
          <div className="relative group self-start sm:self-auto">
            <button
              disabled
              className="flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-400 shadow-xs cursor-not-allowed border border-slate-300"
              title="Lengkapi profil dan verifikasi KTP terlebih dahulu"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              <span>+ Tambah Panen Baru (Terkunci)</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-20 w-64 rounded-xl bg-slate-900 p-2.5 text-[11px] text-white shadow-xl">
              ⚠️ Lengkapi Profil & Verifikasi KTP Anda di menu Profil untuk mulai menjual.
            </div>
          </div>
        )}
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
            if (isVerified) {
              setEditItem(null);
              setIsModalOpen(true);
            } else {
              window.location.href = "/petani/profil";
            }
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

      {/* Panen Add/Edit Modal dengan Anti-Fraud Engine */}
      <PanenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editItem={editItem}
        komoditasList={komoditasList}
        isSaving={isSaving}
        farmLocation={farmLocation}
        onSave={handleSavePanen}
      />
    </div>
  );
}
