import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
    );

    if (!res.ok) {
      throw new Error("Gagal fetch data BMKG");
    }

    const data = await res.json();
    const gempa = data.Infogempa.gempa;

    // tambahkan URL gambar biar langsung siap dipakai
    const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;

    return NextResponse.json({
      ...data,
      Infogempa: {
        gempa: {
          ...gempa,
          ShakemapUrl: shakemapUrl,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: (error as Error).message },
      { status: 500 }
    );
  }
}
