"use client";

import { motion } from "framer-motion";
import { Sprout, Store, Check, Sparkles } from "lucide-react";
import { UserRole } from "@/lib/types";
import { ROLE_OPTIONS } from "@/data/auth/auth-data";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Pilih Peran Akun Anda <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRole === option.id;
          const Icon = option.id === "petani" ? Sprout : Store;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(option.id)}
              className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-600/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    {option.title}
                  </h4>
                  <span
                    className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isSelected
                        ? "bg-emerald-200/80 text-emerald-900"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {option.badge}
                  </span>
                </div>
              </div>

              <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed">
                {option.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
