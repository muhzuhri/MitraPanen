"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Navigation2,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { HOW_IT_WORKS_DATA } from "@/data/landing-data";

export default function HowItWorks() {
  const iconMap = {
    Search: Search,
    CheckCircle2: CheckCircle2,
    Navigation2: Navigation2,
  };

  return (
    <section id="cara-kerja" className="relative scroll-mt-24 bg-white py-20 lg:py-32">
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
            <span>Alur Transparan & Efisien</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Cara Kerja{" "}
            <span className="text-emerald-600">3 Langkah Mudah</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-base text-slate-600 sm:text-lg"
          >
            Membeli langsung dari kebun kini semudah memesan lewat ponsel. Tanpa calo, tanpa
            biaya tersembunyi, dan tanpa ongkos kirim ekspedisi.
          </motion.p>
        </div>

        {/* 3 Step Cards Grid with Connecting Arrows */}
        <div className="relative mt-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {HOW_IT_WORKS_DATA.map((item, idx) => {
              const IconComponent = iconMap[item.iconName];

              return (
                <div key={item.step} className="relative flex flex-col">
                  {/* Step Card with 3D Depth & Hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                    whileHover={{ y: -8 }}
                    className="group relative flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/70 p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:shadow-2xl hover:shadow-emerald-600/10"
                  >
                    <div>
                      {/* Step Number & Icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-black tracking-tight text-slate-300 transition-colors group-hover:text-emerald-500">
                          {item.step}
                        </span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-md ring-1 ring-slate-200/80 transition-transform group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="mt-6 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          {item.subtitle}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="pt-2 text-sm leading-relaxed text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Tip pill at bottom */}
                    <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-900">
                      <span className="font-bold text-emerald-800">💡 Tips: </span>
                      {item.tip}
                    </div>
                  </motion.div>

                  {/* Desktop Connecting Arrow between steps */}
                  {idx < HOW_IT_WORKS_DATA.length - 1 && (
                    <div className="pointer-events-none absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-300 bg-white text-emerald-600 shadow-md">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-6 sm:p-8"
        >
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Jaminan Transaksi Aman & Kualitas Petik
                </h4>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Jika bahan baku saat di kebun tidak sesuai standar pesanan, Anda berhak membatalkan tanpa denda sepeser pun.
                </p>
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800"
            >
              <span>Mulai Pesan Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
