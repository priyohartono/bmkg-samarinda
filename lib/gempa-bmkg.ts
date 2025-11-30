// --- TIPE DATA GEMPA (TETAP SAMA) ---
export interface GempaData {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan: string;
  Shakemap: string;
  ShakemapUrl?: string;
}

export interface GempaResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

// --- TIPE DATA CUACA (DISESUAIKAN API BARU) ---
export interface CuacaData {
  wilayah: string;
  cuaca: string;      // "Berawan", "Hujan Ringan"
  kodeCuaca: string;  // Kita mapping manual nanti biar widget icon tetap jalan
  suhu: string;       // "32"
  kelembapan: string; // "80"
  anginSpeed: string; // "10"
  anginDir: string;   // "SE"
  jam: string;        // "14:00 WITA" (Untuk info di widget)
}

// --- FUNGSI GEMPA (TETAP SAMA) ---
export async function getGempaTerbaru(): Promise<GempaData | null> {
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Gagal ambil gempa");
    const data: GempaResponse = await res.json();
    const gempa = data.Infogempa.gempa;
    gempa.ShakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
    return gempa;
  } catch (error) {
    return null;
  }
}

// --- HELPER: Mapping Deskripsi Cuaca ke Kode Icon ---
// Widget kita sebelumnya pakai logika kode (0-97). Kita pertahankan logikanya.
function mapIconCode(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes("cerah berawan")) return "1";
  if (d.includes("cerah")) return "0";
  if (d.includes("berawan tebal")) return "4";
  if (d.includes("berawan")) return "3";
  if (d.includes("kabut") || d.includes("asap")) return "45";
  if (d.includes("hujan ringan")) return "60";
  if (d.includes("hujan sedang")) return "61";
  if (d.includes("hujan lebat")) return "63";
  if (d.includes("petir")) return "95";
  return "3"; // Default Berawan
}

// --- FUNGSI CUACA (API BARU JSON) ---
export async function getCuacaSamarinda(): Promise<CuacaData | null> {
  try {
    // Kode Wilayah: 64.72.09.1003 (Sungai Pinang Dalam, Samarinda)
    const KODE_WILAYAH = "64.72.09.1003";
    
    const res = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${KODE_WILAYAH}`,
      { next: { revalidate: 300 } } // Cache 5 menit
    );

    if (!res.ok) throw new Error(`Gagal fetch API BMKG: ${res.status}`);
    
    const response = await res.json();

    // 1. Validasi Data
    if (!response.data || response.data.length === 0) return null;

    const lokasi = response.data[0].lokasi; // Data lokasi (Kelurahan, Kecamatan)
    const listCuaca = response.data[0].cuaca; // Array data per jam

    // 2. Cari Data Cuaca Terdekat dengan Jam Sekarang
    // API ini mengembalikan array cuaca multi-hari dalam bentuk nested array.
    // Kita perlu meratakan (flat) dulu.
    const allForecasts = listCuaca.flat();

    const now = new Date();
    
    // Sortir berdasarkan selisih waktu terkecil dengan 'now'
    // Format datetime API: "2024-12-06 12:00:00"
    const closestForecast = allForecasts.reduce((prev: any, curr: any) => {
      const prevDate = new Date(prev.local_datetime);
      const currDate = new Date(curr.local_datetime);
      
      return (Math.abs(currDate.getTime() - now.getTime()) < Math.abs(prevDate.getTime() - now.getTime())) 
        ? curr 
        : prev;
    });

    if (!closestForecast) return null;

    // 3. Format Data untuk Widget
    return {
      wilayah: `Samarinda (${lokasi.desa})`, // Ex: Samarinda (Sungai Pinang Dalam)
      cuaca: closestForecast.weather_desc,   // Ex: "Cerah Berawan"
      kodeCuaca: mapIconCode(closestForecast.weather_desc), // Ex: "1"
      suhu: closestForecast.t.toString(),    // Ex: "32"
      kelembapan: closestForecast.hu.toString(), // Ex: "75"
      anginSpeed: closestForecast.ws.toString(), // Ex: "10"
      anginDir: closestForecast.wd,          // Ex: "SE"
      jam: new Date(closestForecast.local_datetime).toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit"
      }) + " WITA"
    };

  } catch (error) {
    console.error("Fetch Cuaca Error:", error);
    return null;
  }
}