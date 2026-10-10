"use client";

import { useState } from "react";
import { Send, Bot, Smartphone, CheckCheck } from "lucide-react";
import { WhatsAppMessage } from "@/data/petani/types";
import { MOCK_BOT_RESPONSES } from "@/data/petani/whatsapp-data";

interface WhatsAppSimulatorProps {
  farmerName: string;
}

export default function WhatsAppSimulator({ farmerName }: WhatsAppSimulatorProps) {
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      sender: "bot",
      text: `Halo Bapak/Ibu ${farmerName || "Petani"}! 🌾 Asisten Bot MitraPanen siap melayani pembaruan panen kebun Anda. Ketik PANEN, HABIS, atau CEK PESANAN.`,
      time: "09:30",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsgs: WhatsAppMessage[] = [
      ...messages,
      { sender: "petani", text: userText, time: currentTime },
    ];
    setMessages(newMsgs);
    setInputVal("");

    // Simulate smart bot response
    setTimeout(() => {
      const upper = userText.toUpperCase();
      let botReply =
        "🌾 Format perintah tidak dikenali. Ketik 'BANTUAN' untuk melihat daftar format perintah yang tersedia.";

      if (upper.startsWith("PANEN")) {
        botReply = MOCK_BOT_RESPONSES.PANEN;
      } else if (upper.startsWith("HABIS")) {
        botReply = MOCK_BOT_RESPONSES.HABIS;
      } else if (upper.includes("PESANAN") || upper.includes("CEK")) {
        botReply = MOCK_BOT_RESPONSES.CEK;
      } else if (upper.includes("HARGA")) {
        botReply = MOCK_BOT_RESPONSES.HARGA;
      } else if (upper.includes("SIAP")) {
        botReply = MOCK_BOT_RESPONSES.SIAP;
      } else if (upper.includes("BANTUAN") || upper.includes("HALO")) {
        botReply = MOCK_BOT_RESPONSES.BANTUAN;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply, time: currentTime },
      ]);
    }, 700);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
      {/* Phone Header Mockup */}
      <div className="flex items-center gap-3 bg-emerald-800 px-5 py-4 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <h3 className="text-sm font-black">MitraPanen WhatsApp Bot</h3>
          <p className="text-[11px] text-emerald-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online • Terhubung ke Server</span>
          </p>
        </div>
      </div>

      {/* Chat Messages Screen */}
      <div className="h-80 overflow-y-auto bg-slate-100/70 p-4 space-y-3">
        {messages.map((msg, index) => {
          const isMe = msg.sender === "petani";
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-xs ${
                  isMe
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-200/80"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                    isMe ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ketik perintah (contoh: PANEN CABAI 50 40000)..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
