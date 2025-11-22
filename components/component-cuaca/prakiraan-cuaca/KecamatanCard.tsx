// file: components/component-cuaca/KecamatanCard.tsx
"use client";

import Image from "next/image";
import { Cloud, CloudOff, Compass, Droplets, Eye, Umbrella, Wind } from 'lucide-react';

// ==================================================================
// DEFINISI TYPES (tidak berubah)
// ==================================================================
export interface PrakiraanCuaca {
  datetime: string; t: number; tcc: number; tp: number; weather_desc: string; image: string; hu: number; wd_deg: number; wd: string; ws: number; vs: number; local_datetime: string;
}
export interface KelurahanWeatherData { nama: string; prakiraan: PrakiraanCuaca[]; error?: string; }
export interface DataKecamatan { kelurahan: KelurahanWeatherData[]; }
interface KecamatanCardProps { kecamatan: string; data: DataKecamatan; }

// ==================================================================
// KOMPONEN
// ==================================================================

export default function KecamatanCard({ kecamatan, data }: KecamatanCardProps) {
  if (!data || !data.kelurahan || data.kelurahan.length === 0) {
    return (
      <div className="mt-6 p-4 rounded-lg bg-yellow-50 text-yellow-800">
        <h2 className="font-semibold">Data cuaca untuk Kecamatan {kecamatan} tidak tersedia.</h2>
      </div>
    );
  }

  const formatVisibility = (meters: number) => {
    if (meters >= 1000) { return `${(meters / 1000).toFixed(1)} km`; }
    return `${meters} m`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        Prakiraan Cuaca Detail di {kecamatan}
      </h2>

      <div className="space-y-6">
        {data.kelurahan.map((kel) => (
          <div key={kel.nama} className="grid bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-lg sm:text-xl text-gray-700 mb-4">{kel.nama}</h3>
            
            {kel.error || kel.prakiraan.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-xl">
                  <CloudOff size={36} />
                  <p className="mt-2 font-semibold">Data Tidak Tersedia</p>
              </div>
            ) : (
              <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-3 -mb-3 min-w-0">
                {kel.prakiraan.map((p, index) => {
                  const isCurrent = new Date(p.local_datetime) > new Date() && (index === 0 || new Date(kel.prakiraan[index - 1].local_datetime) < new Date());
                  
                  return (
                    <div 
                      key={p.datetime} 
                      // PERUBAHAN 1: Lebar kartu dikecilkan untuk mobile (w-52)
                      className={`flex-shrink-0 w-52 sm:w-64 rounded-xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300
                        ${isCurrent ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {/* Waktu */}
                      <div className="text-center mb-2">
                        <p className={`font-semibold text-xs sm:text-sm ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}>
                          {new Date(p.local_datetime).toLocaleDateString('id-ID', { weekday: 'short' })}
                        </p>
                        {/* PERUBAHAN 2: Ukuran font waktu dikecilkan untuk mobile */}
                        <p className="font-bold text-xl sm:text-2xl">
                          {new Date(p.local_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Ikon & Suhu */}
                      <div className="flex items-center my-2">
                        {/* PERUBAHAN 3: Ukuran ikon dikecilkan untuk mobile */}
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                          <Image src={p.image} alt={p.weather_desc} fill style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                        <div className="ml-2 sm:ml-3 text-left">
                           {/* PERUBAHAN 4: Ukuran font suhu dikecilkan untuk mobile */}
                           <p className={`font-bold text-4xl sm:text-5xl ${isCurrent ? 'text-white' : 'text-gray-800'}`}>{p.t}°</p>
                           <p className="font-medium capitalize text-xs sm:text-sm">{p.weather_desc}</p>
                        </div>
                      </div>

                      {/* Detail Tambahan */}
                      <div className={`grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 text-xs mt-2 pt-2 border-t ${isCurrent ? 'border-blue-500' : 'border-gray-200'}`}>
                        {/* Kolom Kiri */}
                        <div className="space-y-1.5">
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Compass size={12}/> Arah Angin</span>
                                <span className="font-bold text-xs sm:text-sm">{p.wd} ({p.wd_deg}°)</span>
                            </div>
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Wind size={12}/> Kec. Angin</span>
                                <span className="font-bold text-xs sm:text-sm">{p.ws} km/j</span>
                            </div>
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Umbrella size={12}/> Hujan</span>
                                <span className="font-bold text-xs sm:text-sm">{p.tp} mm</span>
                            </div>
                        </div>
                        {/* Kolom Kanan */}
                        <div className="space-y-1.5">
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Cloud size={12}/> Awan</span>
                                <span className="font-bold text-xs sm:text-sm">{p.tcc}%</span>
                            </div>
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Eye size={12}/> Visibilitas</span>
                                <span className="font-bold text-xs sm:text-sm">{formatVisibility(p.vs)}</span>
                            </div>
                            <div className="text-left">
                                <span className={`flex items-center gap-1.5 ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}><Droplets size={12}/> Kelembapan</span>
                                <span className="font-bold text-xs sm:text-sm">{p.hu}%</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}