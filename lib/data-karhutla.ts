// lib/data-karhutla.ts

export interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  conf: number;
  satellite: string;
  date: string;
  subDistrict: string;
  district?: string;
}

// Helper: Format Date ke YYYYMMDD
const formatDateYMD = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

// Helper: Fetch Data per Tanggal (Parsing TXT Manual)
async function fetchBMKGHotspot(date: Date): Promise<HotspotData[]> {
  const dateStr = formatDateYMD(date);
  
  // URL File TXT BMKG
  const url = `https://cews.bmkg.go.id/tempatirk/HOTSPOT/${dateStr}/hotspot_${dateStr}.txt`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 jam

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Failed to fetch hotspot data: ${res.status}`);
    }

    const textData = await res.text();
    if (!textData) return [];

    // Pecah per baris
    const lines = textData.trim().split('\n');

    // Skip Baris Pertama (Header)
    const dataRows = lines.slice(1);

    const cleanData = dataRows
      .map((line, index) => {
        const col = line.split('\t');

        // Pastikan baris memiliki data yang cukup
        if (col.length < 10) return null;

        const prov = col[4]?.trim() || ""; 
        
        // Filter Khusus KALIMANTAN TIMUR
        if (!prov.toUpperCase().includes("KALIMANTAN TIMUR")) return null;

        return {
          id: `${dateStr}-${index}`,
          lng: parseFloat(col[0]),        // Index 0: BUJUR
          lat: parseFloat(col[1]),        // Index 1: LINTANG
          conf: parseInt(col[2]) || 0,    // Index 2: KEPERCAYAAN
          district: col[5]?.trim(),       // Index 5: KABUPATEN
          subDistrict: col[6] ? `Kec. ${col[6].trim()}` : "Kecamatan Tdk Teridentifikasi", // Index 6
          satellite: col[7]?.trim(),      // Index 7: SATELIT
          date: `${col[8]} ${col[9]} WIB`,// Index 8 & 9: TGL & WAKTU
        };
      })
      // PERBAIKAN FILTER: Menggunakan casting 'as HotspotData[]' agar lebih aman
      .filter((item) => item !== null) as HotspotData[];

    return cleanData;

  } catch (error) {
    console.error(`Error fetching hotspot for ${dateStr}:`, error);
    return [];
  }
}

// FUNGSI UTAMA 1: Ambil Data Terbaru (Hari Ini atau Kemarin)
export async function getHotspots(): Promise<HotspotData[]> {
  const today = new Date();
  
  // Gunakan 'let' agar bisa diubah nilainya jika hari ini kosong
  let data = await fetchBMKGHotspot(today);

  // Jika hari ini kosong, ambil kemarin
  if (data.length === 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    data = await fetchBMKGHotspot(yesterday);
  }

  return data;
}

// FUNGSI UTAMA 2: Ambil Trend 7 Hari Terakhir (Hanya Jumlah)
export async function getHotspotTrend() {
  const promises = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    promises.push(fetchBMKGHotspot(d));
  }

  const results = await Promise.all(promises);

  return results.map((dailyData, index) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - index)); 
    return {
      date: d.toISOString(),
      count: dailyData.length,
    };
  });
}

// FUNGSI UTAMA 3: Ambil Data RAW 7 Hari Terakhir (Untuk Peta Mingguan)
export async function getRawWeeklyHotspots(): Promise<HotspotData[]> {
  const promises = [];
  const today = new Date();

  // Loop 7 hari ke belakang
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    promises.push(fetchBMKGHotspot(d));
  }

  const results = await Promise.all(promises);
  // Menggabungkan array of arrays menjadi satu array flat
  return results.flat();
}