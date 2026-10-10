"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Search,
  Navigation2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Layers,
  Send,
  PhoneCall,
  Sliders,
  Maximize2,
  Compass,
} from "lucide-react";
import { FEATURES_DATA } from "@/data/landing-data";

export default function Features() {
  return (
    <section id="fitur" className="relative scroll-mt-24 bg-slate-50 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Fitur Unggulan Platform</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Teknologi Canggih yang{" "}
            <span className="text-emerald-600">Tetap Mudah Dipakai</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base text-slate-600 sm:text-lg"
          >
            Kombinasi sistem GIS presisi tinggi untuk UMKM dan kemudahan WhatsApp Bot untuk
            petani pedesaan menciptakan ekosistem rantai pasok paling inklusif.
          </motion.p>
        </div>

        {/* Zigzag Feature 1: GIS Map (Text Left, Mockup Right) */}
        <div className="mt-20 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              {FEATURES_DATA[0].badge}
            </span>

            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
              {FEATURES_DATA[0].title}
            </h3>

            <p className="text-base text-slate-600 leading-relaxed sm:text-lg">
              {FEATURES_DATA[0].description}
            </p>

            <div className="space-y-3 pt-2">
              {FEATURES_DATA[0].highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="#cara-kerja"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Lihat simulasi alur navigasi</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </motion.div>

          {/* Mockup Right: GIS Map Tailwind Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/50">
              {/* Map UI Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-slate-600">
                    MitraPanen GIS Engine v2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Radius: 5 KM</span>
                </div>
              </div>

              {/* Map Search & Filter Bar */}
              <div className="border-b border-slate-100 bg-white p-3">
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    Filter: Cabai Rawit Merah, Bawang Merah (Siap Panen Hari Ini)
                  </span>
                </div>
              </div>

              {/* Map Canvas Mockup with Tailwind Gradients, SVG Roads & Markers */}
              <div className="relative h-80 w-full overflow-hidden bg-slate-100">
                {/* Simulated Map Terrain */}
                <svg
                  className="absolute inset-0 h-full w-full opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  {/* Simulated Roads */}
                  <path
                    d="M 20 280 Q 150 150 380 180 T 600 40"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                  />
                  <path
                    d="M 120 30 Q 220 180 320 280"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                  />
                </svg>

                {/* Radar Distance Concentric Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full border border-emerald-400/40 bg-emerald-500/5 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full border border-emerald-500/30" />

                {/* UMKM Location Center Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-4 ring-white">
                    <Navigation2 className="h-4 w-4 rotate-45" />
                  </div>
                  <span className="mt-1 rounded-md bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    Dapur Resto Anda
                  </span>
                </div>

                {/* Farm Pin 1: Active Popover Highlight */}
                <div className="absolute top-12 right-12 z-20">
                  <div className="relative">
                    {/* Glowing Ping Marker */}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-200">
                      <MapPin className="h-4 w-4" />
                    </div>

                    {/* Popover Card */}
                    <div className="absolute -top-3 right-8 w-52 rounded-xl border border-emerald-200 bg-white/95 p-2.5 shadow-xl backdrop-blur-md">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-emerald-700">
                          Kebun Pak Somad
                        </span>
                        <span className="rounded-xs bg-emerald-100 px-1 font-bold text-emerald-800">
                          2.8 km
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        150 kg Cabai Siap Petik
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Rp 21.000 / kg</span>
                        <span className="font-bold text-emerald-600">Rute 8 Menit</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farm Pin 2 (Bottom Left) */}
                <div className="absolute bottom-8 left-16 z-10 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-2 py-1 shadow-md">
                  <div className="h-3 w-3 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-bold text-slate-700">
                    Kebun Bu Siti (Bawang 90 kg)
                  </span>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-md text-slate-600 text-xs">
                  <button className="h-6 w-6 font-bold hover:bg-slate-100 rounded">+</button>
                  <button className="h-6 w-6 font-bold hover:bg-slate-100 rounded">-</button>
                </div>
              </div>

              {/* Map Footer Bar */}
              <div className="flex items-center justify-between bg-white px-4 py-3 text-xs">
                <span className="font-medium text-slate-600">
                  Ditemukan <strong className="text-emerald-700">12 Titik Kebun Siap Panen</strong> dalam 5 km
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700 text-[11px]">
                  Terverifikasi Satelit GIS
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Zigzag Feature 2: WhatsApp Bot (Mockup Left, Text Right) */}
        <div className="mt-28 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Mockup Left: Realistic WhatsApp Chat Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 lg:col-span-6"
          >
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-slate-800 bg-[#efeae2] shadow-2xl shadow-slate-300/60">
              {/* Phone Speaker Notch */}
              <div className="bg-slate-800 py-1.5 text-center">
                <div className="mx-auto h-1 w-16 rounded-full bg-slate-600" />
              </div>

              {/* WhatsApp App Bar */}
              <div className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm ring-2 ring-emerald-300">
                    MP
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold">MitraPanen Bot</span>
                      <span className="rounded-full bg-emerald-500/40 px-1.5 py-0.2 text-[9px] font-semibold">
                        Resmi
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-200">Online • Terverifikasi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <PhoneCall className="h-4 w-4" />
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="space-y-3 p-4 text-xs">
                {/* Date Chip */}
                <div className="text-center">
                  <span className="rounded-md bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-2xs">
                    HARI INI
                  </span>
                </div>

                {/* Bot Message Bubble (Incoming) */}
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-white p-3 text-slate-800 shadow-sm space-y-1.5">
                  <p className="font-bold text-emerald-800">
                    🌾 Notifikasi Pesanan Masuk!
                  </p>
                  <p className="leading-relaxed">
                    Halo <strong>Pak Subagyo</strong>! Ada pesanan dari:
                    <br />
                    🏢 <strong>Dapur Resto Bu Lisa (Radius 3.2 km)</strong>
                  </p>
                  <div className="rounded-lg bg-slate-50 p-2 text-[11px] font-mono text-slate-700">
                    • 40 kg Cabai Rawit Merah
                    <br />
                    • Total: Rp 880.000 (Tunai saat ambil)
                    <br />• Jadwal Ambil: Hari ini, Pukul 15.30 WIB
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">09:14 WIB</p>
                </div>

                {/* Farmer Message Bubble (Outgoing) */}
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-xs bg-[#d9fdd3] p-3 text-slate-800 shadow-sm space-y-1">
                  <p className="leading-relaxed">
                    Siap, pesanan dikonfirmasi. Cabai baru dipetik pagi tadi, stok sangat bagus dan segar. Sudah saya sisihkan di gubuk depan.
                  </p>
                  <p className="text-[10px] text-slate-400 text-right">09:16 WIB ✓✓</p>
                </div>

                {/* Bot Quick Reply Feedback (Incoming) */}
                <div className="max-w-[85%] rounded-2xl rounded-tl-xs bg-white p-3 text-slate-800 shadow-sm space-y-2">
                  <p className="text-slate-700 leading-relaxed">
                    Terima kasih Pak Subagyo! Rute navigasi GPS kebun Bapak telah dikirimkan ke Bu Lisa.
                  </p>
                  {/* WhatsApp Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-center text-[11px] font-bold text-white shadow-xs"
                    >
                      Buka Rincian
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-slate-300 py-1.5 text-center text-[11px] font-semibold text-slate-700"
                    >
                      Bantuan Bot
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">09:17 WIB</p>
                </div>
              </div>

              {/* Chat Input Bar (Mockup) */}
              <div className="flex items-center gap-2 border-t border-slate-200 bg-[#f0f2f5] p-2.5">
                <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-slate-400 text-xs">
                  Ketik pesan atau rekam suara...
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 lg:col-span-6 space-y-6"
          >
            <span className="inline-block rounded-full bg-teal-100 px-3.5 py-1 text-xs font-bold text-teal-800">
              {FEATURES_DATA[1].badge}
            </span>

            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
              {FEATURES_DATA[1].title}
            </h3>

            <p className="text-base text-slate-600 leading-relaxed sm:text-lg">
              {FEATURES_DATA[1].description}
            </p>

            <div className="space-y-3 pt-2">
              {FEATURES_DATA[1].highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Coba Chat Demo WhatsApp Bot</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
