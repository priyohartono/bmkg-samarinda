"use client";

import React from 'react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { 
  Wind, MapPin, Droplets, Thermometer, Eye, 
  Navigation, CalendarClock, Compass, Gauge, Ship 
} from 'lucide-react';

interface Props {
  initialData: MahakamLocation[];
}

// --- KOMPONEN SVG GELOMBANG (Pemisah) ---
const WaveSeparator = () => (
  <div className="w-full overflow-hidden leading-[0] opacity-30">
    <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-blue-500"></path>
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-blue-500"></path>
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-blue-50"></path>
    </svg>
  </div>
);

// --- HELPER ARAH MATA ANGIN ---
const getCardinalDirection = (angle: number) => {
    if (angle === undefined) return "-";
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    return directions[Math.round(angle / 45) % 8];
};

const WeatherIconDisplay = ({ iconUrl, condition }: { iconUrl?: string, condition: string }) => {
    if (iconUrl) return <img src={iconUrl} alt={condition} className="w-20 h-20 object-contain drop-shadow-md" />;
    return <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse"></div>;
};

export default function WeatherStationGrid({ initialData }: Props) {
  
  const groupedData = initialData.reduce((acc, curr) => {
    const regency = curr.regency || "Lainnya";
    if (!acc[regency]) acc[regency] = [];
    acc[regency].push(curr);
    return acc;
  }, {} as Record<string, MahakamLocation[]>);

  const sortedRegencies = Object.keys(groupedData).sort();

  return (
    <div className="space-y-16">
      
      {sortedRegencies.map((regency) => (
        <div key={regency} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header Wilayah */}
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200">
                    <Ship size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">
                        {regency}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Monitoring Stasiun Cuaca Perairan
                    </p>
                </div>
                <div className="h-px flex-1 bg-slate-200 ml-4"></div>
            </div>

            {/* Grid Kartu Dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {groupedData[regency].map((loc) => (
                    <div 
                        key={loc.id} 
                        className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                    >
                        
                        {/* --- KOLOM KIRI: PRIMARY STATUS --- */}
                        <div className="p-6 md:w-5/12 bg-gradient-to-b from-blue-50/50 to-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 relative">
                             {/* Background Map Decoration */}
                             <MapPin className="absolute top-2 right-2 text-slate-100 w-24 h-24 -rotate-12 pointer-events-none" />

                             <div>
                                <h4 className="font-extrabold text-slate-800 text-xl leading-tight mb-1 relative z-10">
                                    {loc.name}
                                </h4>
                                <div className="text-[10px] font-mono text-slate-400 bg-white/50 w-fit px-1.5 py-0.5 rounded border border-slate-200">
                                    {loc.lat.toFixed(3)}, {loc.lng.toFixed(3)}
                                </div>
                             </div>

                             <div className="flex flex-col items-center py-4 relative z-10">
                                <WeatherIconDisplay iconUrl={loc.iconUrl} condition={loc.weather} />
                                <div className="flex items-start mt-2">
                                    <span className="text-5xl font-black text-slate-800 tracking-tighter">
                                        {loc.temp}°
                                    </span>
                                </div>
                                <span className="font-bold text-slate-600 text-sm capitalize bg-white/60 px-3 py-1 rounded-full border border-slate-200 shadow-sm mt-2">
                                    {loc.weather}
                                </span>
                             </div>

                             {/* Footer Kiri: Updated Timestamp */}
                             <div className="text-[10px] text-slate-400 text-center font-medium">
                                Data: Realtime API BMKG
                             </div>
                        </div>

                        {/* --- KOLOM KANAN: INSTRUMENT PANEL --- */}
                        <div className="p-5 md:w-7/12 flex flex-col">
                            
                            {/* Grid 4 Instrumen Utama */}
                            <div className="grid grid-cols-2 gap-3 flex-1">
                                
                                {/* 1. ANGIN (Dengan Kompas) */}
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between group">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Angin</span>
                                        <Wind size={14} className="text-teal-500" />
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        {/* Visualisasi Kompas Sederhana */}
                                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 relative flex items-center justify-center bg-white">
                                            <Navigation 
                                                size={14} 
                                                className="text-teal-600 transition-transform duration-700"
                                                style={{ transform: `rotate(${loc.windDeg || 0}deg)` }} 
                                                fill="currentColor"
                                            />
                                            <div className="absolute -top-1 text-[6px] font-bold text-slate-300">U</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-slate-700 leading-none">
                                                {loc.windSpeed} <span className="text-[10px] font-normal text-slate-400">km/j</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-teal-600 mt-0.5">
                                                Arah: {getCardinalDirection(loc.windDeg || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. JARAK PANDANG (Visibility) */}
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Jarak Pandang</span>
                                        <Eye size={14} className="text-purple-500" />
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-lg font-black text-slate-700 leading-none">
                                            {loc.visibility || 10} <span className="text-[10px] font-normal text-slate-400">km</span>
                                        </div>
                                        {/* Visibility Bar */}
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500 rounded-full" 
                                                style={{ width: `${Math.min(((loc.visibility || 0) / 10) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. KELEMBAPAN */}
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Kelembapan</span>
                                        <Droplets size={14} className="text-blue-500" />
                                    </div>
                                    <div className="flex items-end gap-1 mt-2">
                                        <span className="text-xl font-black text-slate-700 leading-none">{loc.humidity}%</span>
                                    </div>
                                    <div className="text-[9px] text-blue-500 font-medium mt-1">Relative Humidity</div>
                                </div>

                                {/* 4. REAL FEEL */}
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Terasa Seperti</span>
                                        <Gauge size={14} className="text-orange-500" />
                                    </div>
                                    <div className="flex items-end gap-1 mt-2">
                                        <span className="text-xl font-black text-slate-700 leading-none">{loc.feelsLike}°</span>
                                    </div>
                                    <div className="text-[9px] text-orange-500 font-medium mt-1">Indeks Panas</div>
                                </div>

                            </div>

                            {/* Divider Gelombang */}
                            <div className="mt-4 -mb-1">
                                <WaveSeparator />
                            </div>

                            {/* Section: Forecast Singkat */}
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <CalendarClock size={12} className="text-blue-500"/>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Prakiraan +3 Jam Kedepan</span>
                                </div>
                                <div className="flex justify-between gap-1">
                                    {loc.forecasts?.slice(0, 3).map((fc, i) => (
                                        <div key={i} className="flex-1 text-center bg-white border border-slate-100 rounded-lg py-1.5 px-1 shadow-sm">
                                            <div className="text-[9px] font-bold text-slate-400 mb-1">{fc.time}</div>
                                            <div className="flex justify-center my-0.5">
                                                 {fc.weatherIcon && <img src={fc.weatherIcon} alt="w" className="w-5 h-5 object-contain"/>}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-700">{fc.temp}°</div>
                                        </div>
                                    ))}
                                    {(!loc.forecasts || loc.forecasts.length === 0) && (
                                        <div className="text-[10px] text-slate-400 italic w-full text-center">Data forecast n/a</div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                ))}
            </div>
        </div>
      ))}
    </div>
  );
}