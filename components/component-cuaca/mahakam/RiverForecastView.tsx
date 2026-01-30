"use client";

import React, { useState } from 'react';
import { 
  CloudRain, Sun, Cloud, Wind, Anchor, MapPin, Eye, 
  CloudLightning, Ship, Navigation, Droplets 
} from 'lucide-react';

// --- DATA DUMMY ---
const RIVER_DATA = [
  {
    id: "long-apari", name: "Long Apari", region: "Mahakam Ulu", type: "Hulu",
    temp: 23, weather: "Hujan Petir", windSpeed: 15, windDir: "Barat Laut", visibility: "3 km", humidity: 98
  },
  {
    id: "long-bagun", name: "Long Bagun", region: "Mahakam Ulu", type: "Hulu",
    temp: 24, weather: "Hujan Ringan", windSpeed: 10, windDir: "Barat", visibility: "6 km", humidity: 95
  },
  {
    id: "melak", name: "Melak", region: "Kutai Barat", type: "Tengah",
    temp: 27, weather: "Berawan Tebal", windSpeed: 8, windDir: "Barat Daya", visibility: "8 km", humidity: 85
  },
  {
    id: "kota-bangun", name: "Kota Bangun", region: "Kutai Kartanegara", type: "Tengah",
    temp: 29, weather: "Cerah Berawan", windSpeed: 12, windDir: "Selatan", visibility: "10 km", humidity: 75
  },
  {
    id: "tenggarong", name: "Tenggarong", region: "Kutai Kartanegara", type: "Tengah",
    temp: 31, weather: "Cerah", windSpeed: 10, windDir: "Tenggara", visibility: "> 10 km", humidity: 65
  },
  {
    id: "samarinda", name: "Samarinda Kota", region: "Samarinda", type: "Hilir",
    temp: 33, weather: "Cerah Terik", windSpeed: 5, windDir: "Timur Laut", visibility: "> 10 km", humidity: 60
  },
  {
    id: "muara-jawa", name: "Muara Jawa", region: "Kutai Kartanegara", type: "Muara",
    temp: 30, weather: "Berawan", windSpeed: 20, windDir: "Utara", visibility: "9 km", humidity: 70
  }
];

// --- HELPER ICONS ---
const getWeatherIcon = (weather: string) => {
  const w = weather.toLowerCase();
  if (w.includes("petir")) return <CloudLightning className="w-10 h-10 text-purple-500 drop-shadow-sm" />;
  if (w.includes("hujan")) return <CloudRain className="w-10 h-10 text-blue-500 drop-shadow-sm" />;
  if (w.includes("cerah") || w.includes("terik")) return <Sun className="w-10 h-10 text-orange-400 drop-shadow-sm" />;
  return <Cloud className="w-10 h-10 text-slate-400 drop-shadow-sm" />;
};

const getRegionBadge = (type: string) => {
  switch (type) {
    case "Hulu": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Tengah": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Hilir": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-indigo-100 text-indigo-800 border-indigo-200";
  }
};

