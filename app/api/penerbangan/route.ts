import { NextRequest, NextResponse } from 'next/server';

// URL dasar dari API BMKG
const BASE_URL = 'https://radar.bmkg.go.id/sidarma-nowcast';

/**
 * Tipe data parsial untuk mencocokkan struktur JSON dari BMKG
 * Kita hanya mendefinisikan apa yang kita butuhkan.
 */
interface BmkgData {
  CMAX?: {
    Latest?: {
      file?: string;
    };
  };
  H08EH?: {
    Latest?: {
      file?: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // --- KASUS 1: Mengambil file JSON STATUS ---
    if (type === 'status') {
      const statusUrl = `${BASE_URL}/imageStatus_Balikpapan.json?id=${new Date().getTime()}`;
      
      const response = await fetch(statusUrl, {
        cache: 'no-store', // Selalu ambil data terbaru
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil status dari BMKG: ${response.statusText}`);
      }

      const data: BmkgData = await response.json();

      // --- PERUBAHAN: Ambil DUA file ---
      const radarFile = data?.CMAX?.Latest?.file;
      const satelliteFile = data?.H08EH?.Latest?.file;
      // --- AKHIR PERUBAHAN ---

      if (!radarFile && !satelliteFile) {
        throw new Error('Struktur data JSON tidak valid atau file tidak ditemukan');
      }

      // Kirim kedua nama file ke klien
      return NextResponse.json({ radarFile, satelliteFile });
    }

    // --- KASUS 2: Mengambil file GAMBAR (PNG) ---
    if (type === 'image') {
      const file = searchParams.get('file');
      if (!file) {
        throw new Error('Parameter "file" dibutuhkan');
      }

      // Validasi sederhana untuk keamanan (opsional tapi disarankan)
      if (!file.startsWith('data/raster/')) {
         throw new Error('Path file tidak valid');
      }

      const imageUrl = `${BASE_URL}/${file}`;
      
      const imageResponse = await fetch(imageUrl, {
        cache: 'no-store',
      });

      if (!imageResponse.ok) {
        throw new Error(`Gagal mengambil gambar dari BMKG: ${imageResponse.statusText}`);
      }

      const imageBlob = await imageResponse.blob();
      
      return new NextResponse(imageBlob, {
        headers: {
          'Content-Type': imageResponse.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Jika parameter 'type' tidak valid
    throw new Error('Parameter "type" tidak valid. Gunakan "status" atau "image".');

  } catch (error: any) {
    console.error('Error di BMKG Proxy:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

