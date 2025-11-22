// File: app/api/maritim/[wilayah]/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: any) {
  try {
    // ✅ Perbaikan utama: ambil params di dalam fungsi, bukan di parameter langsung
    const params = await context.params;
    const wilayah = params?.wilayah;

    if (!wilayah) {
      return NextResponse.json(
        { error: "Parameter wilayah tidak ditemukan." },
        { status: 400 }
      );
    }

    // ✅ Gunakan nama file JSON dari BMKG
    const url = `https://peta-maritim.bmkg.go.id/public_api/perairan/${wilayah}.json`;

    console.log("Mencoba fetch ke URL BMKG:", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // cache 1 jam
    });

    if (!response.ok) {
      throw new Error(`BMKG API returned status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData || !Array.isArray(jsonData.data) || jsonData.data.length === 0) {
      throw new Error("Format data API tidak valid atau array 'data' kosong.");
    }

    return NextResponse.json(jsonData.data);
  } catch (error: any) {
    console.error("Error di API Route Maritim:", error.message);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server: " + error.message },
      { status: 500 }
    );
  }
}
