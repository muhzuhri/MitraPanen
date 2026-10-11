"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Save,
  Loader2,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUmkm } from "@/components/umkm/layout/umkm-context";

export default function ProfilUsahaForm() {
  const { profile, refreshProfile } = useUmkm();

  const [namaUsaha, setNamaUsaha] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsapp, setPhoneWhatsapp] = useState("");
  const [alamat, setAlamat] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setNamaUsaha(profile.namaUsaha || "");
      setNamaPemilik(profile.pemilik || "");
      setEmail(profile.email || "");
      setPhoneWhatsapp(profile.phoneWhatsapp || "");
      setAlamat(profile.alamat || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNotification("Sesi login berakhir. Silakan login kembali.");
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          business_name: namaUsaha.trim(),
          full_name: namaPemilik.trim(),
          phone_whatsapp: phoneWhatsapp.trim(),
          address: alamat.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setNotification(`Gagal menyimpan: ${error.message}`);
      } else {
        await refreshProfile();
        setNotification("Perubahan profil usaha berhasil disimpan.");
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification("Terjadi kendala saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Profil Usaha
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Data badan usaha yang terdaftar saat registrasi akun.
        </p>
      </div>

      {/* Feedback Alert */}
      {notification && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Usaha / Toko
            </label>
            <div className="relative">
              <Store className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                placeholder="Contoh: Dapur Rasa Bunda"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pemilik
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={namaPemilik}
                  onChange={(e) => setNamaPemilik(e.target.value)}
                  placeholder="Nama lengkap pemilik"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneWhatsapp}
                  onChange={(e) => setPhoneWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Akun
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Operasional Dapur / Usaha
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat jalan atau kelurahan/kecamatan"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
