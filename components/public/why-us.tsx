"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  MapPin,
  Store,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { WHY_US_DATA } from "@/data/landing-data";

export default function WhyUs() {
  const iconMap = {
    TrendingDown: TrendingDown,
    MapPin: MapPin,
    Store: Store,
  };

  return (
    <section id="mengapa" className="relative scroll-mt-24 bg-white py-20 lg:py-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Problem vs Solusi Cerdas</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Mengapa Memilih{" "}
            <span className="text-emerald-600">MitraPanen</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base text-slate-600 sm:text-lg"
          >
            Rantai pasok sayur & rempah tradisional melewati 3 hingga 4 lapis tengkulak yang
            membuat harga melambung tinggi dan sayur layu di perjalanan. MitraPanen
            menghubungkan langsung dapur UMKM dengan lahan kebun petani.
          </motion.p>
        </div>

        {/* 3 Main Feature Cards with 3D Depth & Hover Lift */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US_DATA.map((card, idx) => {
            const IconComponent = iconMap[card.iconName];

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-600/10"
              >
                {/* Subtle Glow on Top */}
                <div className="absolute inset-x-8 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${card.badgeColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mt-6">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                      {card.highlight}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Interactive Feature List */}
                <div className="mt-8 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      100% Bebas Mark-up Calo
                    </span>
                    <span className="font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                      Pelajari &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Problem vs Solution Comparison Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left: Traditional Channel */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="h-5 w-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Cara Lama (Rantai Tengkulak Konvensional)
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>
                    Harga melambung hingga 40-60% akibat markup 2-3 lapis perantara.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>
                    Bahan baku transit di gudang berhari-hari sehingga kesegaran turun & mudah busuk.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>
                    Petani ditekan dengan harga beli murah, sementara UMKM membeli mahal.
                  </span>
                </li>
              </ul>
            </div>

            {/* Right: MitraPanen Geo-SCM */}
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-6 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Cara Baru (MitraPanen Geo-SCM & Self-Pick Up)
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-emerald-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>
                    Harga langsung kebun: UMKM hemat modal, petani menerima margin pendapatan yang layak.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>
                    Bahan dipetik pada hari H pengambilan, menjamin aroma, tekstur & gizi terbaik.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>
                    Transparan lewat koordinat GIS dan kemudahan pesan via WhatsApp Bot.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
