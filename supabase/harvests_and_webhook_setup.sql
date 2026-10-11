-- ==============================================================================
-- MITRAPANEN - SKEMA PENYEMPURNAAN BOT WHATSAPP & HARVESTS (BEBAS ERROR FK)
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
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 4. DAFTARKAN PROFIL SECARA DINAMIS DARI USER AUTH YANG ADA (MENCEGAH ERROR FK)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Mengambil ID akun yang ada di tabel auth.users
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      full_name,
      role,
      phone_whatsapp,
      phone_number
    )
    VALUES (
      v_user_id,
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

    -- Hubungkan kebun yang ada ke user id ini
    UPDATE public.kebun SET farmer_id = v_user_id;
  END IF;
END $$;

-- 5. CEK STATUS AKUN YANG ADA
SELECT id, email, created_at FROM auth.users;
