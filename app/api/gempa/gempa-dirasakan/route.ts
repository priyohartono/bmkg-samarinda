import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Gagal mengambil data dari BMKG: ${res.statusText}`);
    }

    const data = await res.json();

    // Buat pemetaan dari nama bulan 3 huruf ke nomor bulan
    const monthMap: { [key: string]: string } = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
      Jul: "07", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
    };

    const gempas = data.Infogempa.gempa.map((g: any) => {
      // --- FIX UTAMA: Buat nama file langsung dari string Tanggal dan Jam ---
      try {
        const [tgl, blnStr, thn] = g.Tanggal.split(" ");
        const bln = monthMap[blnStr];

        // Jika bulan tidak ditemukan di peta, kembali ke metode DateTime sebagai cadangan
        if (!bln) {
          throw new Error(`Bulan tidak dikenal: ${blnStr}`);
        }
        
        // Ambil bagian waktu dan hapus titik dua
        const jamStr = g.Jam.split(" ")[0].replace(/:/g, "");

        const fileName = `${thn}${bln}${tgl}${jamStr}.mmi.jpg`;
        const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${fileName}`;

        return {
          ...g,
          ShakemapUrl: shakemapUrl,
        };
      } catch (e) {
        // Jika terjadi error saat mem-parsing string, gunakan metode Date UTC sebagai fallback
        console.error("Gagal mem-parsing Tanggal/Jam, kembali ke DateTime:", e);
        const date = new Date(g.DateTime);
        if (isNaN(date.getTime())) {
          return { ...g, ShakemapUrl: null };
        }
        const pad = (n: number) => n.toString().padStart(2, "0");
        const fileName =
          date.getUTCFullYear().toString() +
          pad(date.getUTCMonth() + 1) +
          pad(date.getUTCDate()) +
          pad(date.getUTCHours()) +
          pad(date.getUTCMinutes()) +
          pad(date.getUTCSeconds()) +
          ".mmi.jpg";
        const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${fileName}`;
        return { ...g, ShakemapUrl: shakemapUrl };
      }
    });

    return NextResponse.json({ gempas });

  } catch (error) {
    console.error("Terjadi error di GET /api/gempa:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

