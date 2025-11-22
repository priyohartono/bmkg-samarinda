// Lokasi: components/prakiraan-maritim/KartuCuacaPelabuhan.tsx
"use client";

import { useEffect, useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { Waves, Wind, Eye, Thermometer, AlertTriangle } from "lucide-react";

interface KartuPelabuhanProps {
  id: string;
  nama: string;
}

interface PrakiraanPelabuhan {
  valid_from: string;
  weather: string;
  weather_desc: string;
  wind_from: string;
  wind_to: string;
  wind_speed_min: number;
  wind_speed_max: number;
  wave_desc: string;
  wave_cat: string;
  visibility: number;
  temp_min: number;
  temp_max: number;
  warning_desc: string;
}

interface PelabuhanAPIResponse {
  name: string;
  latitude: number;
  longitude: number;
  data: PrakiraanPelabuhan[];
}

const formatTime = (utcTime: string): string => {
  return new Date(utcTime)
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Makassar",
      hour12: false,
    })
    .replace(/\./g, ":");
};

export default function KartuCuacaPelabuhan({ id, nama }: KartuPelabuhanProps) {
  const [data, setData] = useState<PrakiraanPelabuhan[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // 🔁 Fetch Data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/pelabuhan/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Gagal memuat data.");

        const result: PelabuhanAPIResponse = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // 🟦 Efek highlight saat di-scroll dari peta
  useEffect(() => {
    const elementId = `card-pelabuhan-${nama
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[,]/g, "")}`;
    const el = document.getElementById(elementId);
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (el.classList.contains("ring-2")) {
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 1500);
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [nama]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto text-center p-4 bg-gray-50 text-gray-500 rounded-lg">
        Memuat data untuk {nama}...
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="w-full mx-auto text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg shadow">
        Data untuk {nama} tidak tersedia atau gagal dimuat.
      </div>
    );
  }

  const selectedData = data[selectedIndex];

  return (
    <div
  id={`card-pelabuhan-${nama
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[,]/g, "")}`}
  className={`w-full mx-auto bg-white border border-gray-100 rounded-2xl shadow-md p-6 md:p-8 scroll-mt-24 transition-all duration-500 ${
    isHighlighted ? "ring-2 ring-blue-400" : ""
  }`}
>

      <h3 className="font-bold text-xl leading-tight mb-1">{nama}</h3>

      {/* Pilihan Waktu (Tab) */}
      <div className="flex space-x-1 mb-4 border-b border-gray-300/60 overflow-x-auto">
        {data.map((p, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors duration-200 -mb-px ${
              selectedIndex === index
                ? "border-b-2 border-blue-600 text-blue-700"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            {formatTime(p.valid_from)}
          </button>
        ))}
      </div>

      {/* Konten Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Kolom Kiri: Ikon dan Cuaca */}
        <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
          <WeatherIcon condition={selectedData.weather} className="w-24 h-24" />
          <p className="font-bold text-xl mt-2">{selectedData.weather}</p>
        </div>

        {/* Kolom Kanan: Detail Data */}
        <div className="md:col-span-2 space-y-4">
          <div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
              <Thermometer className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Suhu</p>
                <p className="text-base font-bold">
                  {selectedData.temp_min}° - {selectedData.temp_max}°C
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
              <Waves className="w-8 h-8 text-cyan-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Gelombang</p>
                <p className="text-base font-bold">{selectedData.wave_desc}</p>
                <p className="text-xs text-gray-500">({selectedData.wave_cat})</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
              <Wind className="w-8 h-8 text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Angin</p>
                <p className="text-base font-bold">
                  {selectedData.wind_speed_min}-{selectedData.wind_speed_max} knot
                </p>
                <p className="text-xs text-gray-500">{selectedData.wind_from}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
              <Eye className="w-8 h-8 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Jarak Pandang</p>
                <p className="text-base font-bold">{selectedData.visibility} km</p>
              </div>
            </div>
          </div>            
        </div>

          {selectedData.warning_desc && selectedData.warning_desc !== "NIL" && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-300/50 text-red-800 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Peringatan</p>
                <p className="text-xs">{selectedData.warning_desc}</p>
              </div>
            </div>
          )}
          <div className="text-sm text-gray-600 bg-gray-100/80 p-3 rounded-md mt-4">
              {selectedData.weather_desc}
            </div>
        </div>
      </div>

      
    </div>
  );
}
