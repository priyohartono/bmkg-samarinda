// app/api/peringatan/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const BASE = "https://nowcasting.bmkg.go.id/infografis";
const CACHE_FILE = path.join(process.cwd(), "data", "peringatan-cache.json");

async function tryHead(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// format helper
function formatDate(d: Date) {
  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return { yyyy, mm, dd, full: `${yyyy}-${mm}-${dd}` };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kode = (url.searchParams.get("kode") || "CKT").toUpperCase();
  const tanggalParam = url.searchParams.get("tanggal");

  async function writeCache(obj: any) {
    try {
      await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
      await fs.writeFile(CACHE_FILE, JSON.stringify(obj, null, 2), "utf8");
    } catch {}
  }

  try {
    let result;

    // jika tanggal spesifik diminta
    if (tanggalParam) {
      const [yyyy, mm, dd] = tanggalParam.split("-");
      const img = `${BASE}/${kode}/${yyyy}/${mm}/${dd}/infografis.jpg`;
      const text = `${BASE}/${kode}/${yyyy}/${mm}/${dd}/infografis_text.jpg`;
      if (!(await tryHead(img))) throw new Error("File tidak ada untuk tanggal itu");
      result = { img, text, updated: tanggalParam, fromCache: false };
      await writeCache(result);
      return NextResponse.json(result);
    }

    // auto: cek mulai dari hari ini mundur sampai 7 hari
    let found = null;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const { yyyy, mm, dd, full } = formatDate(d);
      const img = `${BASE}/${kode}/${yyyy}/${mm}/${dd}/infografis.jpg`;
      const text = `${BASE}/${kode}/${yyyy}/${mm}/${dd}/infografis_text.jpg`;
      if (await tryHead(img)) {
        found = { img, text, updated: full, fromCache: false };
        break;
      }
    }
    if (!found) throw new Error("Tidak ada infografis dalam 7 hari terakhir");

    await writeCache(found);
    return NextResponse.json(found);
  } catch (err: any) {
    console.error("BMKG fetch error:", err?.message ?? err);
    // fallback ke cache
    try {
      const raw = await fs.readFile(CACHE_FILE, "utf8");
      const cached = JSON.parse(raw);
      cached.fromCache = true;
      return NextResponse.json(cached);
    } catch {
      return NextResponse.json(
        { error: "Tidak dapat memuat peringatan dini", details: String(err) },
        { status: 500 }
      );
    }
  }
}
