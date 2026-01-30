import { Client } from "basic-ftp";

export interface PM25Data {
  time: string; // Jam (contoh: "14")
  pm25: number | null; // Nilai konsentrasi
  fullDate?: string; // Untuk debugging/tooltip
}

// Konfigurasi FTP
const FTP_CONFIG = {
  host: "103.169.3.176",
  user: "databam",
  password: "databam@#98765",
  secure: false,
  port: 21,
};

const FOLDER_PATH = "/SAMARINDA2/WASUploaded";

// Helper: Format angka 2 digit (01, 02...)
const pad = (num: number) => num.toString().padStart(2, "0");

// Helper: Generate Nama File berdasarkan waktu
// Format: BAM MM-DD-YYYY hhmm Samarinda2.csv
const generateFilename = (date: Date) => {
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  // Menit di file selalu "00" (data per jam)
  return `BAM ${mm}-${dd}-${yyyy} ${hh}00 Samarinda2.csv`; 
};

export async function getPM25History(): Promise<{ history: PM25Data[], current: number, lastUpdate: string }> {
  const client = new Client();
  // Set timeout agar tidak hanging jika koneksi lambat
  client.ftp.verbose = true; 

  const historyData: PM25Data[] = [];
  let currentVal = 0;
  let lastUpdateStr = "-";

  try {
    await client.access(FTP_CONFIG);
    
    // Kita ambil data 24 jam terakhir (0 - 23 jam yang lalu)
    const now = new Date();
    
    // Loop dari 23 jam lalu sampai jam sekarang (urutan grafik kiri ke kanan)
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000); // Mundur i jam
      const filename = generateFilename(d);
      const filePath = `${FOLDER_PATH}/${filename}`;
      const hourLabel = pad(d.getHours()); // Label X-Axis "14", "15"

      try {
        // Download file ke Buffer memory
        // Kita gunakan Writable stream tiruan untuk menangkap konten
        const chunks: Buffer[] = [];
        const writable = {
          write: (chunk: Buffer) => chunks.push(chunk),
          end: () => {},
          on: () => {},
          once: () => {},
          emit: () => {},
        } as any;

        await client.downloadTo(writable, filePath);
        
        const fileContent = Buffer.concat(chunks).toString("utf-8");
        
        // --- PARSING CSV MANUAL ---
        // Struktur:
        // Baris 1: Header
        // Baris 2: Units
        // Baris 3: Data -> 01-28-2026,14:00,-1.8,... (Conc ada di index 2)
        
        const lines = fileContent.trim().split("\n");
        if (lines.length >= 3) {
          const dataRow = lines[2].split(","); // Ambil baris ke-3
          if (dataRow.length > 2) {
            let conc = parseFloat(dataRow[2]); // Ambil kolom ke-3 (Conc)

            // Handling nilai negatif (Sensor drift biasanya -1 atau -2 saat udara sangat bersih)
            // Kita anggap 0 agar grafik tidak rusak
            if (conc < 0) conc = 0;

            historyData.push({ time: hourLabel, pm25: conc });
            
            // Jika ini iterasi terakhir (jam sekarang/terbaru), simpan sebagai Current Value
            if (i === 0) {
              currentVal = conc;
              lastUpdateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${hourLabel}:00`;
            }
          } else {
             historyData.push({ time: hourLabel, pm25: null });
          }
        } else {
            historyData.push({ time: hourLabel, pm25: null });
        }

      } catch (err) {
        // Jika file belum ada (misal jam belum masuk) atau error download
        // console.log(`File not found: ${filename}`); 
        historyData.push({ time: hourLabel, pm25: null });
      }
    }

  } catch (error) {
    console.error("FTP Connection Error:", error);
  } finally {
    client.close();
  }

  return {
    history: historyData,
    current: currentVal,
    lastUpdate: lastUpdateStr !== "-" ? lastUpdateStr : "Belum ada data"
  };
}