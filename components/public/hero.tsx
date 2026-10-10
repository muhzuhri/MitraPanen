"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingDown,
  Navigation,
  Scale,
  Leaf,
  Store,
} from "lucide-react";
import { HERO_STATS } from "@/data/landing-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Decorative Ambient Blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline, Subheadline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 shadow-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Revolusi Rantai Pasok Pangan (Geo-SCM)
              </span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Bahan Baku Segar,{" "}
                <span className="relative inline-block text-emerald-600">
                  Langsung dari Petani
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-emerald-300 -z-10"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9.5C80 2.5 220 2.5 298 9.5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                ke Dapur Anda.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed">
                Potong rantai tengkulak. Temukan panen terdekat dengan{" "}
                <strong className="font-semibold text-slate-800">Peta Pintar</strong>, pesan
                via sistem, dan ambil langsung ke lokasi kebun dengan harga tangan pertama.
              </p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Cari Bahan Baku</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white/80 px-7 py-4 text-base font-bold text-slate-700 shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-50/50 hover:text-emerald-700 hover:-translate-y-0.5"
              >
                <span>Pelajari Lebih Lanjut</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Tanpa Biaya Ongkir Mahal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Petani Terverifikasi GIS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Pesan Cepat via WhatsApp Bot</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Depth Card & Simulated Radar UI */}
          <div className="relative lg:col-span-5">
            {/* 3D Floating Badge 1 (Top Left) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Petik Pagi Ini
                </p>
                <p className="text-xs font-black text-slate-800">100% Segar Alami</p>
              </div>
            </motion.div>

            {/* 3D Floating Badge 2 (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -right-4 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase">
                  Potong Rantai Calo
                </p>
                <p className="text-xs font-black text-slate-800">Hemat s/d 35% Modal</p>
              </div>
            </motion.div>

            {/* Main Interactive Live Radar Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-300/40"
            >
              {/* Card Header: Simulated GIS Radar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                    <Navigation className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Radar Panen Dapur Anda
                    </h3>
                    <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Radius Aktif: 5.0 KM Terdekat
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  Live GIS
                </span>
              </div>

              {/* Sample Harvest Listings */}
              <div className="mt-4 space-y-3">
                {/* Harvest Item 1 */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                          Cabai Rawit Merah
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          • Siap Petik
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-800">
                        Kebun Pak Sukirno
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          2.4 km (Lembang)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Slot: 14:00 WIB
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-emerald-600">
                        Rp 22.000<span className="text-[10px] font-normal text-slate-400">/kg</span>
                      </p>
                      <p className="text-[10px] line-through text-slate-400">
                        Pasar: Rp 34.000
                      </p>
                      <span className="mt-0.5 inline-block rounded-xs bg-emerald-100 px-1 text-[9px] font-black text-emerald-800">
                        Hemat 35%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Harvest Item 2 */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                          Tomat Mawar Super
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          • Stok 75 kg
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-800">
                        Kebun Bu Sri Rahayu
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          3.8 km (Cisarua)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Petik Segar Pagi
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-emerald-600">
                        Rp 8.500<span className="text-[10px] font-normal text-slate-400">/kg</span>
                      </p>
                      <p className="text-[10px] line-through text-slate-400">
                        Pasar: Rp 14.000
                      </p>
                      <span className="mt-0.5 inline-block rounded-xs bg-emerald-100 px-1 text-[9px] font-black text-emerald-800">
                        Hemat 39%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar Bottom */}
              <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-3 text-white">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold">Self-Pick Up Terjadwal</p>
                    <p className="text-[11px] text-emerald-100">
                      Koordinat GPS & WhatsApp Petani Siaga
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xs transition hover:bg-emerald-50 active:scale-95"
                  >
                    Buka Peta
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Quick Statistics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:grid-cols-4 sm:p-8"
        >
          {HERO_STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`space-y-1 ${
                idx !== 0 ? "sm:border-l sm:border-slate-200 sm:pl-6" : ""
              }`}
            >
              <div className="text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-800">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-slate-500 font-medium">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
