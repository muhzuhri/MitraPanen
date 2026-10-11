-- ==============================================================================
-- MITRAPANEN - SKEMA PENYEMPURNAAN BOT WHATSAPP & HARVESTS
-- ==============================================================================
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project MitraPanen Anda -> Masuk ke menu "SQL Editor"
-- 3. Buat "New Query", paste seluruh kode ini, lalu klik "Run" (Ctrl+Enter)
-- ==============================================================================

-- 1. PASTIKAN KOLOM NOMOR TELEPON LENGKAP PADA TABEL PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_whatsapp TEXT;

-- 2. BUAT TABEL HARVESTS (SESUAI SPESIFIKASI SKENARIO 1)
CREATE TABLE IF NOT EXISTS public.harvests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  price_per_kg NUMERIC(12,2) NOT NULL CHECK (price_per_kg > 0),
  status TEXT NOT NULL DEFAULT 'tersedia',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_harvests_farmer_id ON public.harvests(farmer_id);
CREATE INDEX IF NOT EXISTS idx_harvests_status ON public.harvests(status);

-- 3. ATUR KEBIJAKAN ROW LEVEL SECURITY (RLS) AGAR AMAN & BISA DIAKSES OLEH BOT
ALTER TABLE public.harvests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Semua orang dapat membaca harvests" ON public.harvests;
CREATE POLICY "Semua orang dapat membaca harvests" 
  ON public.harvests FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Semua orang dapat mengelola harvests" ON public.harvests;
CREATE POLICY "Semua orang dapat mengelola harvests" 
  ON public.harvests FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 4. BUKA AKSES PROFILES DAN STOK_PANEN AGAR BOT BISA MEMVALIDASI NOMOR & MENAMPILKAN DI PETA
DROP POLICY IF EXISTS "Profiles dapat dibaca semua pengguna" ON public.profiles;
CREATE POLICY "Profiles dapat dibaca semua pengguna" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Semua bisa mengelola profiles" ON public.profiles;
CREATE POLICY "Semua bisa mengelola profiles" 
  ON public.profiles FOR ALL 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Semua bisa mengelola stok panen" ON public.stok_panen;
CREATE POLICY "Semua bisa mengelola stok panen" 
  ON public.stok_panen FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 5. DAFTARKAN PROFIL PETANI UNTUK AKUN ZUHRI (MENGHUBUNGKAN DENGAN KEBUN YANG SUDAH ADA)
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  phone_whatsapp,
  phone_number
)
VALUES (
  '3984777f-fe72-4fcf-85d4-8d5965c035d9',
  'Muh. Zuhri Mubarak',
  'petani',
  '082160107638',
  '082160107638'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = 'petani',
  phone_whatsapp = EXCLUDED.phone_whatsapp,
  phone_number = EXCLUDED.phone_number;

-- Selesai! Tabel harvests siap digunakan dan nomor 082160107638 resmi aktif sebagai Petani.
