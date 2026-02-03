"use client";

import React from 'react';
import { 
  Waves, ArrowUp, ArrowDown, Download, Clock, MapPin 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot 
} from 'recharts';

// --- DATA DUMMY (Sesuai Pola Gelombang) ---
const CHART_DATA = [
  { time: '02:00', height: -0.5, status: 'normal' },
  { time: '05:00', height: -0.2, status: 'normal' },
  { time: '08:00', height: 0.76, status: 'high' }, // Puncak
  { time: '11:00', height: 0.0, status: 'normal' },
  { time: '14:00', height: -0.6, status: 'low' },  // Lembah
  { time: '17:00', height: -0.1, status: 'normal' },
  { time: '20:00', height: 0.96, status: 'high' }, // Puncak
  { time: '23:00', height: 0.2, status: 'normal' },
  { time: '02:00 (Esok)', height: -0.7, status: 'low' }, // Lembah
  { time: '05:00 (Esok)', height: 0.1, status: 'normal' },
  { time: '08:00 (Esok)', height: 1.12, status: 'high' }, // Puncak
];

const HIGH_TIDE_DATA = [
  { date: '30 Jan 2026', time: '06:00 WITA', height: -0.27 },
  { date: '30 Jan 2026', time: '18:00 WITA', height: 0.76 },
  { date: '31 Jan 2026', time: '07:00 WITA', height: -0.07 },
  { date: '31 Jan 2026', time: '19:10 WITA', height: 0.96 },
  { date: '01 Feb 2026', time: '07:40 WITA', height: 0.15 },
];

const LOW_TIDE_DATA = [
  { date: '30 Jan 2026', time: '01:30 WITA', height: -0.47 },
  { date: '30 Jan 2026', time: '10:30 WITA', height: -0.51 },
  { date: '31 Jan 2026', time: '02:10 WITA', height: -0.64 },
  { date: '31 Jan 2026', time: '12:00 WITA', height: -0.62 },
  { date: '01 Feb 2026', time: '02:40 WITA', height: -0.76 },
];

// Custom Dot untuk Grafik (Merah = High, Hijau = Low)
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.status === 'high') {
    return <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="white" strokeWidth={2} />;
  }
  if (payload.status === 'low') {
    return <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="white" strokeWidth={2} />;
  }
  return null; // Titik normal tidak ditampilkan
};

export default function WaterLevelView() {
  return (
    <div className="w-full mt-8">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm text-white">
                <Waves size={24} />
            </div>
            <div>
                <h3 className="font-bold text-xl text-slate-900">Data Pasang Surut</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> MAWS TPK Palaran (ID: 40000017)
                </p>
            </div>
        </div>
      </div>

      {/* --- BAGIAN 1: GRAFIK (CHART) --- */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-700 text-sm">Grafik Ketinggian Air (MSL)</h4>
            <div className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                Update: 30 Jan 2026 17:59
            </div>
        </div>

        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 11, fill: '#64748b'}} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 11, fill: '#64748b'}}
                        domain={[-1, 1.5]}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                    />
                    
                    {/* Garis Waktu Sekarang (Orange Dashed) */}
                    <ReferenceLine x="17:00" stroke="#f97316" strokeDasharray="5 5">
                        <text x="0" y="-10" fill="#f97316" fontSize="10" fontWeight="bold" textAnchor="middle" className="bg-orange-500">
                            Waktu Sekarang
                        </text>
                    </ReferenceLine>

                    <Area 
                        type="monotone" 
                        dataKey="height" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorHeight)" 
                        dot={<CustomDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Legend Grafik */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-500 border-t border-slate-50 pt-4">
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded-sm"></div> Ketinggian Air
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div> Pasang Tertinggi
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Surut Terendah
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-0.5 h-3 bg-orange-500 dashed border-l border-dashed border-orange-500"></div> Waktu Sekarang
            </div>
        </div>
      </div>

      {/* --- BAGIAN 2: TABEL DATA (Grid 2 Kolom) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Tabel Pasang (Kiri) */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <ArrowUp className="w-4 h-4 text-red-500" />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Pasang Tertinggi (H)</h4>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Waktu</th>
                            <th className="px-6 py-3 font-semibold text-right">Ketinggian (m)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {HIGH_TIDE_DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                                <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                                    <span className="block text-slate-400 text-[10px] mb-0.5">{row.date}</span>
                                    {row.time}
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-red-600">
                                    {row.height}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Tabel Surut (Kanan) */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <ArrowDown className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Surut Terendah (L)</h4>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Waktu</th>
                            <th className="px-6 py-3 font-semibold text-right">Ketinggian (m)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {LOW_TIDE_DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                                    <span className="block text-slate-400 text-[10px] mb-0.5">{row.date}</span>
                                    {row.time}
                                </td>
                                <td className="px-6 py-3 text-right font-bold text-emerald-600">
                                    {row.height}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>

      {/* --- BAGIAN 3: TOMBOL DOWNLOAD --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200">
            <Download size={18} />
            Download Data Series
        </button>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200">
            <Download size={18} />
            Download Pasang & Surut (HL)
        </button>
      </div>

    </div>
  );
}