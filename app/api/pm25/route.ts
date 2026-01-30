import { NextResponse } from 'next/server';
import { Client } from "basic-ftp";
import { Writable } from 'stream';

// --- 1. HELPER: MEMORY STREAM ---
class MemoryWritable extends Writable {
  chunks: Buffer[] = [];
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.chunks.push(chunk);
    callback();
  }
  getContent() {
    return Buffer.concat(this.chunks).toString('utf-8');
  }
}

export const dynamic = 'force-dynamic';

const FTP_CONFIG = {
  host: "103.169.3.176",
  user: "databam",
  password: "databam@#98765",
  secure: false,
};

const FOLDER_PATH = "/SAMARINDA2/WASUploaded";

// --- 2. HELPER: TIMEZONE WITA ---
const getWitaDate = (hoursAgo: number = 0) => {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const witaOffset = 8 * 60 * 60 * 1000;
  const currentWitaMs = utcMs + witaOffset;
  const targetMs = currentWitaMs - (hoursAgo * 60 * 60 * 1000);
  return new Date(targetMs);
};

const pad = (num: number) => num.toString().padStart(2, "0");

const generateFilename = (witaDate: Date) => {
  const mm = pad(witaDate.getUTCMonth() + 1);
  const dd = pad(witaDate.getUTCDate());
  const yyyy = witaDate.getUTCFullYear();
  const hh = pad(witaDate.getUTCHours());
  return `BAM ${mm}-${dd}-${yyyy} ${hh}00 Samarinda2.csv`; 
};

export async function GET() {
  const client = new Client();
  client.ftp.verbose = false; 
  client.ftp.ipFamily = 4;

  const historyData = [];
  let currentVal = 0;
  let lastUpdateStr = "-";
  
  // Tracker data valid terakhir
  let latestValidPM25: number | null = null; // Ubah ke null dulu
  let latestValidTime = "-";

  try {
    await client.access(FTP_CONFIG);
    await client.cd(FOLDER_PATH);

    // Loop 24 Jam terakhir
    for (let i = 23; i >= 0; i--) {
      const d = getWitaDate(i);
      const filename = generateFilename(d);
      const hourLabel = pad(d.getUTCHours()); 

      try {
        // Timeout Download 2 Detik
        const downloadPromise = new Promise<string>(async (resolve, reject) => {
           const memStream = new MemoryWritable();
           try {
             await client.downloadTo(memStream, filename);
             resolve(memStream.getContent());
           } catch (err) {
             reject(err);
           }
        });

        const timeoutPromise = new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 2000)
        );

        const fileContent = await Promise.race([downloadPromise, timeoutPromise]);

        // Parsing CSV
        const lines = fileContent.trim().split("\n");
        if (lines.length >= 3) {
          const dataRow = lines[lines.length - 1].split(",");
          
          if (dataRow.length > 2) {
            let conc = parseFloat(dataRow[2]); 
            
            if (isNaN(conc)) {
                historyData.push({ time: hourLabel, pm25: null });
            } else {
                // UPDATE: Logika "Force to 0" DIHAPUS. 
                // Nilai minus akan tetap dimasukkan apa adanya.
                // if (conc < 0) conc = 0; <--- DIHAPUS
                
                historyData.push({ time: hourLabel, pm25: conc });

                // Simpan data valid terakhir
                latestValidPM25 = conc;
                latestValidTime = `${pad(d.getUTCDate())}/${pad(d.getUTCMonth()+1)} ${hourLabel}:00`;
            }
          } else {
            historyData.push({ time: hourLabel, pm25: null });
          }
        } else {
            historyData.push({ time: hourLabel, pm25: null });
        }

      } catch (err) {
        historyData.push({ time: hourLabel, pm25: null });
      }
    }

    // Set Current Value
    if (latestValidPM25 !== null) {
        currentVal = latestValidPM25;
        lastUpdateStr = latestValidTime;
    }

    return NextResponse.json({
      success: true,
      history: historyData,
      current: currentVal,
      lastUpdate: lastUpdateStr !== "-" ? lastUpdateStr : "Menunggu data..."
    });

  } catch (error: any) {
    console.error("FTP Proxy Error:", error);
    return NextResponse.json({
      success: false,
      error: "Gagal terhubung ke server data",
      history: [],
      current: 0,
      lastUpdate: "-"
    }, { status: 500 });

  } finally {
    if (!client.closed) client.close();
  }
}