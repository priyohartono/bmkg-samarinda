"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HotspotData {
  id: string;
  lat: number;
  lng: number;
  conf: number;
  district: string;
  subDistrict: string;
  satellite: string;
  date: string;
}

// GET (Public)
// lib/data-karhutla.ts

export async function getHotspots() {
  try {
    // 1. Tentukan rentang waktu "24 Jam Terakhir"
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await prisma.hotspot.findMany({
      where: {
        // FILTER: Data valid 24 jam terakhir
        date: {
          gte: oneDayAgo
        }
      },
      orderBy: { date: 'desc' },
    });

    return data.map(h => ({
      id: h.id,
      lat: h.latitude,
      lng: h.longitude,
      conf: h.confidence || 0,
      district: h.district,
      subDistrict: h.subDistrict,
      satellite: h.satellite,
      date: h.date.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Gagal ambil hotspot:", error);
    return [];
  }
}

// BULK INSERT (Admin)
// Menerima string mentah dari Excel/TSV
export async function importHotspots(rawData: string) {
  try {
    // 1. Hapus data lama (Opsional: agar peta selalu fresh hari ini)
    // await prisma.hotspot.deleteMany({}); 

    // 2. Parsing Data
    const rows = rawData.trim().split('\n');
    const validData = [];

    for (const row of rows) {
      // Asumsi format: Long | Lat | Conf | Region | Prov | Kab | Kec | Sat | Date | Time ...
      // Split by Tab (\t) atau Spasi berulang
      const cols = row.split(/\t/);

      if (cols.length < 8) continue; // Skip baris rusak

      const lng = parseFloat(cols[0]); // Longitude biasanya kolom pertama di data Sipongi
      const lat = parseFloat(cols[1]);
      const conf = parseInt(cols[2]) || 0;
      const prov = cols[4];
      const kab = cols[5];
      const kec = cols[6];
      const sat = cols[7];
      const dateStr = cols[8]; // YYYY-MM-DD
      const timeStr = cols[9] || "00:00:00"; // HH:MM:SS

      // Filter hanya Kaltim (jaga-jaga admin copas semua Kalimantan)
      if (prov?.includes("TIMUR") && !isNaN(lat) && !isNaN(lng)) {

        // PENTING: Pakai Offset +07:00 (WIB) agar jamnya akurat di Database
        // Format: YYYY-MM-DDTHH:mm:ss+07:00
        const isoString = `${dateStr}T${timeStr}${timeStr.length === 5 ? ':00' : ''}+07:00`;
        const dateObj = new Date(isoString);

        if (!isNaN(dateObj.getTime())) {
          validData.push({
            latitude: lat,
            longitude: lng,
            confidence: conf,
            province: prov,
            district: kab,
            subDistrict: kec,
            satellite: sat,
            date: dateObj
          });
        }
      }
    }

    if (validData.length === 0) return { success: false, msg: "Tidak ada data valid ditemukan." };

    // 3. Simpan ke Database
    await prisma.hotspot.createMany({
      data: validData
    });

    revalidatePath("/cuaca/karhutla");
    return { success: true, count: validData.length };

  } catch (error) {
    console.error("Import error:", error);
    return { success: false, msg: "Gagal import data." };
  }
}

// DELETE ALL (Reset Data)
export async function clearHotspots() {
  await prisma.hotspot.deleteMany({});
  revalidatePath("/cuaca/karhutla");
  return { success: true };
}



// ... imports existing

// Tambahkan fungsi ini
export async function getHotspotTrend() {
  // 1. Generate 7 hari terakhir
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]); // Format YYYY-MM-DD
  }

  try {
    // 2. Query GroupBy Date (Raw Query atau JS processing)
    // Karena Prisma GroupBy agak tricky dengan DateTime, kita tarik data 7 hari terakhir lalu hitung di JS
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const data = await prisma.hotspot.findMany({
      where: {
        date: { gte: sevenDaysAgo }
      },
      select: { date: true }
    });

    // 3. Mapping count per tanggal
    const stats = dates.map(dateStr => {
      const count = data.filter(d => d.date.toISOString().split('T')[0] === dateStr).length;
      return { date: dateStr, count };
    });

    return stats;
  } catch (error) {
    return dates.map(d => ({ date: d, count: 0 }));
  }
}