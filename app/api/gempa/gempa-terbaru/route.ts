import { NextResponse } from "next/server";
import { getGempaTerbaru } from "@/lib/gempa-bmkg";

export async function GET() {
  const data = await getGempaTerbaru();

  if (!data) {
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
  });
}