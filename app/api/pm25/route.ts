import { NextResponse } from 'next/server';
import { getCachedData, updateDataFromFTP } from '@/lib/pm25-service';

// Batas umur data (misal: 30 menit)
const REVALIDATE_TIME = 30 * 60 * 1000; 

export async function GET() {
  try {
    // 1. Ambil data dari file lokal (Cepat!)
    let cachedData = await getCachedData();
    const now = Date.now();

    // 2. Jika file tidak ada sama sekali (Pertama kali deploy)
    if (!cachedData) {
      console.log("⚠️ Cache kosong, melakukan fetch awal (User menunggu)...");
      cachedData = await updateDataFromFTP();
      
      if (!cachedData) {
        return NextResponse.json({ success: false, error: "Gagal mengambil data awal" }, { status: 500 });
      }
      return NextResponse.json({ success: true, ...cachedData });
    }

    // 3. Konsep STALE-WHILE-REVALIDATE
    // Cek umur data
    const dataAge = now - cachedData.timestamp;
    
    if (dataAge > REVALIDATE_TIME) {
      console.log(`⏱️ Data kadaluarsa (${Math.floor(dataAge/1000)}s). Trigger update di background...`);
      
      // PENTING: Jangan pakai 'await'. Biarkan dia jalan sendiri tanpa menahan respon user.
      updateDataFromFTP().catch(err => console.error("Background update failed", err));
    } else {
      console.log("🚀 Menggunakan data cache (Fresh)");
    }

    // 4. Langsung kembalikan data (Entah itu fresh atau agak lama dikit, user taunya cepat)
    return NextResponse.json({ 
      success: true, 
      ...cachedData 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}