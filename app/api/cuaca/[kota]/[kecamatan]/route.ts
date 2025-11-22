import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = 'force-dynamic';

interface KelurahanInfo {
  nama: string;
  kode: string;
}

// ==========================================================
// ⬇️ HELPER UNTUK MEMPROSES PROMISE SECARA BERTAHAP (BATCH) ⬇️
// Ini untuk "lebih sopan" ke API BMKG agar tidak memanggil puluhan
// API sekaligus dalam satu milidetik.
// ==========================================================
async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  let results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(`Memproses batch ${i / batchSize + 1} dari ${Math.ceil(items.length / batchSize)}...`);
    
    const batchPromises = batch.map(processor);
    const batchResults = await Promise.all(batchPromises);
    results = results.concat(batchResults);

    // Opsi: Tambahkan jeda kecil antar batch jika diperlukan
    // if (i + batchSize < items.length) {
    //   await new Promise(resolve => setTimeout(resolve, 200)); // jeda 200ms
    // }
  }
  return results;
}

// Tipe untuk hasil data cuaca per kelurahan
type WeatherResult = {
  nama: string;
  prakiraan: any[];
  error?: string;
};

// ✅ Format Next.js Route Handler yang benar
export async function GET(
  request: Request,
  context: { params: Promise<{ kota: string; kecamatan: string }> }
) {
  // HARUS di-await di sini!
  const { kota, kecamatan } = await context.params;

  if (!kota || !kecamatan) {
    return NextResponse.json(
      { error: "Kota dan Kecamatan diperlukan" },
      { status: 400 }
    );
  }

  // === 1. Baca file JSON pemetaan kelurahan ===
  let kotaData;
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "DaftarKelurahan");
    const filePath = path.join(jsonDirectory, `${kota}.json`);
    const fileContents = await fs.readFile(filePath, "utf8");

    if (fileContents.trim() === "") {
      throw new Error(`File JSON kosong: ${kota}.json`);
    }

    kotaData = JSON.parse(fileContents);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.error(`File pemetaan tidak ditemukan: ${kota}.json`);
      return NextResponse.json(
        { error: `File pemetaan tidak ditemukan untuk kota: ${kota}` },
        { status: 404 }
      );
    }
    console.error("Error saat membaca atau parsing JSON:", error);
    return NextResponse.json(
      {
        error:
          "Gagal memproses file pemetaan kelurahan. Pastikan format JSON valid.",
      },
      { status: 500 }
    );
  }

  // === 2. Ambil daftar kelurahan untuk kecamatan terkait ===
  const decodedKecamatan = decodeURIComponent(kecamatan);
  const kelurahanList: KelurahanInfo[] =
    kotaData[decodedKecamatan]?.kelurahan;

  if (!kelurahanList || kelurahanList.length === 0) {
    return NextResponse.json(
      {
        error: `Kecamatan '${decodedKecamatan}' tidak ditemukan di data kota '${kota}'`,
      },
      { status: 404 }
    );
  }

  // === 3. Ambil data cuaca dari API BMKG (Secara Bertahap & di-Cache) ===
  try {
    // Tentukan ukuran batch, misal 5 panggilan sekaligus
    const BATCH_SIZE = 5;

    // Definisikan fungsi prosesor untuk satu kelurahan
    const fetchKelurahanWeather = async (kel: KelurahanInfo): Promise<WeatherResult> => {
      try {
        const res = await fetch(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kel.kode}`,
          // ==========================================================
          // ⬇️ INI PERUBAHAN UTAMA UNTUK CACHING ⬇️
          // Kita cache data dari BMKG selama 1 jam (3600 detik)
          // { cache: "no-store" } // <-- HAPUS INI
          { next: { revalidate: 3600 } } // <-- GANTI DENGAN INI
          // ==========================================================
        );

        if (!res.ok) {
          console.error(
            `Data tidak ditemukan di BMKG untuk ${kel.nama} (Kode: ${kel.kode})`
          );
          return {
            nama: kel.nama,
            prakiraan: [],
            error: `Data tidak tersedia: ${res.status}`,
          };
        }

        const apiResponse = await res.json();
        const flattenedPrakiraan = apiResponse.data[0]?.cuaca.flat() || [];
        return {
          nama: kel.nama,
          prakiraan: flattenedPrakiraan,
        };
      } catch (fetchError) {
        console.error(`Error jaringan saat fetch untuk ${kel.nama}:`, fetchError);
        return {
          nama: kel.nama,
          prakiraan: [],
          error: "Gagal menghubungi server BMKG",
        };
      }
    };

    // Jalankan proses fetch secara bertahap menggunakan helper
    const weatherDataResults = await processInBatches(
      kelurahanList,
      BATCH_SIZE,
      fetchKelurahanWeather
    );
    
    return NextResponse.json({ kelurahan: weatherDataResults });
    
  } catch (error) {
    console.error("API Route Error saat fetch ke BMKG:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari BMKG" },
      { status: 502 }
    );
  }
}