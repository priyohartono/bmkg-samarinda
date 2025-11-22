// File: lib/daftar_wilayah.ts

export interface WilayahMaritim {
  nama: string;
  id: string; // Untuk API
  cardId: string; // ✅ ID bersih untuk DOM
}

export const daftarWilayah: WilayahMaritim[] = [
  { 
    nama: "Perairan Samarinda - Bontang", 
    id: "M.06_Perairan%20Samarinda%20-%20Bontang",
    cardId: "card-perairan-samarinda-bontang", 
  },
  { 
    nama: "Perairan Balikpapan", 
    id: "M.03_Perairan%20Balikpapan",
    cardId: "card-perairan-balikpapan",
  },
  {
    nama: "Selat Makassar bagian utara",
    id: "M.07_Selat%20Makassar%20bagian%20utara",
    cardId: "card-selat-makassar-utara",
  },
  {
    nama: "Perairan Kota Baru bagian timur",
    id: "M.02_Perairan%20Kota%20Baru%20bagian%20timur",
    cardId: "card-perairan-kota-baru-timur",
  },
  {
    nama: "Selat Makassar bagian tengah",
    id: "M.04_Selat%20Makassar%20bagian%20tengah",
    cardId: "card-selat-makassar-tengah",
  },
  {
    nama: "Perairan Kalimantan Utara",
    id: "M.09_Perairan%20Kalimantan%20Utara",
    cardId: "card-perairan-kalimantan-utara",
  },
  {
    nama: "Perairan barat Sulawesi Tengah",
    id: "M.08_Perairan%20barat%20Sulawesi%20Tengah",
    cardId: "card-perairan-barat-sulawesi-tengah",
  },
  {
    nama: "Perairan Sulawesi Barat",
    id: "M.05_Perairan%20Sulawesi%20Barat",
    cardId: "card-perairan-sulawesi-barat",
  },
  {
    nama: "Perairan Kota Baru bagian barat",
    id: "M.01_Perairan%20Kota%20Baru%20bagian%20barat",
    cardId: "card-perairan-kota-baru-barat",
  },
  {
    nama: "Selat Makassar bagian selatan",
    id: "L.01_Selat%20Makassar%20bagian%20selatan",
    cardId: "card-selat-makassar-selatan",
  },
  {
    nama: "Perairan Pare - pare",
    id: "L.02_Perairan%20Pare%20-%20pare",
    cardId: "card-perairan-pare-pare",
  },
];