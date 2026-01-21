"use client";

import { BMKGResponse } from "./types";
import { 
    Wind, Droplets, MapPin, Navigation2, 
    Clock, Eye, ThermometerSun, CalendarDays
} from "lucide-react";
import { 
    ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';

interface Props {
    data: BMKGResponse;
}

// --- HELPER LOGIC (Tidak Berubah) ---
const getWindRotation = (direction: string) => {
    const map: { [key: string]: number } = {
        'N': 0, 'U': 0, 'NNE': 22.5, 'NE': 45, 'TL': 45, 'ENE': 67.5,
        'E': 90, 'T': 90, 'ESE': 112.5, 'SE': 135, 'TG': 135, 'SSE': 157.5,
        'S': 180, 'SSW': 202.5, 'SW': 225, 'BD': 225, 'WSW': 247.5,
        'W': 270, 'B': 270, 'WNW': 292.5, 'NW': 315, 'BL': 315, 'NNW': 337.5,
        'VAR': 0, 
    };
    return map[direction.toUpperCase()] || 0;
};

function calculateApparentTemperature(t: number, rh: number, ws: number): number {
  const expValue = (17.27 * t) / (237.7 + t);
  const e = (rh / 100) * 6.105 * Math.exp(expValue);
  const at = t + (0.33 * e) - (0.70 * ws) - 4.00;
  return Math.round(at);
}

const getDayName = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
    } catch (e) { return ""; }
};

const getFullDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (e) { return ""; }
};

// --- CHART COMPONENTS (DIREVISI TOTAL) ---

// 1. X-Axis Tick yang Lebih Minimalis & Elegan
const CustomXAxisTick = ({ x, y, payload, data }: any) => {
    const currentItem = data.find((d: any) => d.datetime === payload.value);
    if (!currentItem) return null;
    const isNewDay = currentItem.time === "00:00";

    return (
        <g transform={`translate(${x},${y})`}>
            {isNewDay ? (
                <g>
                    {/* Penanda Hari Baru: Teks Tebal dengan Ikon Kecil */}
                    <foreignObject x={-40} y={-110} width={80} height={24}>
                        <div className="flex items-center justify-center gap-1 text-blue-600 bg-blue-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-blue-100 shadow-sm">
                            <CalendarDays className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider truncate">
                                {getDayName(currentItem.fullDate)}
                            </span>
                        </div>
                    </foreignObject>
                    {/* Garis pemisah vertikal yang halus */}
                    <line x1={0} y1={-85} x2={0} y2={-15} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" opacity={0.3} />
                     <text x={0} y={20} textAnchor="middle" fill="#1e293b" fontSize={11} fontWeight={700}>
                        {currentItem.time}
                    </text>
                </g>
            ) : (
                 <text x={0} y={20} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={500}>
                    {currentItem.time}
                </text>
            )}
        </g>
    );
};

// 2. Panah Angin yang Lebih Terintegrasi
const CustomWindArrow = ({ x, y, width, index, data }: any) => {
    const item = data[index];
    if (!item) return null;
    const rotation = getWindRotation(item.wd);
    return (
        <g transform={`translate(${x + width / 2},${y - 28})`}> 
            {/* Lingkaran latar belakang putih transparan agar panah menonjol */}
            <circle cx="0" cy="8" r="10" fill="white" opacity="0.7" />
            <foreignObject x={-8} y={0} width={16} height={16}>
                {/* Warna panah disesuaikan dengan warna batang angin (Teal/Cyan) */}
                <Navigation2 width={16} height={16} color="#06b6d4" fill="#06b6d4" strokeWidth={1.5} style={{ transform: `rotate(${rotation}deg)`, filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))' }} />
            </foreignObject>
        </g>
    );
};

// 3. Dot Suhu dengan Efek Glow
const CustomizedDot = ({ cx, cy, payload, active }: any) => {
    if (!cx || !cy) return null;
    
    // Hanya tampilkan dot ikon jika ini adalah titik aktif (di-hover) atau titik data penting (misal setiap 6 jam)
    // Untuk contoh ini, kita buat simpel: dot kecil biasa, tapi saat active jadi besar dan bercahaya.
    
    if (active) {
        return (
            <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox="0 0 20 20">
                 <circle cx="10" cy="10" r="10" fill="#3b82f6" opacity="0.3" >
                    <animate attributeName="r" from="8" to="10" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0.3" dur="1s" repeatCount="indefinite" />
                 </circle>
                <circle cx="10" cy="10" r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
            </svg>
        )
    }

    // Dot biasa yang lebih subtle
    return (
         <circle cx={cx} cy={cy} r="3" fill="#fff" stroke="#3b82f6" strokeWidth="1.5" />
    );
};

