import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic'; 
import { getMahakamDataFull } from '@/lib/weather-service';
import { Ship } from 'lucide-react';

// --- 1. CONFIG METADATA (SEO) ---
// Karena ini Server Component, kita bisa export metadata langsung
export const metadata: Metadata = {
  title: 'Monitoring Cuaca Maritim Sungai Mahakam',
  description: 'Pantauan cuaca real-time, arah angin, tinggi gelombang, dan jarak pandang untuk alur pelayaran Sungai Mahakam (Hulu-Hilir). Data bersumber dari BMKG.',
  keywords: ['Cuaca Mahakam', 'BMKG Mahakam', 'Pelayaran Samarinda', 'Cuaca Sungai', 'Mahakam Ulu'],
  openGraph: {
    title: 'Cuaca Maritim Sungai Mahakam - Live Monitor',
    description: 'Dashboard monitoring cuaca dan navigasi real-time untuk pelayaran Sungai Mahakam.',
    type: 'website',
  }
};

// --- 2. CONFIG SERVER ---
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// --- 3. DYNAMIC IMPORT (Client Component Wrapper) ---
const MahakamDashboard = dynamic(
  () => import('@/components/component-cuaca/mahakam/MahakamDashboard'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 gap-4 border border-slate-200">
         <div className="w-16 h-16 bg-slate-200 rounded-full animate-bounce"></div>
         <p className="font-semibold">Memuat Peta Navigasi...</p>
      </div>
    )
  }
);

export default async function MahakamWeatherPage() {
  // Fetch data berjalan di server (Node.js)
  // Aman, cepat, dan SEO friendly
  const mahakamData = await getMahakamDataFull();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* HEADER SECTION (Server Rendered - SEO Friendly) */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Ship size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Cuaca Maritim Mahakam
                </h1>
            </div>
            <p className="text-slate-500 max-w-2xl text-sm md:text-base">
                Sistem monitoring terpadu jalur pelayaran Sungai Mahakam. Data real-time dari stasiun pengamatan BMKG.
            </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
         <MahakamDashboard data={mahakamData} />
      </div>

    </main>
  );
}