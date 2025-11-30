// Tipe data respon dari NOAA API
export interface MetarData {
  metar_id: number;
  icaoId: string;
  receiptTime: string;
  obsTime: number;
  reportTime: string;
  temp: number; // Celcius
  dewp: number; // Dew point
  wdir: number | "VRB"; // Arah angin
  wspd: number; // Kecepatan angin (Knots)
  visib: number; // Visibility (Statute Miles - perlu konversi)
  altim: number; // QNH (Pressure in hPa/mb - perlu cek unit)
  rawOb: string; // String METAR mentah
  clouds: { cover: string; base: number }[];
}

export async function getMetarData(icaoCode: string): Promise<MetarData | null> {
  try {
    // Menggunakan API NOAA (Aviation Weather Center)
    // format=json, ids=WALS (Kode ICAO Samarinda)
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=json&taf=false`,
      { next: { revalidate: 300 } } // Cache data selama 5 menit (standar update METAR)
    );

    if (!res.ok) throw new Error("Gagal mengambil data METAR");

    const data = await res.json();

    // Jika array kosong, berarti data tidak tersedia
    if (!data || data.length === 0) return null;

    return data[0]; // Ambil data terbaru (index 0)
  } catch (error) {
    console.error("Error fetching METAR:", error);
    return null;
  }
}