// 4. Tooltip Gaya Frosted Glass Modern
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const feelsLike = calculateApparentTemperature(Number(data.temp), 80, Number(data.ws));
        return (
            // Menggunakan backdrop-blur dan border transparan untuk efek kaca
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl shadow-blue-900/10 border border-white/40 z-50 min-w-[180px]">
                <div className="font-bold border-b border-slate-100 pb-2 mb-3 flex items-center justify-between gap-2 text-sm text-slate-800">
                     <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-500"/> {data.time}
                     </div>
                     <span className="text-xs text-slate-500 font-medium">{getDayName(data.fullDate)}</span>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Suhu
                        </span>
                        <span className="font-black text-lg text-slate-800">{data.temp}°C</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-teal-400"></div> Angin
                        </span>
                        <div className="text-right">
                            <span className="font-bold text-slate-800 block">{data.ws} km/j</span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-wider">Arah {data.wd}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Feels Like: <b className="text-slate-700">{feelsLike}°C</b></span>
                    </div>
                     <div className="bg-slate-50 text-center py-1.5 rounded-lg text-xs text-slate-600 italic font-medium border border-slate-100">
                        {data.desc}
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function WeatherSummary({ data }: Props) {
    // ... (Bagian pemrosesan data di atas tetap sama, tidak perlu diubah) ...
    if (!data?.data?.[0]?.cuaca) return <div className="p-8 text-center text-slate-400">Data tidak tersedia.</div>;

    const flatWeather = data.data[0].cuaca.flat();
    const current = flatWeather[0];
    const location = data.lokasi;
    const currentDate = current.local_datetime.split(' ')[0];
    const tempVal = Number(current.t) || 0;
    const humVal = Number(current.hu) || 0;
    const windVal = Number(current.ws) || 0;
    const feelsLike = calculateApparentTemperature(tempVal, humVal, windVal);

    const chartData = flatWeather.slice(0, 24).map(item => ({
        datetime: item.local_datetime,
        fullDate: item.local_datetime.split(' ')[0], 
        time: item.local_datetime.split(' ')[1].substring(0, 5), 
        temp: Number(item.t) || 0, 
        desc: item.weather_desc,
        ws: Number(item.ws) || 0,
        wd: item.wd,
        image: item.image 
    }));

    return (
        <div className="space-y-6 md:space-y-8 w-full max-w-full pb-10">
            
            {/* HEADER & HERO CARD (Bagian ini tetap sama seperti sebelumnya) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-1 gap-4 md:gap-2 border-b border-slate-100 pb-6">
                {/* ... (Isi header sama) ... */}
                 <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 fill-blue-50" />
                        <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Lokasi Terpilih</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none max-w-[300px] md:max-w-none">
                        {location.desa}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base mt-2">
                        {location.kecamatan}, {location.kotkab}, {location.provinsi}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-sm text-slate-600 text-xs md:text-sm font-bold mt-2 md:mt-0">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500"/>
                    <span>Update: {current.local_datetime.split(' ')[1].substring(0, 5)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                {/* 1. KARTU UTAMA (Isi sama) */}
                <div className="lg:col-span-8 relative bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-50/50 p-6 md:p-10 overflow-hidden group min-h-[auto] md:min-h-[300px] flex flex-col justify-between">
                    {/* ... (Isi kartu hero sama) ... */}
                     <div className="absolute top-0 right-0 bg-blue-50 w-64 h-64 md:w-80 md:h-80 rounded-bl-full -mr-16 -mt-16 opacity-60 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative z-10 flex justify-between items-start">
                         <span className="px-3 py-1 md:px-4 md:py-1.5 bg-blue-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-500/30">
                            Cuaca Saat Ini
                        </span>
                        <span className="text-slate-400 font-bold text-sm md:text-lg">{getFullDate(currentDate)}</span>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mt-6 md:mt-4 text-center md:text-left">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 rounded-full"></div>
                            <img src={current.image} alt="Weather Icon" className="w-28 h-28 md:w-40 md:h-40 relative z-10 drop-shadow-2xl" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-center md:justify-start">
                                <span className="text-6xl md:text-8xl font-black text-slate-800 tracking-tighter leading-none">{current.t}</span>
                                <span className="text-2xl md:text-4xl font-bold text-blue-500 mt-2">°C</span>
                            </div>
                            <p className="text-xl md:text-3xl font-bold text-slate-700 leading-tight mt-2 mb-4">{current.weather_desc}</p>
                            <div className="inline-flex items-center gap-2 md:gap-3 text-slate-600 text-sm md:text-base bg-slate-50 px-4 py-2 md:px-5 md:py-3 rounded-2xl border border-slate-100 text-left">
                                <ThermometerSun className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>Terasa <strong className="text-slate-900">{feelsLike}°C</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. GRID METRIK (Isi sama) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3 md:gap-6 content-start">
                   {/* ... (Isi grid metrik sama) ... */}
                   {[
                        { label: "Angin", val: current.ws, unit: "km/j", icon: Wind, color: "text-teal-500" },
                        { label: "Arah", val: current.wd, unit: "", icon: Navigation2, color: "text-teal-500", rotate: getWindRotation(current.wd) },
                        { label: "Lembab", val: current.hu, unit: "%", icon: Droplets, color: "text-blue-500" },
                        { label: "Jarak", val: current.vs_text, unit: "", icon: Eye, color: "text-indigo-500", truncate: true }
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-center h-full min-h-[110px] md:min-h-[140px]">
                             <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 mb-1 md:mb-2">
                                <m.icon className={`w-4 h-4 md:w-5 md:h-5 ${m.color}`} style={m.rotate ? { transform: `rotate(${m.rotate}deg)` } : {}} />
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest">{m.label}</span>
                            </div>
                            <div className={`text-xl md:text-3xl font-black text-slate-800 ${m.truncate ? 'truncate' : ''}`}>
                                {m.val} <span className="text-xs md:text-sm font-bold text-slate-400">{m.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CHART SECTION YANG DISEMPURNAKAN --- */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 relative overflow-hidden">
                 {/* Dekorasi Latar Belakang Chart */}
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none"></div>
                 
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 relative z-10">
                    <div>
                        <h3 className="text-lg md:text-2xl font-black text-slate-800">Prakiraan 24 Jam</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">Geser untuk melihat detail waktu berikutnya</p>
                    </div>
                    <div className="flex gap-3 md:gap-4 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-100/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap border border-blue-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50"></div> Suhu (°C)
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-100/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap border border-teal-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50"></div> Angin (km/j)
                        </div>
                    </div>
                </div>
                
                <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent relative z-10">
                    <div className="h-[320px] md:h-[420px] min-w-[1200px] md:min-w-[1800px] select-none pr-4 md:pr-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 10 }}>
                                <defs>
                                    {/* Gradien Suhu yang Lebih Kaya */}
                                    <linearGradient id="colorTempArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="80%" stopColor="#3b82f6" stopOpacity={0.05}/>
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorTempStroke" x1="0" y1="0" x2="1" y2="0">
                                         <stop offset="0%" stopColor="#60a5fa" />
                                         <stop offset="100%" stopColor="#2563eb" />
                                    </linearGradient>

                                     {/* Gradien Batang Angin */}
                                    <linearGradient id="colorWindBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={1}/>
                                        <stop offset="100%" stopColor="#ccfbf1" stopOpacity={0.8}/>
                                    </linearGradient>
                                    
                                    {/* Filter Bayangan untuk Garis Suhu agar 'Pop-out' */}
                                    <filter id="shadow" height="200%">
                                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.25"/>
                                    </filter>
                                </defs>

                                {/* Grid yang sangat halus */}
                                <CartesianGrid vertical={false} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                                
                                <XAxis 
                                    dataKey="datetime" axisLine={false} tickLine={false} interval={0} 
                                    tick={<CustomXAxisTick data={chartData} />} 
                                    dy={10}
                                />
                                <YAxis yAxisId="left" domain={['dataMin - 12', 'dataMax + 8']} hide />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 25']} hide />
                                
                                <Tooltip 
                                    content={<CustomTooltip />} 
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} 
                                    animationDuration={200}
                                />
                                
                                {/* Grafik Batang Angin dengan Gradien dan Sudut Membulat */}
                                <Bar 
                                    yAxisId="right" 
                                    dataKey="ws" 
                                    fill="url(#colorWindBar)" 
                                    barSize={36} 
                                    radius={[12, 12, 12, 12]}
                                    animationBegin={300}
                                    animationDuration={1000}
                                >
                                    <LabelList dataKey="ws" content={<CustomWindArrow data={chartData} />} />
                                </Bar>
                                
                                {/* Grafik Area Suhu dengan Garis Halus (monotone), Bayangan, dan Gradien */}
                                <Area 
                                    yAxisId="left" 
                                    type="monotone" 
                                    dataKey="temp" 
                                    stroke="url(#colorTempStroke)" 
                                    strokeWidth={4} 
                                    fill="url(#colorTempArea)" 
                                    dot={<CustomizedDot />} 
                                    activeDot={<CustomizedDot active={true} />}
                                    filter="url(#shadow)"
                                    animationDuration={1500}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}