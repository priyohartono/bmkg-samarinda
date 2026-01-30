import { NextResponse } from 'next/server';
import { Client } from "basic-ftp";

export const dynamic = 'force-dynamic';

const FTP_CONFIG = {
  host: "103.169.3.176",
  user: "databam",
  password: "databam@#98765",
  secure: false,
};

const FOLDER_PATH = "/SAMARINDA2/WASUploaded";

export async function GET() {
  const client = new Client();
  const logs: string[] = []; // Kita tampung semua log di sini

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    logs.push(`[${timestamp}] ${msg}`);
    console.log(`[FTP DEBUG] ${msg}`);
  };

  try {
    addLog("1. Memulai Inisialisasi Client FTP...");
    client.ftp.verbose = true; 
    client.ftp.ipFamily = 4; // Paksa IPv4

    addLog(`2. Mencoba connect ke ${FTP_CONFIG.host}...`);
    await client.access(FTP_CONFIG);
    addLog("✅ BERHASIL LOGIN ke FTP Server!");

    addLog(`3. Mencoba akses folder: ${FOLDER_PATH}`);
    // Cek apakah folder ada & ambil list file
    const fileList = await client.list(FOLDER_PATH);
    addLog(`✅ Folder ditemukan. Total file: ${fileList.length}`);

    // Tampilkan 5 file terakhir untuk validasi nama
    if (fileList.length > 0) {
        addLog("4. Sample 5 File Terakhir di Server:");
        // Sort descending (terbaru diatas) - asumsi modifiedAt ada, kalau tidak ambil raw
        const sortedFiles = fileList.slice(-5); 
        
        sortedFiles.forEach(f => {
            addLog(`   📄 ${f.name} (Size: ${f.size})`);
        });
    } else {
        addLog("⚠️ Folder kosong atau tidak bisa dilist.");
    }

    // Cek Nama File yang kita cari hari ini
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    // Format: BAM MM-DD-YYYY hhmm Samarinda2.csv
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const yyyy = now.getFullYear();
    const hh = pad(now.getHours());
    const targetFile = `BAM ${mm}-${dd}-${yyyy} ${hh}00 Samarinda2.csv`;
    
    addLog(`5. Target file yang dicari script utama saat ini:`);
    addLog(`   🎯 "${targetFile}"`);

    const found = fileList.find(f => f.name === targetFile);
    if (found) {
        addLog("✅ FILE TARGET DITEMUKAN! Script utama seharusnya bisa download.");
    } else {
        addLog("❌ FILE TARGET TIDAK DITEMUKAN. Mungkin belum terupload atau jam server beda.");
    }

    return NextResponse.json({ success: true, logs });

  } catch (error: any) {
    addLog(`❌ ERROR FATAL: ${error.message}`);
    return NextResponse.json({ success: false, logs }, { status: 500 });
  } finally {
    client.close();
    addLog("6. Koneksi ditutup.");
  }
}