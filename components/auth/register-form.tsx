"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/lib/types";
import RoleSelector from "@/components/auth/role-selector";

export default function RegisterForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("petani");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const isPasswordMatch =
    password && confirmPassword ? password === confirmPassword : true;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName || !email || !whatsapp || !password || !confirmPassword) {
      setErrorMessage("Mohon lengkapi semua data wajib pada formulir.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    if (!termsAgreed) {
      setErrorMessage("Anda harus menyetujui syarat & ketentuan layanan.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: selectedRole,
            phone_whatsapp: whatsapp.trim(),
            business_name: businessName.trim() || null,
          },
        },
      });

      if (error) {
        let pesan = error.message;
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          pesan =
            "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.";
        }
        setErrorMessage(pesan);
        setIsLoading(false);
        return;
      }

      // Pastikan data tersimpan di tabel profiles
      if (data.user?.id) {
        try {
          await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              full_name: fullName.trim(),
              role: selectedRole,
              phone_whatsapp: whatsapp.trim(),
              business_name: businessName.trim() || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (selectedRole === "petani") {
            await supabase.from("kebun").insert({
              farmer_id: data.user.id,
              nama_kebun: businessName.trim() || `Kebun ${fullName.trim()}`,
              alamat: "Lembang, Bandung Barat",
              latitude: -6.8124,
              longitude: 107.6189,
            });
          }
        } catch (profileErr) {
          console.warn("Sinkronisasi profil:", profileErr);
        }
      }

      setIsRegistered(true);
      setSuccessMessage(
        "Pendaftaran berhasil! Akun Anda telah aktif di MitraPanen."
      );
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMessage(
        errorObj?.message || "Terjadi kesalahan saat memproses pendaftaran."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-black text-slate-900">
          Pendaftaran Berhasil!
        </h3>
        <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          Akun Anda sebagai{" "}
          <span className="font-bold text-emerald-700 uppercase">
            {selectedRole}
          </span>{" "}
          telah berhasil dibuat dan terintegrasi dengan database MitraPanen.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Alert Error */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs font-medium text-red-800 shadow-xs"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="leading-relaxed">{errorMessage}</div>
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Role Selector Card */}
        <RoleSelector
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
        />

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="081234567890"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>
        </div>

        {/* Business or Farm Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700">
            {selectedRole === "petani" ? "Nama Kelompok Tani / Kebun" : "Nama Usaha Kuliner / Resto"}
          </label>
          <div className="relative mt-1.5">
            <Building2 className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={
                selectedRole === "petani"
                  ? "Contoh: Kebun Sejahtera Lembang"
                  : "Contoh: Warung Sambal Nusantara"
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              Konfirmasi Sandi <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className={`w-full rounded-xl border bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
                  !isPasswordMatch && confirmPassword
                    ? "border-red-400 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-600 leading-relaxed">
              Saya menyetujui{" "}
              <a href="#" className="font-bold text-emerald-700 hover:underline">
                Syarat & Ketentuan
              </a>{" "}
              serta Kebijakan Privasi MitraPanen Geo-SCM.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Mendaftarkan Akun Anda...</span>
              </span>
            ) : (
              <>
                <span>Daftar Akun MitraPanen Sekarang</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center text-xs text-slate-500">
        Sudah memiliki akun terdaftar?{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Masuk di Sini &rarr;
        </Link>
      </div>
    </div>
  );
}
