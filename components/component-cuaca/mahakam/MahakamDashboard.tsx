"use client";

import React, { useState, useRef } from 'react';
import RiverMap from './RiverMap';
import SingleStationView from './SingleStationView';
import { MahakamLocation } from '@/lib/mahakam-data';
import { Map } from 'lucide-react';

interface Props {
  data: MahakamLocation[];
}

export default function MahakamDashboard({ data }: Props) {
  // State untuk menyimpan lokasi yang sedang dilihat detailnya
  const [detailLoc, setDetailLoc] = useState<MahakamLocation | null>(null);
  
  // Ref untuk auto-scroll
  const detailRef = useRef<HTMLDivElement>(null);

  const handleViewDetail = (loc: MahakamLocation) => {
    setDetailLoc(loc);
    // Tunggu render sebentar, lalu scroll ke bawah
    setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseDetail = () => {
    setDetailLoc(null);
  };

  return (
    <div className="space-y-10">
         
         {/* BAGIAN 1: PETA */}
         <section>
            <RiverMap 
                initialData={data} 
                onViewDetail={handleViewDetail} 
            />
         </section>

         {/* BAGIAN 2: PANEL DETAIL (Muncul Conditional) */}
         <section ref={detailRef} className="scroll-mt-24 min-h-[100px]">
            {detailLoc ? (
                <SingleStationView 
                    data={detailLoc} 
                    onClose={handleCloseDetail} 
                />
            ) : (
                // Placeholder jika belum ada yang dipilih (Opsional)
                <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Map size={32} className="text-slate-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-slate-500">Belum ada lokasi dipilih</h3>
                    <p className="text-sm mt-1">
                        Silakan klik salah satu titik stasiun pada peta di atas, lalu tekan tombol <span className="font-bold text-blue-500">"Lihat Detail Lengkap"</span>.
                    </p>
                </div>
            )}
         </section>

    </div>
  );
}