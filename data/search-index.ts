// file: data/search-index.ts

// Tipe untuk opsi di react-select
export interface KecamatanOption {
  value: string; // nm_kecamatan
  label: string; // "Nama Kecamatan, Nama Kabupaten"
  kabupaten: string; // nm_dati2
}

// Di sinilah kita akan mendaftarkan semua kecamatan secara manual
export const allKecamatanOptions: KecamatanOption[] = [
  // Contoh dari file: kota-samarinda.json
  { value: "Sambutan", label: "Sambutan, Kota Samarinda", kabupaten: "Kota Samarinda" },
  { value: "Sungai Kunjang", label: "Sungai Kunjang, Kota Samarinda", kabupaten: "Kota Samarinda" },
  { value: "Samarinda Kota", label: "Samarinda Kota, Kota Samarinda", kabupaten: "Kota Samarinda" },
  
  // Contoh dari file: kabupaten-kutai-kartanegara.json
  { value: "Muara Kaman", label: "Muara Kaman, Kabupaten Kutai Kartanegara", kabupaten: "Kabupaten Kutai Kartanegara" },
  { value: "Tenggarong", label: "Tenggarong, Kabupaten Kutai Kartanegara", kabupaten: "Kabupaten Kutai Kartanegara" },
  { value: "Loa Kulu", label: "Loa Kulu, Kabupaten Kutai Kartanegara", kabupaten: "Kabupaten Kutai Kartanegara" },
  
  // ---> Lanjutkan untuk semua kecamatan dari semua file GeoJSON Anda <---
];