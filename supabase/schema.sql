-- ==============================================================================
-- MITRAPANEN - SKEMA DATABASE SUPABASE LENGKAP & PEMBARUAN (POSTGRESQL)
-- Sistem Rantai Pasok Pertanian & UMKM Kuliner (Geo-SCM & Self-Pick Up)
-- ==============================================================================
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Klik menu "SQL Editor" pada sidebar kiri
-- 3. Klik tombol "New query"
-- 4. Copy-paste SELURUH isi file ini ke editor Supabase
-- 5. Klik "Run" (atau tekan Ctrl + Enter)
-- ==============================================================================

-- 1. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('petani', 'umkm', 'bumdes', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE panen_status AS ENUM ('tersedia', 'siap_petik', 'menipis', 'habis');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pesanan_status AS ENUM (
    'menunggu_konfirmasi',
    'dikonfirmasi',
    'siap_diambil',
    'selesai',
    'dibatalkan'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE metode_bayar AS ENUM ('self_pickup_cash', 'qris_di_kebun');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABEL PROFILES (Terhubung langsung dengan auth.users Supabase)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'petani',
  phone_whatsapp TEXT NOT NULL,
  business_name TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kolom tambahan jika tabel sudah ada sebelumnya
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_whatsapp TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- ==============================================================================
-- 3. TABEL KEBUN (Lahan Pertanian Petani dengan Koordinat GIS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kebun (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nama_kebun TEXT NOT NULL,
  alamat TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL DEFAULT -6.8124,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 107.6189,
  radius_layanan_km NUMERIC(5,2) DEFAULT 15.00,
  luas_lahan_m2 NUMERIC(10,2),
  deskripsi TEXT,
  foto_kebun_url TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kebun_coordinates ON public.kebun(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_kebun_farmer ON public.kebun(farmer_id);

-- ==============================================================================
-- 4. TABEL MASTER KOMODITAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.komoditas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL UNIQUE,
  kategori TEXT NOT NULL,
  satuan TEXT NOT NULL DEFAULT 'kg',
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABEL STOK PANEN (Daftar Produk Nyata Petani)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stok_panen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  kebun_id UUID REFERENCES public.kebun(id) ON DELETE CASCADE,
  komoditas_id UUID REFERENCES public.komoditas(id) ON DELETE SET NULL,
  nama_produk TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Sayuran Buah',
  varietas TEXT,
  jumlah_stok_kg NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (jumlah_stok_kg >= 0),
  harga_per_kg NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (harga_per_kg >= 0),
  tanggal_panen DATE NOT NULL DEFAULT CURRENT_DATE,
  status panen_status NOT NULL DEFAULT 'tersedia',
  catatan_petik TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menyesuaikan tabel jika sebelumnya sudah ada kolom dengan constraint ketat
ALTER TABLE public.stok_panen ADD COLUMN IF NOT EXISTS farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.stok_panen ADD COLUMN IF NOT EXISTS nama_produk TEXT;
ALTER TABLE public.stok_panen ADD COLUMN IF NOT EXISTS kategori TEXT DEFAULT 'Sayuran Buah';
ALTER TABLE public.stok_panen ALTER COLUMN kebun_id DROP NOT NULL;
ALTER TABLE public.stok_panen ALTER COLUMN komoditas_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_stok_panen_farmer ON public.stok_panen(farmer_id);
CREATE INDEX IF NOT EXISTS idx_stok_panen_kebun ON public.stok_panen(kebun_id);

-- ==============================================================================
-- 6. TABEL PESANAN & TRANSAKSI
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pesanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_pesanan TEXT UNIQUE NOT NULL,
  umkm_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  kebun_id UUID NOT NULL REFERENCES public.kebun(id) ON DELETE RESTRICT,
  total_harga NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_harga >= 0),
  status pesanan_status NOT NULL DEFAULT 'menunggu_konfirmasi',
  tanggal_pengambilan TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metode_pembayaran metode_bayar NOT NULL DEFAULT 'self_pickup_cash',
  catatan_umkm TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pesanan_umkm ON public.pesanan(umkm_id);
CREATE INDEX IF NOT EXISTS idx_pesanan_kebun ON public.pesanan(kebun_id);

-- ==============================================================================
-- 7. TABEL DETAIL PESANAN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.detail_pesanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pesanan_id UUID NOT NULL REFERENCES public.pesanan(id) ON DELETE CASCADE,
  stok_panen_id UUID REFERENCES public.stok_panen(id) ON DELETE SET NULL,
  nama_produk TEXT,
  jumlah_kg NUMERIC(10,2) NOT NULL CHECK (jumlah_kg > 0),
  harga_satuan NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. TRIGGER REGISTRASI USER & PEMBUATAN KEBUN OTOMATIS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
  v_name TEXT;
  v_phone TEXT;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'petani'::user_role);
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone_whatsapp', '-');

  -- 1. Buat Profil Pengguna
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    phone_whatsapp,
    business_name
  )
  VALUES (
    NEW.id,
    v_name,
    v_role,
    v_phone,
    NEW.raw_user_meta_data->>'business_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_whatsapp = EXCLUDED.phone_whatsapp;

  -- 2. Jika role adalah Petani, otomatis buatkan kebun awal
  IF v_role = 'petani' THEN
    INSERT INTO public.kebun (
      farmer_id,
      nama_kebun,
      alamat,
      latitude,
      longitude
    )
    VALUES (
      NEW.id,
      'Kebun ' || v_name,
      'Lembang, Bandung Barat',
      -6.8124,
      107.6189
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Pasang Trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES YANG AMAN & BERFUNGSI SEMPURNA
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kebun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komoditas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stok_panen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_pesanan ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles dapat dibaca semua pengguna" ON public.profiles;
DROP POLICY IF EXISTS "Profiles dapat dibaca pengguna terautentikasi" ON public.profiles;
DROP POLICY IF EXISTS "Pengguna dapat mengelola profil sendiri" ON public.profiles;
DROP POLICY IF EXISTS "Pengguna hanya bisa memperbarui profil sendiri" ON public.profiles;

CREATE POLICY "Profiles dapat dibaca semua pengguna"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Pengguna dapat mengelola profil sendiri"
  ON public.profiles FOR ALL TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Kebun Policies
DROP POLICY IF EXISTS "Kebun dapat dibaca semua pengguna" ON public.kebun;
DROP POLICY IF EXISTS "Petani dapat mengelola kebun miliknya" ON public.kebun;

CREATE POLICY "Kebun dapat dibaca semua pengguna"
  ON public.kebun FOR SELECT
  USING (true);

CREATE POLICY "Petani dapat mengelola kebun miliknya"
  ON public.kebun FOR ALL TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

-- Komoditas Policies
DROP POLICY IF EXISTS "Komoditas dapat dibaca semua pengguna" ON public.komoditas;
CREATE POLICY "Komoditas dapat dibaca semua pengguna"
  ON public.komoditas FOR SELECT
  USING (true);

-- Stok Panen Policies (Memastikan Petani bisa Insert, Update, Delete produknya)
DROP POLICY IF EXISTS "Stok panen dapat dibaca semua pihak" ON public.stok_panen;
DROP POLICY IF EXISTS "Petani dapat memperbarui stok panen miliknya" ON public.stok_panen;
DROP POLICY IF EXISTS "Petani kelola stok panen" ON public.stok_panen;

CREATE POLICY "Stok panen dapat dibaca semua pihak"
  ON public.stok_panen FOR SELECT
  USING (true);

CREATE POLICY "Petani kelola stok panen"
  ON public.stok_panen FOR ALL TO authenticated
  USING (
    farmer_id = auth.uid() OR
    kebun_id IN (SELECT id FROM public.kebun WHERE farmer_id = auth.uid())
  )
  WITH CHECK (
    farmer_id = auth.uid() OR
    kebun_id IN (SELECT id FROM public.kebun WHERE farmer_id = auth.uid())
  );

-- Pesanan Policies
DROP POLICY IF EXISTS "UMKM dan Petani dapat melihat pesanan terkait" ON public.pesanan;
DROP POLICY IF EXISTS "UMKM dapat membuat pesanan baru" ON public.pesanan;
DROP POLICY IF EXISTS "Petani dapat update status pesanan kebunnya" ON public.pesanan;

CREATE POLICY "Pesanan dapat dilihat pihak terkait"
  ON public.pesanan FOR SELECT TO authenticated
  USING (
    auth.uid() = umkm_id OR
    kebun_id IN (SELECT id FROM public.kebun WHERE farmer_id = auth.uid())
  );

CREATE POLICY "UMKM dapat membuat pesanan baru"
  ON public.pesanan FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = umkm_id);

CREATE POLICY "Petani dan UMKM dapat update pesanan terkait"
  ON public.pesanan FOR UPDATE TO authenticated
  USING (
    auth.uid() = umkm_id OR
    kebun_id IN (SELECT id FROM public.kebun WHERE farmer_id = auth.uid())
  );

-- Detail Pesanan Policies
DROP POLICY IF EXISTS "Akses detail pesanan sesuai pesanan induk" ON public.detail_pesanan;
CREATE POLICY "Akses detail pesanan sesuai pesanan induk"
  ON public.detail_pesanan FOR ALL TO authenticated
  USING (
    pesanan_id IN (
      SELECT id FROM public.pesanan
      WHERE umkm_id = auth.uid() OR kebun_id IN (SELECT id FROM public.kebun WHERE farmer_id = auth.uid())
    )
  );

-- ==============================================================================
-- 10. SEED DATA KOMODITAS UNGGULAN
-- ==============================================================================
INSERT INTO public.komoditas (nama, kategori, satuan)
VALUES
  ('Cabai Rawit Merah', 'Cabai & Rempah', 'kg'),
  ('Cabai Merah Keriting', 'Cabai & Rempah', 'kg'),
  ('Bawang Merah Brebes', 'Bawang & Umbi', 'kg'),
  ('Bawang Putih Kating', 'Bawang & Umbi', 'kg'),
  ('Tomat Beef Super', 'Sayuran Buah', 'kg'),
  ('Tomat Cherry Segar', 'Sayuran Buah', 'kg'),
  ('Selada Keriting Hijau', 'Sayuran Daun', 'kg'),
  ('Selada Romaine', 'Sayuran Daun', 'kg'),
  ('Jagung Manis Pipil', 'Palawija', 'kg')
ON CONFLICT (nama) DO NOTHING;

-- Selesai! Seluruh tabel, trigger, dan kebijakan RLS siap digunakan.
