"use client";

import React, { useState } from 'react';
import { 
  CloudRain, Sun, Cloud, CloudLightning, 
  Navigation2, ChevronRight, AlertCircle, 
  Anchor, Waves, Wind, Ship, Mountain
} from 'lucide-react';
import { MahakamLocation } from '@/lib/mahakam-data';

interface RiverFlowProps {
  initialData: MahakamLocation[];
}

// --- HELPER ICONS ---
const WeatherIconDisplay = ({ iconUrl, condition }: { iconUrl?: string, condition: string }) => {
    if (iconUrl) return <img src={iconUrl} alt={condition} className="w-10 h-10 object-contain filter drop-shadow-sm" />;
    const w = condition.toLowerCase();
    if (w.includes('petir')) return <CloudLightning className="w-8 h-8 text-purple-600" />;
    if (w.includes('hujan')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (w.includes('cerah') || w.includes('terik')) return <Sun className="w-8 h-8 text-orange-500" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
};

const getStatus = (weather: string) => {
    const w = weather.toLowerCase();
    if (w.includes('petir') || w.includes('lebat') || w.includes('badai') || w.includes('ekstrem')) return 'Waspada';
    return 'Aman';
};

export default function RiverFlowView({ initialData }: RiverFlowProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  // Gunakan data langsung dari props
  const locations = initialData;

  if (locations.length === 0) return null; // Jangan render jika data kosong

  return (
    // BACKGROUND CONTAINER DENGAN TEMA AIR
    <div className="w-full bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-[2.5rem] border-2 border-blue-100/50 shadow-xl shadow-blue-100/20 p-6 md:p-8 mt-8 relative overflow-hidden">
      
      {/* Aksen Gelombang di Bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-[url('/images/wave-pattern.svg')] bg-repeat-x opacity-20"></div>
      {/* (Catatan: Anda perlu menyiapkan file SVG wave-pattern.svg kecil di folder public/images, atau hapus div ini jika tidak ada) */}
      {/* Alternatif CSS Wave sederhana */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-100 rounded-b-[2.5rem]" style={{clipPath: 'polygon(0 100%, 100% 100%, 100% 60%, 75% 80%, 50% 60%, 25% 80%, 0 60%)'}}></div>


      {/* HEADER MARITIM */}
      <div className="mb-12 flex items-center justify-between relative z-10">
        <div>
            <h3 className="font-extrabold text-2xl text-blue-900 flex items-center gap-3">
                <Ship className="text-blue-600 transform -scale-x-100" size={28} /> 
                Alur Pelayaran Sungai
            </h3>
            <p className="text-blue-600/70 font-medium text-sm mt-1 ml-10">
                Kondisi cuaca real-time dari Hulu ke Hilir
            </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-blue-100/50 px-4 py-2 rounded-full text-blue-700 font-bold text-xs border border-blue-200">
            <Waves size={14}/> Live Monitoring
        </div>
      </div>

      <div className="relative pl-4 md:pl-8 pb-8 z-10">
        
        {/* GARIS ALUR TEBAL (WATER PATH) */}
        <div className="absolute left-[31px] md:left-[47px] top-4 bottom-4 w-4 bg-blue-100/60 rounded-full border border-blue-200/30 backdrop-blur-sm shadow-inner"></div>

        {/* --- HULU MARKER --- */}
        <div className="relative z-10 flex items-center gap-6 mb-10 opacity-70">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <Mountain size={24} />
            </div>
            <div className="text-sm font-extrabold text-slate-400 tracking-widest uppercase">
                Hulu Sungai (Start)
            </div>
        </div>

        {/* --- LOOP DATA LOKASI (THE DECK CARDS) --- */}
        <div className="space-y-8 relative z-10">
            {locations.map((node, index) => {
                const status = getStatus(node.weather);
                const isWarning = status === 'Waspada';
                const isActive = activeNode === node.id;
                const isLast = index === locations.length - 1;

                return (
                    <div 
                        key={node.id} 
                        className="group relative flex items-stretch gap-6 md:gap-8 cursor-pointer"
                        onMouseEnter={() => setActiveNode(node.id)}
                        onMouseLeave={() => setActiveNode(null)}
                    >
                        {/* 1. MARITIME MARKER (Buoy/Anchor Style) */}
                        <div className={`relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full border-[4px] transition-all duration-300 flex items-center justify-center shadow-lg ${
                            isWarning 
                                ? 'bg-amber-500 border-amber-200 ring-4 ring-amber-100' 
                                : isActive 
                                    ? 'bg-blue-600 border-blue-300 ring-4 ring-blue-200 scale-110'
                                    : 'bg-white border-blue-200 group-hover:border-blue-400'
                        }`}>
                            {/* Ikon di dalam marker */}
                            {isWarning ? (
                                <AlertCircle className="text-white" size={24} />
                            ) : (
                                <Anchor className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-600'}`} size={24} />
                            )}

                            {/* Garis konektor kecil ke kartu */}
                            {isActive && <div className="absolute right-[-20px] top-1/2 h-[2px] w-[20px] bg-blue-300 hidden md:block"></div>}
                        </div>

                        {/* 2. KARTU INFORMASI "MENGAPUNG" */}
                        <div className={`flex-1 transition-all duration-300 rounded-[1.5rem] border-2 p-5 md:p-6 flex flex-col justify-between relative overflow-hidden ${
                            isActive 
                                ? 'bg-white border-blue-400 shadow-xl shadow-blue-200/50 translate-x-2' 
                                : 'bg-white/80 border-white shadow-md shadow-blue-100/30 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40'
                        }`}>
                             {/* Watermark Wave di dalam kartu */}
                             <Waves className={`absolute right-0 bottom-0 text-blue-50 transition-all duration-500 ${isActive ? 'opacity-100 scale-125' : 'opacity-30'}`} size={100} />

                            {/* Header Kartu */}
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                                       <Navigation2 size={12}/> {node.regency}
                                    </div>
                                    <h4 className="font-extrabold text-slate-800 text-xl md:text-2xl">{node.name}</h4>
                                </div>
                                <div className="text-right bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100">
                                    <span className="font-mono text-2xl font-black text-blue-700">
                                        {node.temp}°C
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 my-4 relative z-10"></div>

                            {/* Detail Cuaca */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 relative z-10">
                                {/* Kondisi */}
                                <div className="flex items-center gap-3 min-w-[120px]">
                                    <WeatherIconDisplay iconUrl={node.iconUrl} condition={node.weather} />
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400">KONDISI</div>
                                        <span className="text-sm font-bold text-slate-700 capitalize leading-tight">{node.weather}</span>
                                    </div>
                                </div>

                                {/* Angin */}
                                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <Wind size={20} className="text-blue-400" />
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400">ANGIN</div>
                                        <span className="text-sm font-bold text-slate-700">{node.windSpeed} km/j</span>
                                    </div>
                                </div>

                                {/* Warning Badge */}
                                {isWarning && (
                                    <div className="ml-auto bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-200 shadow-sm animate-pulse">
                                        <AlertCircle size={14} />
                                        WASPADA CUACA BURUK
                                    </div>
                                )}
                                
                                {/* Panah */}
                                {!isWarning && (
                                    <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-blue-100 text-blue-600 translate-x-1' : 'bg-slate-50 text-slate-300'}`}>
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* --- HILIR MARKER (END) --- */}
        <div className="relative z-10 flex items-center gap-6 mt-12">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-4 border-blue-200 flex items-center justify-center text-white shadow-lg">
                <Anchor size={28} />
            </div>
            <div>
                <div className="text-sm font-extrabold text-blue-900 tracking-widest uppercase">
                    Muara (Laut Jawa)
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-500 mt-1 bg-blue-100/50 px-2 py-0.5 rounded-md w-fit">
                    <Waves size={12} /> Area Lepas Pantai
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}