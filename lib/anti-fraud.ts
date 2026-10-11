import exifr from "exifr";

export interface PhotoExifData {
  dateTimeOriginal: string | null;
  latitude: number | null;
  longitude: number | null;
  make: string | null;
  model: string | null;
  software: string | null;
}

export interface AntiFraudAnalysisResult {
  isValid: boolean;
  hasGps: boolean;
  isAiOrInternetSuspect: boolean;
  dateTime: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceMeters: number | null;
  cameraInfo: string | null;
  trustScore: number;
  message: string;
}

/**
 * Menghitung jarak antara dua koordinat (Haversine formula) dalam meter
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Ekstraksi metadata EXIF dari file foto langsung di browser
 */
export async function extractExif(file: File): Promise<PhotoExifData> {
  try {
    const output = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
    });

    if (!output) {
      return {
        dateTimeOriginal: null,
        latitude: null,
        longitude: null,
        make: null,
        model: null,
        software: null,
      };
    }

    const dt =
      output.DateTimeOriginal ||
      output.CreateDate ||
      output.ModifyDate ||
      null;

    let formattedDate: string | null = null;
    if (dt instanceof Date) {
      formattedDate = dt.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (typeof dt === "string") {
      formattedDate = dt;
    }

    return {
      dateTimeOriginal: formattedDate,
      latitude: typeof output.latitude === "number" ? output.latitude : null,
      longitude: typeof output.longitude === "number" ? output.longitude : null,
      make: output.Make || null,
      model: output.Model || null,
      software: output.Software || null,
    };
  } catch (err) {
    console.warn("Gagal membaca EXIF:", err);
    return {
      dateTimeOriginal: null,
      latitude: null,
      longitude: null,
      make: null,
      model: null,
      software: null,
    };
  }
}

/**
 * Simulasi Deteksi AI Forgery / Deepfake / Web-Scraping (Delay 2 detik)
 */
export async function simulateAiForgeryDetection(
  file: File,
  exif: PhotoExifData
): Promise<{ isAiOrInternetSuspect: boolean; trustScore: number }> {
  // Simulasi neural scan delay 2 detik sesuai ketentuan
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const fileName = file.name.toLowerCase();

  // Indikator gambar hasil download internet / screenshot / AI generators
  const isWebDownloadName =
    fileName.includes("download") ||
    fileName.includes("screenshot") ||
    fileName.includes("whatsapp") ||
    fileName.includes("image_") ||
    fileName.includes("ai_") ||
    fileName.includes("generated") ||
    fileName.endsWith(".webp");

  // Periksa apakah ada software AI / editing dalam metadata
  const softwareTag = (exif.software || "").toLowerCase();
  const isEditedBySoftware =
    softwareTag.includes("photoshop") ||
    softwareTag.includes("canva") ||
    softwareTag.includes("midjourney") ||
    softwareTag.includes("dall-e") ||
    softwareTag.includes("stable diffusion");

  // Jika tidak ada EXIF GPS dan nama file mencurigakan, flag sebagai AI/Internet suspect
  if (!exif.latitude && !exif.longitude && (isWebDownloadName || isEditedBySoftware)) {
    return {
      isAiOrInternetSuspect: true,
      trustScore: 24,
    };
  }

  // Jika ada metadata kamera / GPS yang valid
  if (exif.latitude && exif.longitude) {
    return {
      isAiOrInternetSuspect: false,
      trustScore: 98,
    };
  }

  // Jika file foto umum tanpa GPS
  return {
    isAiOrInternetSuspect: false,
    trustScore: 50,
  };
}

/**
 * Analisis Lengkap Anti-Fraud untuk Foto Panen
 */
export async function analyzeHarvestPhoto(
  file: File,
  farmLocation?: { latitude: number; longitude: number }
): Promise<AntiFraudAnalysisResult> {
  // 1. Ekstrak EXIF
  const exif = await extractExif(file);

  // 2. Jalankan simulasi AI Forgery (2 detik delay)
  const aiResult = await simulateAiForgeryDetection(file, exif);

  const hasGps = exif.latitude !== null && exif.longitude !== null;
  let distanceMeters: number | null = null;

  if (hasGps && farmLocation && farmLocation.latitude && farmLocation.longitude) {
    distanceMeters = calculateDistanceMeters(
      exif.latitude!,
      exif.longitude!,
      farmLocation.latitude,
      farmLocation.longitude
    );
  }

  const cameraInfo = exif.model
    ? `${exif.make ? exif.make + " " : ""}${exif.model}`
    : null;

  // Syarat Lolos Keaslian (Anti-Fraud & Trust):
  // Harus memiliki data GPS nyata dan tidak terindikasi hasil unduhan/AI
  const isGpsValid = hasGps;
  const isAiValid = !aiResult.isAiOrInternetSuspect;

  const isValid = isGpsValid && isAiValid;

  let message = "";
  if (!hasGps) {
    message =
      "❌ Foto terindikasi hasil unduhan/AI atau tidak memiliki data GPS. Harap foto langsung dari kebun Anda untuk keamanan UMKM.";
  } else if (aiResult.isAiOrInternetSuspect) {
    message =
      "❌ Foto terindikasi hasil manipulasi AI atau unduhan web. Unggah foto asli dari kamera ponsel langsung.";
  } else {
    message = "✅ Foto asli diverifikasi dari sensor kamera kebun.";
  }

  return {
    isValid,
    hasGps,
    isAiOrInternetSuspect: aiResult.isAiOrInternetSuspect,
    dateTime: exif.dateTimeOriginal,
    latitude: exif.latitude,
    longitude: exif.longitude,
    distanceMeters,
    cameraInfo,
    trustScore: aiResult.trustScore,
    message,
  };
}
