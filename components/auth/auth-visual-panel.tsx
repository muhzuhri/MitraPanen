"use client";

import { motion } from "framer-motion";
import { Sprout, ShieldCheck, MapPin, TrendingDown, Sparkles } from "lucide-react";
import { AUTH_QUOTES } from "@/data/auth/auth-data";

interface AuthVisualPanelProps {
  mode: "login" | "register";
}

export default function AuthVisualPanel({ mode }: AuthVisualPanelProps) {
  const selectedQuote = mode === "login" ? AUTH_QUOTES[0] : AUTH_QUOTES[1];

  return (
    <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 p-12 text-white">
      {/* Background Decorative Ambient Blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-lime-400/10 blur-3xl" />

      {/* Subtle Topographic Grid Lines SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="3,3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>

      {/* Top Header / Branding */}
      <div className="relative z-10 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md transition-transform group-hover:scale-105">
            <Sprout className="h-6 w-6 text-emerald-300" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Mitra<span className="text-emerald-400">Panen</span>
            </span>
            <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
              Geo-SCM
            </span>
          </div>
        </a>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Aktif</span>
        </div>
      </div>

      {/* Middle Content: 3D Floating Feature Highlights */}
      <div className="relative z-10 my-auto space-y-8 py-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Konektivitas Langsung Ladang & Dapur</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight"
          >
            {mode === "login"
              ? "Selamat Datang Kembali di MitraPanen"
              : "Revolusi Pasokan Pangan Tanpa Tengkulak"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm leading-relaxed text-emerald-100/90 sm:text-base max-w-lg"
          >
            {mode === "login"
              ? "Masuk untuk memantau radar panen terdekat, mengelola pesanan WhatsApp, atau memeriksa ketersediaan komoditas segar hari ini."
              : "Bergabung bersama ribuan petani lokal dan pengusaha kuliner. Dapatkan harga tangan pertama dan transparansi lokasi panen secara real-time."}
          </motion.p>
        </div>

        {/* Floating Mini Badges / Metrics */}
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10 backdrop-blur-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Radar GIS Cerdas</p>
              <p className="text-[11px] text-emerald-200">Radius hingga 25 KM</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3 rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10 backdrop-blur-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Potong 3 Lapis Calo</p>
              <p className="text-[11px] text-emerald-200">Hemat s/d 35% Modal</p>
            </div>
          </motion.div>
        </div>

        {/* Motivation Quote Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border border-emerald-400/20 bg-emerald-950/40 p-5 backdrop-blur-md"
        >
          <p className="text-sm italic leading-relaxed text-emerald-100">
            &ldquo;{selectedQuote.quote}&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-emerald-800/60 pt-3 text-xs">
            <span className="font-bold text-white">{selectedQuote.author}</span>
            <span className="text-emerald-300">{selectedQuote.role}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Information */}
      <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/70 border-t border-white/10 pt-6">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Keamanan Data Terenkripsi Supabase</span>
        </div>
        <span>&copy; 2026 MitraPanen</span>
      </div>
    </div>
  );
}
