import { ReactNode } from "react";

export interface MahakamLocation {
  windSpeed: ReactNode;
  feelsLike: ReactNode;
  id: string;
  bmkgId: string; // <-- Properti Baru: ID Kode Wilayah BMKG
  name: string;
  regency: string;
  lat: number;
  lng: number;
  type: 'hulu' | 'tengah' | 'hilir' | 'muara';
  desc: string;
  weather: string;
  temp: number;
  iconUrl?: string; // URL Icon dari BMKG
  windDeg?: number; // <-- TAMBAHAN: Arah angin dalam derajat (0-360)
  humidity?: number;
  visibility?: number; // <-- TAMBAHAN: Jarak pandang (km)
  forecasts?: {
    time: string;
    temp: number;
    weatherIcon: string;
    condition: string;
    windSpeed: number;
    windDeg: number;
  }[];
}

export const MAHAKAM_LOCATIONS: MahakamLocation[] = [
  // --- MAHAKAM ULU (HULU) ---
  {
    id: '1', bmkgId: '64.11.01', name: 'Long Apari', regency: 'Mahakam Ulu',
    lat: 1.13, lng: 114.18, type: 'hulu',
    desc: 'Hulu Sungai Mahakam (pusat kecamatan)',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '2', bmkgId: '64.11.02', name: 'Long Pahangai', regency: 'Mahakam Ulu',
    lat: 1.15, lng: 114.62, type: 'hulu',
    desc: 'Wilayah di antara Long Apari & Long Bagun',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '3', bmkgId: '64.11.03', name: 'Long Bagun', regency: 'Mahakam Ulu',
    lat: 1.10, lng: 115.10, type: 'hulu',
    desc: 'Titik alur utama sebelum masuk dataran rendah',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '4', bmkgId: '64.11.04', name: 'Long Hubung', regency: 'Mahakam Ulu',
    lat: 0.50, lng: 115.35, type: 'hulu',
    desc: 'Kawasan transisi hulu ke tengah',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '5', bmkgId: '64.11.05', name: 'Laham', regency: 'Mahakam Ulu',
    lat: 0.30, lng: 115.30, type: 'hulu',
    desc: 'Perkiraan pusat administrasi Laham',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },

  // --- KUTAI BARAT (TENGAH) ---
  {
    id: '6', bmkgId: '64.07.05', name: 'Long Iram', regency: 'Kutai Barat',
    lat: 0.80, lng: 115.75, type: 'tengah',
    desc: 'Alur sungai di perbatasan Mahulu–Kubar',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '7', bmkgId: '64.07.07', name: 'Melak', regency: 'Kutai Barat',
    lat: -0.24, lng: 115.82, type: 'tengah',
    desc: 'Pusat aktivitas sungai bagian tengah Kubar',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '8', bmkgId: '64.07.09', name: 'Muara Pahu', regency: 'Kutai Barat',
    lat: -0.33, lng: 116.06, type: 'tengah',
    desc: 'Pertemuan anak sungai sebelum masuk Kukar',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },

  // --- KUTAI KARTANEGARA (TENGAH - HILIR) ---
  {
    id: '9', bmkgId: '64.02.04', name: 'Muara Kaman', regency: 'Kutai Kartanegara',
    lat: -0.17, lng: 116.80, type: 'tengah',
    desc: 'Kawasan bersejarah (Mulawarman) di tepi sungai',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '10', bmkgId: '64.02.06', name: 'Kota Bangun', regency: 'Kutai Kartanegara',
    lat: -0.35, lng: 116.60, type: 'tengah',
    desc: 'Kawasan danau dan sungai utama',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '11', bmkgId: '64.02.10', name: 'Tenggarong', regency: 'Kutai Kartanegara',
    lat: -0.35, lng: 116.92, type: 'hilir',
    desc: 'Ibu kota Kabupaten, lalu lintas sungai padat',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },

  // --- SAMARINDA (HILIR) ---
  // Gunakan Kode Kecamatan
  {
    id: '12', bmkgId: '64.72.04', name: 'Loa Janan Ilir', regency: 'Samarinda',
    lat: -0.70, lng: 117.00, type: 'hilir',
    desc: 'Pintu masuk sungai ke Kota Samarinda',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '13', bmkgId: '64.72.02', name: 'Samarinda Seberang', regency: 'Samarinda',
    lat: -0.55, lng: 117.15, type: 'hilir',
    desc: 'Kawasan bersejarah di seberang kota',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '14', bmkgId: '64.72.05', name: 'Sungai Kunjang', regency: 'Samarinda',
    lat: -0.50, lng: 117.15, type: 'hilir',
    desc: 'Pusat aktivitas pelabuhan dan perdagangan',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '15', bmkgId: '64.72.01', name: 'Palaran', regency: 'Samarinda',
    lat: -0.45, lng: 117.15, type: 'hilir',
    desc: 'Wilayah hilir Samarinda dekat pelabuhan peti kemas',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },

  // --- MUARA & DELTA (PESISIR) ---
  {
    id: '16', bmkgId: '64.02.16', name: 'Anggana', regency: 'Kutai Kartanegara',
    lat: -0.55, lng: 117.30, type: 'muara',
    desc: 'Awal kawasan Delta Mahakam',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '17', bmkgId: '64.02.17', name: 'Sanga-Sanga', regency: 'Kutai Kartanegara',
    lat: -0.70, lng: 117.20, type: 'muara',
    desc: 'Cabang delta dan alur pasang surut',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
  {
    id: '18', bmkgId: '64.02.11', name: 'Muara Jawa', regency: 'Kutai Kartanegara',
    lat: -0.80, lng: 117.25, type: 'muara',
    desc: 'Titik akhir Delta Mahakam menuju Laut Makassar',
    weather: '...', temp: 0,
    feelsLike: undefined,
    windSpeed: undefined
  },
];