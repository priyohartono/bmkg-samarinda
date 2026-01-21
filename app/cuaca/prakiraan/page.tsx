"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import WeatherSummary from "@/components/component-cuaca/prakiraan-cuaca/WeatherSummary";
import { Loader2, MapPinOff, CloudSun } from "lucide-react";

// Load LocationExplorer
const LocationExplorer = dynamic(
  () => import("@/components/component-cuaca/prakiraan-cuaca/LocationExplorer"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[450px] md:h-[600px] bg-white rounded-[2rem] flex flex-col items-center justify-center text-slate-300 border border-slate-100 animate-pulse shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-200" />
        <span className="text-sm font-semibold tracking-wider">MEMUAT PETA...</span>
      </div>
    ) 
  }
);

export default function WeatherPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLocationSelect = async (adm4Code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4Code}`);
            if (!res.ok) throw new Error("Gagal mengambil data BMKG.");
            const apiData = await res.json();
            if (!apiData.data) throw new Error("Data kosong.");
            setWeatherData(apiData);
        } catch (err: any) {
            setError(err.message);
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-50/50 min-h-screen pb-12 md:pb-24 font-sans text-slate-800 overflow-x-hidden">
            
            {/* HEADER */}
            <header className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-600/20">
                        <CloudSun className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Monitor Cuaca</h1>
                        <p className="text-[10px] md:text-sm text-slate-500 font-medium">Data Realtime BMKG Indonesia</p>
                    </div>
                </div>
            </header>

            {/* CONTAINER UTAMA */}
            <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 space-y-6 md:space-y-8">
                
                {/* 1. PETA & SELECTOR */}
                <section className="relative z-0 shadow-xl shadow-slate-200/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white bg-white ring-1 ring-slate-100">
                    <LocationExplorer onLocationSelect={handleLocationSelect} />
                </section>

                {/* 2. HASIL CUACA */}
                <section className="w-full mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 md:h-80 text-slate-400 gap-4 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-100/50">
                            <div className="p-3 md:p-4 bg-blue-50 rounded-full animate-pulse">
                                <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-500" />
                            </div>
                            <div className="text-center space-y-1">
                                <span className="text-sm font-bold text-slate-700 block">Mengunduh Data...</span>
                                <span className="text-xs text-slate-400">Menghubungkan ke server BMKG</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 md:h-80 text-red-400 gap-3 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-red-50 shadow-xl shadow-red-50/50 p-6 text-center">
                            <div className="p-3 md:p-4 bg-red-50 rounded-full">
                                <MapPinOff className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                            </div>
                            <span className="text-base md:text-lg font-bold text-red-500">Lokasi Tidak Ditemukan</span>
                            <span className="text-xs md:text-sm text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">{error}</span>
                        </div>
                    ) : weatherData ? (
                        <WeatherSummary data={weatherData} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 md:h-48 text-slate-300 border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[2.5rem] bg-slate-50/30 text-center px-4">
                            <span className="text-xs md:text-sm font-semibold tracking-wide">Pilih lokasi pada peta untuk melihat data</span>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}