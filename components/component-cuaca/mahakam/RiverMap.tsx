"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Cloud, CloudRain, Sun, CloudLightning, 
  Wind, Droplets, Maximize, CloudDrizzle, AlignJustify
} from 'lucide-react';
import { MahakamLocation } from '@/lib/mahakam-data';
import { renderToString } from 'react-dom/server';

interface RiverMapProps {
  initialData: MahakamLocation[];
  onViewDetail?: (loc: MahakamLocation) => void;
}

// --- SMART ICON GENERATOR ---
const getWeatherStyle = (condition: string) => {
    const c = condition.toLowerCase();
    
    if (c.includes('petir') || c.includes('hebat')) {
        return { 
            icon: <CloudLightning size={20} className="text-white" />, 
            bg: 'bg-purple-600 border-purple-300 shadow-purple-500/50',
            pulse: true
        };
    }
    if (c.includes('hujan')) {
        return { 
            icon: <CloudRain size={20} className="text-white" />, 
            bg: 'bg-blue-600 border-blue-300 shadow-blue-500/50',
            pulse: false 
        };
    }
    if (c.includes('gerimis') || c.includes('ringan')) {
        return { 
            icon: <CloudDrizzle size={20} className="text-white" />, 
            bg: 'bg-cyan-500 border-cyan-200 shadow-cyan-500/50',
            pulse: false 
        };
    }
    if (c.includes('cerah') || c.includes('terik')) {
        return { 
            icon: <Sun size={20} className="text-white" />, 
            bg: 'bg-orange-500 border-orange-200 shadow-orange-500/50',
            pulse: false 
        };
    }
    return { 
        icon: <Cloud size={20} className="text-white" />, 
        bg: 'bg-slate-500 border-slate-300 shadow-slate-500/50',
        pulse: false 
    };
};

const createCustomWeatherIcon = (loc: MahakamLocation, isActive: boolean) => {
  const style = getWeatherStyle(loc.weather);
  
  const iconHtml = renderToString(
    <div className={`
      relative flex items-center justify-center transition-all duration-300
      ${isActive ? 'scale-125 z-50' : 'hover:scale-110 z-10'}
    `}>
      <div className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center 
        border-2 shadow-lg backdrop-blur-sm transition-colors
        ${style.bg}
        ${isActive ? 'ring-4 ring-white/30' : ''}
      `}>
         {style.icon}
         {style.pulse && (
            <span className="absolute -inset-1 rounded-xl bg-inherit opacity-50 animate-ping"></span>
         )}
      </div>
      <div className={`
        absolute -bottom-1.5 w-3 h-3 rotate-45 border-r-2 border-b-2
        ${style.bg}
      `}></div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45]
  });
};

function SetBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  const isZoomed = useRef(false);
  useEffect(() => {
    if (coords.length > 0 && !isZoomed.current) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
      isZoomed.current = true;
    }
  }, [coords, map]);
  return null;
}

export default function RiverMap({ initialData, onViewDetail }: RiverMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [riverGeoJson, setRiverGeoJson] = useState<any>(null);
  const [selectedLoc, setSelectedLoc] = useState<MahakamLocation | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/maps/alur-mahakam.geojson')
      .then(res => res.json())
      .then(data => setRiverGeoJson(data))
      .catch(err => console.error("GeoJSON Error:", err));

    if (initialData.length > 0) {
        setSelectedLoc(initialData.find(l => l.name.includes('Samarinda')) || initialData[0]);
    }
  }, [initialData]);

  if (!isMounted) return <div className="h-[500px] md:h-[600px] w-full bg-slate-100 animate-pulse md:rounded-[2.5rem]" />;

  const riverGlowStyle = { color: '#60a5fa', weight: 8, opacity: 0.5, lineCap: 'round' as const, lineJoin: 'round' as const };
  const riverCoreStyle = { color: '#2563eb', weight: 3, opacity: 1, lineCap: 'round' as const, lineJoin: 'round' as const };

  return (
    /* PERUBAHAN: Div terluar dihapus. Class utama dipindah ke sini.
       - h-[500px] untuk mobile, h-[600px] untuk desktop.
       - rounded-none di mobile agar full bleed, rounded-[2.5rem] di desktop.
    */
    <div className="h-[500px] md:h-[600px] w-full md:rounded-[2.5rem] overflow-hidden border-y md:border border-slate-200 shadow-xl relative group bg-slate-100 font-sans z-0">
        
        {/* --- FLOATING INFO CARD --- */}
        {selectedLoc && (
            <div className="absolute top-4 right-4 z-[1000] w-[calc(100%-2rem)] md:w-80 animate-in slide-in-from-top-4 fade-in duration-500">
                 <div className="bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                    
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className={`w-2 h-2 rounded-full ${selectedLoc.weather.toLowerCase().includes('hujan') ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                    {selectedLoc.regency}
                                </p>
                            </div>
                            <h4 className="font-black text-xl text-slate-800 leading-tight">{selectedLoc.name}</h4>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-slate-800">{selectedLoc.temp}°</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <Wind size={18} className="text-blue-500" />
                            <div>
                                <div className="text-[9px] text-slate-400 uppercase font-bold">Angin</div>
                                <div className="text-xs font-bold text-slate-700">{selectedLoc.windSpeed} km/j</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <Droplets size={18} className="text-teal-500" />
                            <div>
                                <div className="text-[9px] text-slate-400 uppercase font-bold">RH %</div>
                                <div className="text-xs font-bold text-slate-700">{selectedLoc.humidity}%</div>
                            </div>
                        </div>
                    </div>
                    
                    {onViewDetail && (
                        <button 
                            onClick={() => onViewDetail(selectedLoc)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                        >
                            <Maximize size={14} />
                            LIHAT DETAIL HARIAN
                        </button>
                    )}

                 </div>
            </div>
        )}

        {/* --- MAP COMPONENT --- */}
        <MapContainer 
          center={[-0.502, 117.153]} 
          zoom={8} 
          scrollWheelZoom={false} 
          className="h-full w-full z-0 bg-slate-100"
          zoomControl={false}
        >
            <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {riverGeoJson && (
              <>
                <GeoJSON data={riverGeoJson} style={riverGlowStyle} />
                <GeoJSON data={riverGeoJson} style={riverCoreStyle} />
              </>
            )}

            <SetBounds coords={initialData.map(l => [l.lat, l.lng])} />

            {initialData.map((loc) => {
                const isActive = selectedLoc?.id === loc.id;
                return (
                    <Marker 
                        key={loc.id} 
                        position={[loc.lat, loc.lng]}
                        icon={createCustomWeatherIcon(loc, isActive)}
                        eventHandlers={{
                            click: () => setSelectedLoc(loc)
                        }}
                    />
                );
            })}
        </MapContainer>
        
        <div className="absolute bottom-6 left-6 z-[999]">
             <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-slate-200 text-slate-500 cursor-pointer hover:text-slate-900 transition-colors">
                 <AlignJustify size={20} />
             </div>
        </div>

    </div>
  );
}