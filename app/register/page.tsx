"use client";

import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import AuthVisualPanel from "@/components/auth/auth-visual-panel";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Left Visual Brand Showcase Panel (Desktop) */}
      <AuthVisualPanel mode="register" />

      {/* 2. Right Form Column */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex lg:hidden items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="text-sm font-black text-slate-900">
              Mitra<span className="text-emerald-600">Panen</span>
            </span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="mx-auto w-full max-w-lg my-auto py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Daftar Akun Baru
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Gabung ekosistem rantai pasok cerdas tanpa perantara tengkulak
            </p>
          </div>

          <RegisterForm />
        </div>

        {/* Bottom Security Note */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          Dilindungi oleh enkripsi Supabase Auth • MitraPanen Geo-SCM 2026
        </div>
      </div>
    </div>
  );
}
