"use client";

import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { 
  Wind, MapPin, Droplets, Thermometer, Eye, 
  Navigation, X, CalendarClock
} from 'lucide-react';

interface Props {
  data: MahakamLocation;
  onClose?: () => void;
}

// --- HELPER ICONS (Versi Terang) ---
const WeatherIconDisplay = ({ iconUrl, condition, size = "large" }: { iconUrl?: string, condition: string, size?: "small" | "large" }) => {
    const className = size === "large" 
        ? "w-32 h-32 object-contain drop-shadow-xl" 
        : "w-10 h-10 object-contain";
    
    if (iconUrl) return <img src={iconUrl} alt={condition} className={className} />;
    return <div className={`${size === "large" ? "w-32 h-32" : "w-10 h-10"} bg-slate-200 rounded-full animate-pulse`}></div>;
};

// --- HELPER CARDINAL DIRECTION ---
const getCardinalDirection = (angle: number) => {
    if (angle === undefined) return "-";
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    return directions[Math.round(angle / 45) % 8];
};

export default function SingleStationView({ data, onClose }: Props) {

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-700 font-sans text-slate-800">
      
      {/* Container Utama */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl bg-white min-h-[600px]">
          
          {/* Background Aksen Halus */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          {/* --- HEADER ATAS (Station Info) --- */}
          <div className="relative z-10 p-8 flex items-start justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0">
              <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                      <MapPin size={32} />
                  </div>
                  <div>
                      <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                              {data.name}
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                              LIVE
                          </span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold tracking-wide uppercase">
                          {data.regency} <span className="text-slate-300 mx-2">|</span> <span className="font-mono font-normal opacity-70">STATION ID: {data.bmkgId}</span>
                      </p>
                  </div>
              </div>

              {onClose && (
                  <button 
                    onClick={onClose} 
                    className="p-3 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-slate-200 hover:rotate-90 duration-300 shadow-sm"
                  >
                      <X size={24} />
                  </button>
              )}
          </div>

          {/* --- CONTENT BODY --- */}
          <div className="relative z-10 p-8 space-y-10">
              
              {/* SECTION 1: OVERVIEW & INSTRUMENTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Kiri: Kondisi Utama */}
                  <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-2 pl-4">
                      <div className="flex items-center gap-8">
                          <WeatherIconDisplay iconUrl={data.iconUrl} condition={data.weather} size="large" />
                          <div>
                              <div className="flex items-start">
                                <div className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
                                    {data.temp}
                                </div>
                                <span className="text-3xl font-bold text-slate-400 mt-2">°C</span>
                              </div>
                              <div className="text-xl font-bold text-blue-600 capitalize mt-1 px-4 py-1 bg-blue-50 rounded-full w-fit">
                                  {data.weather}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Kanan: Instrumen Grid */}
                  <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Angin</span>
                              <Wind size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-3xl font-black text-slate-800">{data.windSpeed}</div>
                          <div className="text-xs font-bold text-slate-400">km/jam</div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RH %</span>
                              <Droplets size={18} className="text-teal-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-3xl font-black text-slate-800">{data.humidity}<span className="text-lg align-top">%</span></div>
                          <div className="text-xs font-bold text-slate-400">Lembap</div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jarak</span>
                              <Eye size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-3xl font-black text-slate-800">{data.visibility || 10}</div>
                          <div className="text-xs font-bold text-slate-400">Kilometer</div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terasa</span>
                              <Thermometer size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="text-3xl font-black text-slate-800">{data.feelsLike}°</div>
                          <div className="text-xs font-bold text-slate-400">Celcius</div>
                      </div>
                  </div>
              </div>

              {/* SECTION 2: TABLE FORECAST (Updated Header Design) */}
              <div>
                  {/* Judul dengan Aksen Garis Biru Vertikal (Sesuai Referensi) */}
                  <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h3 className="text-xl font-bold text-slate-900">Prakiraan Per Jam</h3>
                  </div>

                  {/* Container Table */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[600px] bg-white">
                      
                      <div className="overflow-y-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse relative">
                              {/* HEADER TABEL: Abu-abu Muda, Bold, Uppercase */}
                              <thead className="sticky top-0 z-10">
                                  <tr className="bg-slate-50 border-b border-slate-200">
                                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">WAKTU</th>
                                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">KONDISI CUACA</th>
                                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">ANGIN</th>
                                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">SUHU</th>
                                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">RH %</th>
                                  </tr>
                              </thead>
                              
                              <tbody className="divide-y divide-slate-100">
                                  {data.forecasts && data.forecasts.length > 0 ? (
                                      data.forecasts.map((fc, idx) => (
                                          <tr key={idx} className="hover:bg-blue-50/40 transition-colors group">
                                              {/* WAKTU */}
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex flex-col">
                                                      <span className="text-sm font-black text-slate-800 font-mono">{fc.time}</span>
                                                      <span className="text-[10px] text-slate-400">2026-02-03</span>
                                                  </div>
                                              </td>

                                              {/* KONDISI */}
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center gap-3">
                                                      <WeatherIconDisplay iconUrl={fc.weatherIcon} condition={fc.condition} size="small" />
                                                      <span className="text-sm font-semibold text-slate-700 capitalize">
                                                          {fc.condition}
                                                      </span>
                                                  </div>
                                              </td>

                                              {/* ANGIN */}
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                  <div className="flex items-center gap-3">
                                                      <div 
                                                        className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center"
                                                        title={`Arah: ${fc.windDeg}°`}
                                                      >
                                                          <Navigation 
                                                            size={14} 
                                                            className="text-blue-600 transition-transform duration-500"
                                                            style={{ transform: `rotate(${fc.windDeg || 0}deg)` }} 
                                                            fill="currentColor"
                                                          />
                                                      </div>
                                                      <div>
                                                          <div className="text-xs font-bold text-slate-800">{getCardinalDirection(fc.windDeg || 0)}</div>
                                                          <div className="text-[10px] text-slate-400">{fc.windSpeed} km/j</div>
                                                      </div>
                                                  </div>
                                              </td>

                                              {/* SUHU */}
                                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                                  <span className="text-lg font-black text-slate-800 block">{fc.temp}°</span>
                                                  <span className="text-[10px] font-medium text-slate-400">Terasa {fc.temp + 2}°</span>
                                              </td>

                                              {/* RH% */}
                                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-blue-600 text-xs font-bold shadow-sm group-hover:border-blue-200">
                                                    <Droplets size={10} />
                                                    {data.humidity}% 
                                                 </span>
                                              </td>
                                          </tr>
                                      ))
                                  ) : (
                                      <tr>
                                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/30">
                                              Data prakiraan per jam tidak tersedia saat ini.
                                          </td>
                                  </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}