import { NextRequest, NextResponse } from 'next/server';

// !!! PENTING: GANTI DENGAN URL API GEOJSON YANG SEBENARNYA !!!
// URL ini hanya placeholder.
// --- PERUBAHAN: Ganti URL placeholder dengan URL asli ---
const SIGWX_API_URL = 'https://inasiam.bmkg.go.id/api/toolbox/sigwxmed/';
// --- AKHIR PERUBAHAN ---

/**
 * Proxy ini mengambil data GeoJSON SIGWX Chart dari BMKG.
 */
export async function GET(request: NextRequest) {
  try {
    // Buat URL baru untuk menambahkan parameter cache-busting
    const url = new URL(SIGWX_API_URL);
    url.searchParams.append('_', new Date().getTime().toString());

    const response = await fetch(url.toString(), {
      cache: 'no-store', // Selalu ambil data terbaru
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data SIGWX dari BMKG: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error di SIGWX Proxy:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


