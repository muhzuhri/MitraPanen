"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Bot, PhoneCall, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import WhatsAppCheatSheet from "@/components/petani/whatsapp/whatsapp-cheatsheet";
import WhatsAppSimulator from "@/components/petani/whatsapp/whatsapp-simulator";

export default function AsistenWhatsappPage() {
  const [userName, setUserName] = useState("Mitra Petani");
  const [userPhone, setUserPhone] = useState("+62 8xx-xxxx-xxxx");
  const [farmName, setFarmName] = useState("Kebun Anda");

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("full_name, phone_whatsapp")
            .eq("id", user.id)
            .maybeSingle();

          const { data: kebun } = await supabase
            .from("kebun")
            .select("nama_kebun")
            .eq("farmer_id", user.id)
            .maybeSingle();

          const name =
            prof?.full_name ||
            user.user_metadata?.full_name ||
            "Mitra Petani";

          setUserName(name);
          setUserPhone(
            prof?.phone_whatsapp ||
              user.user_metadata?.phone_whatsapp ||
              "Terhubung ke Akun"
          );
          setFarmName(kebun?.nama_kebun || "Kebun Mandiri");
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Asisten Panen WhatsApp
          </h1>
          <p className="text-xs text-slate-500">
            Kendalikan stok kebun, respon pesanan UMKM, dan periksa harga pasar tanpa aplikasi rumit
          </p>
        </div>

        {/* WhatsApp Official Connect Card */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Nomor Terdaftar
            </p>
            <p className="text-xs font-black text-slate-900">{userPhone}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Cheat Sheet on Left, Interactive Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <WhatsAppCheatSheet />
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-600" />
                <span>Simulasi Interaksi Langsung</span>
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Uji Coba Perintah
              </span>
            </div>
            <WhatsAppSimulator farmerName={userName} />
          </div>
        </div>
      </div>
    </div>
  );
}
