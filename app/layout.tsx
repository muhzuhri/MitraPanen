import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MitraPanen - Bahan Baku Segar Langsung dari Petani ke Dapur UMKM",
  description:
    "Platform Agritech & Geo-SCM menghubungkan UMKM kuliner langsung dengan petani lokal untuk belanja bahan baku segar tangan pertama dengan sistem Self-Pick Up dan pesanan WhatsApp.",
  keywords: [
    "MitraPanen",
    "Agritech",
    "Bahan Baku Segar",
    "Petani Lokal",
    "UMKM Kuliner",
    "Geo-SCM",
    "Self Pick Up",
    "Pasokan Pangan",
  ],
  authors: [{ name: "MitraPanen Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
