"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sprout, Store, MessageSquare, CheckCircle2 } from "lucide-react";

export default function CtaBanner() {
  return (
    <section id="daftar" className="relative scroll-mt-24 overflow-hidden bg-slate-900 py-20 lg:py-28 text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-950/70 p-8 shadow-2xl backdrop-blur-md sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Sprout className="h-4 w-4" />
              Bergabung Bersama 1.700+ Komunitas Mitra
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Siap Memangkas Tengkulak dan Menikmati{" "}
              <span className="text-emerald-400">Bahan Baku Segar Hari Ini?</span>
            </h2>

            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Apakah Anda pemilik usaha kuliner yang ingin menghemat biaya operasional, atau
              petani yang ingin menjual panen dengan harga pantas — MitraPanen adalah rumah Anda.
            </p>

            {/* Dual Action Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* UMKM Button */}
              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/35 hover:-translate-y-0.5 sm:w-auto"
              >
                <Store className="h-5 w-5 text-slate-950" />
                <span>Saya Pemilik UMKM (Beli Bahan)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Farmer Button */}
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-emerald-400/40 bg-slate-800/80 px-8 py-4 text-base font-bold text-white shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-950/60 hover:-translate-y-0.5 sm:w-auto"
              >
                <MessageSquare className="h-5 w-5 text-emerald-400" />
                <span>Saya Petani (Jual via WhatsApp)</span>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Gratis pendaftaran tanpa komisi tersembunyi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Dukungan teknis WhatsApp 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
