"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Thermometer, Droplets, Wind, Sun, Gauge, 
  RefreshCw, Navigation
} from "lucide-react";

// --- TIPE DATA ---
interface AwsDetailData {
  temp: number;
  humidity: number;
  pressure: number;
  rainRate: number; 
  rainDaily: number; 
  windSpeed: number;
  windDir: number; 
  solarRad: number;
  uvIndex: number;
  dewPoint: number;
  heatIndex: number;
  lastUpdate: string;
  isOnline: boolean;
}

// --- HELPER ---
const getCardinalDirection = (deg: number) => {
  const directions = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
};

export default function AwsDetailPage() {
  const [data, setData] = useState<AwsDetailData | null>(null);

  useEffect(() => {
    setData({
      temp: 29.2,
      humidity: 78,
      pressure: 1012.4,
      rainRate: 0.0,
      rainDaily: 12.5,
      windSpeed: 12.5,
      windDir: 270, 
      solarRad: 850,
      uvIndex: 8,
      dewPoint: 24,
      heatIndex: 33,
      lastUpdate: "09:30 WITA",
      isOnline: true
    });
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium text-sm">Memuat Data...</div>;

  return (
    <main className="min-h-screen bg-gray-50/50 pb-12 text-slate-800 font-sans">
      
      {/* 1. COMPACT HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-500 transition">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <div>
                <h1 className="text-base font-bold text-slate-800 leading-none">AWS Samarinda</h1>
                <div className="flex items-center gap-1.5 mt-1">
                   <span className={`w-2 h-2 rounded-full ${data.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <span className="text-xs text-slate-500 font-medium">Stasiun Temindung • Live</span>
                </div>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Update Terakhir</span>
             <p className="text-sm font-mono font-bold text-slate-700">{data.lastUpdate}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* CARD 1: TEMPERATUR & KELEMBABAN (Gabungan Compact) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-[320px]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Thermometer className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Udara</span>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-baseline">
                        <span className="text-7xl font-bold text-slate-800 tracking-tighter">{data.temp}°</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 font-medium">Suhu Udara Aktual</p>
                </div>

                {/* Sub-Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center items-center text-center">
                        <Droplets className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-sm font-bold text-slate-700">{data.humidity}%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">RH</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center items-center text-center">
                        <Thermometer className="w-4 h-4 text-orange-500 mb-1" />
                        <span className="text-sm font-bold text-slate-700">{data.heatIndex}°</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Feels</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center items-center text-center">
                        <Droplets className="w-4 h-4 text-cyan-500 mb-1" />
                        <span className="text-sm font-bold text-slate-700">{data.dewPoint}°</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Dew</span>
                    </div>
                </div>
            </div>

            {/* CARD 2: ANGIN (Modern Compass) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[320px]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Wind className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Angin</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                        {data.windSpeed} <span className="text-xs text-slate-400 font-normal">km/j</span>
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Kompas */}
                    <div className="relative w-40 h-40">
                        {/* Lingkaran Background */}
                        <div className="absolute inset-0 rounded-full border border-slate-100 bg-slate-50/50"></div>
                        
                        {/* Ticks */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                            <div key={deg} className="absolute inset-0 flex justify-center p-1.5" style={{ transform: `rotate(${deg}deg)` }}>
                                <div className={`w-0.5 rounded-full bg-slate-300 ${deg % 90 === 0 ? 'h-3' : 'h-1.5'}`}></div>
                            </div>
                        ))}

                        {/* Labels */}
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">U</span>
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">S</span>
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">B</span>
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">T</span>

                        {/* JARUM (Needle) */}
                        <div 
                            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
                            style={{ transform: `rotate(${data.windDir}deg)` }}
                        >
                            <div className="relative h-full w-full flex items-center justify-center">
                                {/* Kepala Jarum */}
                                <div className="absolute top-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[40px] border-b-indigo-600 drop-shadow-sm"></div>
                                {/* Ekor Jarum */}
                                <div className="absolute bottom-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[40px] border-t-indigo-200"></div>
                                {/* Center Dot */}
                                <div className="absolute w-3 h-3 bg-white border-2 border-slate-200 rounded-full shadow-sm z-10"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <span className="text-xl font-bold text-slate-800 block">{getCardinalDirection(data.windDir)}</span>
                        <span className="text-xs font-medium text-slate-400">{data.windDir}°</span>
                    </div>
                </div>
            </div>

            {/* CARD 3: PARAMETER LAIN (Vertical Stack) */}
            <div className="flex flex-col gap-4 h-[320px]">
                
                {/* 1. Hujan */}
                <div className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                                <Droplets className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hujan</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{data.rainRate} <span className="text-xs font-normal text-slate-400">mm/j</span></span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min((data.rainRate / 20) * 100, 100)}%` }}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between font-medium">
                        <span>Hari ini</span>
                        <span className="text-slate-700 font-bold">{data.rainDaily} mm</span>
                    </div>
                </div>

                {/* 2. Matahari */}
                <div className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                                <Sun className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Radiasi</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{data.solarRad} <span className="text-xs font-normal text-slate-400">W/m²</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((data.solarRad / 1000) * 100, 100)}%` }}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between font-medium">
                        <span>UV Index</span>
                        <span className="text-slate-700 font-bold">{data.uvIndex}</span>
                    </div>
                </div>

                {/* 3. Tekanan */}
                <div className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Gauge className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tekanan</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{data.pressure} <span className="text-xs font-normal text-slate-400">hPa</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="absolute left-[50%] w-0.5 h-full bg-slate-300"></div>
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: '15%', marginLeft: `${((data.pressure - 980) / 60) * 100}%` }}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between font-medium">
                        <span>Kondisi</span>
                        <span className="text-slate-700 font-bold">Stabil</span>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </main>
  );
}