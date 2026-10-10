"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/data/landing-data";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
            <Sprout className="h-6 w-6 transition-transform group-hover:rotate-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Mitra<span className="text-emerald-600">Panen</span>
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Geo-SCM
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Langsung Petani • Self Pick-Up
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-emerald-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons (Desktop): Connect to /login and /register */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/35"
          >
            <span>Masuk</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          aria-label="Buka Menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-hidden md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl md:hidden sm:px-6"
          >
            <div className="flex flex-col space-y-3 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-xl border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700"
                >
                  <span>Daftar Mitra / Petani</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
