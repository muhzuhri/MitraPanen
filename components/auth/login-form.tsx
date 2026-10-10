"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Silakan lengkapi email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        let pesan = error.message;
        if (error.message.includes("Invalid login credentials")) {
          pesan = "Email atau kata sandi salah. Silakan periksa kembali.";
        } else if (error.message.includes("Email not confirmed")) {
          pesan = "Email belum dikonfirmasi. Silakan periksa inbox email Anda untuk verifikasi.";
        }
        setErrorMessage(pesan);
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Login berhasil! Mengarahkan ke dashboard...");

      let role = data.user?.user_metadata?.role;
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        if (prof?.role) {
          role = prof.role;
        }
      } catch {
        // Fallback ke metadata
      }

      const targetRole = role || "petani";
      // Redirect petani to /petani (directly, no obsolete /dashboard prefix)
      const targetUrl = targetRole === "petani" ? "/petani" : "/umkm";

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMessage(errorObj?.message || "Terjadi kesalahan saat masuk.");
      setIsLoading(false);
    }
  };

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

      {/* Alert Success */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 shadow-xs"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <div>{successMessage}</div>
        </motion.div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700">
            Email Terdaftar
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Kata Sandi
            </label>
            <a
              href="#"
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lupa sandi?
            </a>
          </div>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-600 font-medium">
              Ingat saya di perangkat ini
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
                <span>Memverifikasi Akun...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke Akun MitraPanen</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center text-xs text-slate-500">
        Belum memiliki akun MitraPanen?{" "}
        <Link
          href="/register"
          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Daftar Sekarang &rarr;
        </Link>
      </div>
    </div>
  );
}
