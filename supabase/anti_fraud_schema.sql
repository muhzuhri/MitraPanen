-- =========================================================================
-- MITRAPANEN ANTI-FRAUD & TRUST SYSTEM SCHEMA
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda
-- =========================================================================

-- 1. Penambahan Kolom Verifikasi KYC & Identitas pada Tabel `profiles`
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nik VARCHAR(20),
ADD COLUMN IF NOT EXISTS foto_ktp_url TEXT,
ADD COLUMN IF NOT EXISTS selfie_ktp_url TEXT,
ADD COLUMN IF NOT EXISTS foto_lahan_url TEXT,
ADD COLUMN IF NOT EXISTS standar_kualitas VARCHAR(100) DEFAULT 'Konvensional Bebas Pestisida Berbahaya',
ADD COLUMN IF NOT EXISTS status_verifikasi VARCHAR(50) DEFAULT 'belum_lengkap';

-- 2. Penambahan Kolom Verifikasi Kredibilitas Lahan pada Tabel `kebun`
ALTER TABLE IF EXISTS kebun
ADD COLUMN IF NOT EXISTS foto_kebun_url TEXT,
ADD COLUMN IF NOT EXISTS standar_kualitas VARCHAR(100) DEFAULT 'Konvensional Bebas Pestisida Berbahaya',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 3. Penambahan Kolom Metadata EXIF Kamera & Anti-Fraud pada Tabel `stok_panen`
ALTER TABLE IF EXISTS stok_panen
ADD COLUMN IF NOT EXISTS foto_panen_url TEXT,
ADD COLUMN IF NOT EXISTS exif_datetime TEXT,
ADD COLUMN IF NOT EXISTS exif_latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS exif_longitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS jarak_ke_kebun_meter NUMERIC,
ADD COLUMN IF NOT EXISTS is_exif_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trust_score INT DEFAULT 0;

-- 4. Indeks Kinerja untuk Kecepatan Query Verifikasi
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_kebun_is_verified ON kebun(is_verified);
CREATE INDEX IF NOT EXISTS idx_stok_panen_is_exif_verified ON stok_panen(is_exif_verified);

-- 5. (Opsional) Trigger otomatis untuk memperbarui status verifikasi saat NIK & KTP terisi
CREATE OR REPLACE FUNCTION update_petani_verification_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.nik IS NOT NULL AND LENGTH(NEW.nik) >= 16 AND NEW.foto_ktp_url IS NOT NULL AND NEW.foto_lahan_url IS NOT NULL THEN
        NEW.is_verified := TRUE;
        NEW.status_verifikasi := 'terverifikasi';
    ELSE
        NEW.is_verified := FALSE;
        NEW.status_verifikasi := 'belum_lengkap';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_petani_auto_verify ON profiles;
CREATE TRIGGER trg_petani_auto_verify
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_petani_verification_status();
