import React from 'react';
import { getMahakamDataFull } from '@/lib/weather-service';
import MahakamDashboard from '@/components/component-cuaca/mahakam/MahakamDashboard';
import { Ship } from 'lucide-react';

export const revalidate = 300;

export default async function MahakamWeatherPage() {
  const mahakamData = await getMahakamDataFull();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 md:px-8">
        <div className="w-full mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Ship size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Cuaca Maritim Mahakam
                </h1>
            </div>
            <p className="text-slate-500 max-w-2xl text-sm md:text-base">
                Sistem monitoring terpadu jalur pelayaran Sungai Mahakam.
            </p>
        </div>
      </div>
      
      <div className="w-full mx-auto px-4 md:px-8 mt-8">
         {/* CLIENT WRAPPER (Map + Detail Interaktif) */}
         <MahakamDashboard data={mahakamData} />
      </div>

    </main>
  );
}