import { NextResponse } from 'next/server';
import { MAHAKAM_LOCATIONS } from '@/lib/mahakam-data';
import { fetchBMKGData } from '@/lib/weather-service';

export async function GET() {
  try {
    // Kita gunakan Promise.all agar fetch berjalan paralel (lebih cepat)
    // Tidak satu per satu (serial)
    const promises = MAHAKAM_LOCATIONS.map(async (loc) => {
      // Fetch data asli dari BMKG menggunakan helper Anda
      const weatherData = await fetchBMKGData(loc.bmkgId);
      
      // Jika gagal ambil, kembalikan data default/null agar tidak crash
      if (!weatherData) return { ...loc, weather: 'N/A', temp: 0 };

      // Gabungkan data statis (koordinat, nama) dengan data dinamis (suhu, cuaca)
      return {
        ...loc,
        weather: weatherData.condition, // Misal: "Berawan"
        temp: weatherData.temp,         // Misal: 28
        iconUrl: weatherData.subRegions.length > 0 
                    ? weatherData.subRegions[0].icon // Ambil icon dari sub-item pertama jika ada
                    : "", 
        windSpeed: weatherData.windSpeed,
        humidity: weatherData.humidity,
        feelsLike: weatherData.feelsLike
      };
    });

    const results = await Promise.all(promises);

    return NextResponse.json({ 
        success: true, 
        data: results,
        generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching Mahakam weather:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch weather data" }, { status: 500 });
  }
}