export default function RiverForecastView() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans pb-24 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="pt-20 pb-12 px-4 text-center bg-white shadow-sm border-b border-slate-200 relative overflow-hidden">
        {/* Dekorasi Wave Header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Prakiraan Alur Sungai Mahakam
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
            Visualisasi kondisi cuaca maritim dari Hulu ke Hilir untuk navigasi pelayaran yang aman.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16 relative">
        
        {/* --- THE RIVER (Central Connector) --- */}
        {/* Garis Tengah Sungai yang 'mengalir' */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-3 md:w-4 -translate-x-1/2 rounded-full overflow-hidden z-0">
            {/* Gradient Water */}
            <div className="w-full h-full bg-gradient-to-b from-emerald-300 via-cyan-400 to-blue-600 opacity-40 blur-[1px]" />
            {/* Efek Aliran (Opsional CSS Animation) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
        </div>

        <div className="space-y-12 relative z-10">
            {RIVER_DATA.map((node, index) => {
                const isEven = index % 2 === 0;
                const isHovered = hoveredId === node.id;
                
                return (
                    <div 
                        key={node.id}
                        onMouseEnter={() => setHoveredId(node.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`flex flex-col md:flex-row items-center w-full ${
                            isEven ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                    >
                        
                        {/* 1. KARTU KONTEN (Weather Info) */}
                        {/* Di Mobile selalu width full, di Desktop width 50% - gap */}
                        <div className={`w-full md:w-[calc(50%-2rem)] mb-4 md:mb-0 transition-all duration-500 ${
                            isHovered ? "scale-105" : "scale-100"
                        }`}>
                            <div className={`bg-white rounded-3xl p-5 border shadow-sm relative overflow-hidden group ${
                                isHovered ? "border-cyan-300 shadow-xl" : "border-slate-100"
                            }`}>
                                {/* Region Badge */}
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRegionBadge(node.type)}`}>
                                    {node.type}
                                </span>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                                            <MapPin className="w-3 h-3" />
                                            {node.region}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">{node.name}</h3>
                                        <div className="mt-3 flex items-center gap-3">
                                            {getWeatherIcon(node.weather)}
                                            <div>
                                                <div className="font-bold text-slate-700">{node.weather}</div>
                                                <div className="text-xs text-slate-500">{node.temp}°C | RH {node.humidity}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Maritim Data Grid */}
                                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-50 bg-slate-50/50 -mx-5 -mb-5 px-5 pb-5">
                                    <div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                                            <Wind className="w-3 h-3" /> Angin
                                        </div>
                                        <div className="text-sm font-bold text-slate-700">
                                            {node.windSpeed} km/j
                                        </div>
                                        <div className="text-[10px] text-slate-500">{node.windDir}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                                            <Eye className="w-3 h-3" /> Jarak Pandang
                                        </div>
                                        <div className="text-sm font-bold text-slate-700">
                                            {node.visibility}
                                        </div>
                                        <div className="text-[10px] text-slate-500">Visual</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. CENTER NODE (Titik Sungai) */}
                        {/* Mobile: Ada di kiri. Desktop: Ada di tengah absolute */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                            {/* Lingkaran Luar */}
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-4 border-white shadow-md z-20 flex items-center justify-center transition-all duration-300 ${
                                isHovered ? "bg-cyan-500 scale-110" : "bg-white"
                            }`}>
                                {/* Icon Kapal / Anchor di tengah */}
                                {node.type === "Muara" ? (
                                    <Anchor className={`w-4 h-4 md:w-6 md:h-6 ${isHovered ? "text-white" : "text-cyan-600"}`} />
                                ) : (
                                    <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                                        node.type==="Hulu"?"bg-emerald-400": node.type==="Tengah"?"bg-cyan-400":"bg-orange-400"
                                    }`} />
                                )}
                            </div>
                        </div>

                        {/* 3. SPACER (Agar layout zig-zag seimbang) */}
                        <div className="hidden md:block w-[calc(50%-2rem)]"></div>

                        {/* 4. CONNECTOR LINE (Desktop Only - Zig Zag Effect) */}
                        {/* Garis penghubung horizontal tipis dari tengah ke kartu */}
                        <div className={`hidden md:block absolute h-0.5 bg-slate-200 top-1/2 w-8 -z-10 ${
                            isEven ? "left-1/2" : "right-1/2"
                        }`} />

                    </div>
                );
            })}
        </div>

        {/* --- MUARA --- */}
        <div className="mt-12 text-center relative z-10">
            <div className="inline-block p-4 rounded-full bg-white border-4 border-indigo-100 shadow-sm">
                <Ship className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm font-bold text-slate-400 mt-2 tracking-widest uppercase">
                Selat Makassar
            </p>
        </div>

      </div>
    </div>
  );
}