"use client";

import { useState } from "react";
import { WHATSAPP_CHEAT_SHEET } from "@/data/petani/whatsapp-data";
import { Copy, Check, Terminal } from "lucide-react";

export default function WhatsAppCheatSheet() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-600" />
            <span>Kamus Perintah Cepat WhatsApp</span>
          </h2>
          <p className="text-xs text-slate-500">
            Salin perintah di bawah ini dan kirimkan langsung ke nomor bot WhatsApp MitraPanen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {WHATSAPP_CHEAT_SHEET.map((item, idx) => (
          <div
            key={item.command}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  {item.badge}
                </span>

                <button
                  onClick={() => handleCopy(item.command, idx)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-700 transition-colors"
                  title="Salin Perintah"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Monospace Command Bar */}
              <div className="mt-3 rounded-xl bg-slate-900 px-3.5 py-2 font-mono text-xs font-bold text-emerald-400 select-all flex items-center justify-between">
                <span>{item.command}</span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-slate-800">{item.tujuan}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {item.keterangan}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
