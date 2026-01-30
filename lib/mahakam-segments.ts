export type RiverSegment = {
  id: string; // ID Kecamatan dari BMKG (harus dicari dulu ID pastinya)
  name: string;
  region: "Hulu" | "Tengah" | "Hilir";
  description: string;
};

// Urutan dari Hulu (Atas) ke Hilir (Bawah)
export const MAHAKAM_NODES: RiverSegment[] = [
  // --- KAB. MAHAKAM ULU (HULU) ---
  { id: "50133", name: "Long Apari", region: "Hulu", description: "Titik teratas" },
  { id: "50131", name: "Long Bagun", region: "Hulu", description: "Akses utama Mahulu" },
  
  // --- KAB. KUTAI BARAT ---
  { id: "50102", name: "Melak", region: "Hulu", description: "Pelabuhan Melak" },
  
  // --- KAB. KUTAI KARTANEGARA (TENGAH) ---
  { id: "50064", name: "Kota Bangun", region: "Tengah", description: "Danau Semayang/Melintang" },
  { id: "50061", name: "Muara Muntai", region: "Tengah", description: "Jembatan Martadipura" },
  { id: "50071", name: "Sebulu", region: "Tengah", description: "Jalur Logistik" },
  { id: "50067", name: "Tenggarong", region: "Tengah", description: "Jembatan Kutai Kartanegara" },
  
  // --- KOTA SAMARINDA ---
  { id: "50143", name: "Sungai Kunjang", region: "Hilir", description: "Jembatan Mahakam" },
  { id: "50141", name: "Samarinda Seberang", region: "Hilir", description: "Pelabuhan Samarinda" },
  
  // --- MUARA (LAUT) ---
  { id: "50074", name: "Anggana", region: "Hilir", description: "Delta Mahakam" },
  { id: "50079", name: "Muara Jawa", region: "Hilir", description: "Muara Laut" },
];