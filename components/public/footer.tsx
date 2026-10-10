"use client";

import { Sprout, Heart, Mail, MapPin } from "lucide-react";
import { FOOTER_LINKS } from "@/data/landing-data";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer id="kontak" className="border-t border-slate-200 bg-white pt-16 pb-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Mission (Left Col) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Mitra<span className="text-emerald-600">Panen</span>
              </span>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Platform Geo-SCM (Geographic Supply Chain Management) yang memotong rantai
              tengkulak, menghubungkan UMKM kuliner langsung dengan petani lokal untuk belanja
              bahan baku segar secara Self-Pick Up.
            </p>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Kawasan Agroteknologi Bandung - Jawa Barat, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>halo@mitrapanen.id</span>
              </div>
            </div>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Radar GIS & WhatsApp Bot: Normal</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {group.title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="transition-colors hover:text-emerald-600 font-medium"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {currentYear} MitraPanen Indonesia. Didedikasikan untuk kedaulatan petani
            dan kemajuan UMKM kuliner nusantara.
          </p>

          <div className="flex items-center gap-1 font-medium text-slate-600">
            <span>Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>untuk Indonesia Hijau</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
