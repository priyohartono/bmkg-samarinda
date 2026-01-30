"use client";

import dynamic from "next/dynamic";
import RiverForecastView from "@/components/component-cuaca/mahakam/RiverForecastView";

// Import Peta Dinamis
const RiverMap = dynamic(
  () => import("@/components/component-cuaca/mahakam/RiverMap"), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] bg-slate-100 rounded-[2.5rem] animate-pulse flex items-center justify-center text-slate-400">
        Memuat Peta Satelit...
      </div>
    )
  }
);

export default function MahakamPage() {
  return (
    <main className="bg-[#F0F4F8] min-h-screen">
        {/* Bagian List View (Zig Zag) */}
        <RiverForecastView />
        
        {/* Bagian Peta Satelit */}
        {/* PERUBAHAN DI SINI: max-w-7xl (Lebih Lebar) */}
        <section className="max-w-[90rem] mx-auto px-4 md:px-8 pb-24 -mt-16 relative z-10">
            <div className="bg-white p-4 md:p-8 rounded-[3rem] shadow-2xl border border-slate-200">
                <div className="mb-8 px-2 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-3">
                        🛰️ Peta Sebaran Cuaca
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Pantau posisi awan hujan dan kondisi angin secara spasial di sepanjang alur sungai.
                    </p>
                </div>
                
                {/* Render Peta */}
                <RiverMap />
            </div>
        </section>
    </main>
  );
}