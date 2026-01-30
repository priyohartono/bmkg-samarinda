"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
import { 
  CloudRain, Sun, Cloud, CloudLightning, Wind, MapPin, Eye, Navigation 
} from 'lucide-react';
import { renderToString } from 'react-dom/server';

// --- 1. DATA LENGKAP (Sama dengan RiverForecastView) ---
const RIVER_NODES = [
  {
    id: "long-apari", name: "Long Apari", region: "Mahakam Ulu", type: "Hulu",
    lat: 1.0505, lng: 114.3000,
    temp: 23, weather: "Hujan Petir", windSpeed: 15, windDir: "Barat Laut", visibility: "3 km", humidity: 98
  },
  {
    id: "long-bagun", name: "Long Bagun", region: "Mahakam Ulu", type: "Hulu",
    lat: 0.2833, lng: 115.2280,
    temp: 24, weather: "Hujan Ringan", windSpeed: 10, windDir: "Barat", visibility: "6 km", humidity: 95
  },
  {
    id: "melak", name: "Melak", region: "Kutai Barat", type: "Tengah",
    lat: -0.2311, lng: 115.8266,
    temp: 27, weather: "Berawan Tebal", windSpeed: 8, windDir: "Barat Daya", visibility: "8 km", humidity: 85
  },
  {
    id: "kota-bangun", name: "Kota Bangun", region: "Kutai Kartanegara", type: "Tengah",
    lat: -0.2333, lng: 116.5833,
    temp: 29, weather: "Cerah Berawan", windSpeed: 12, windDir: "Selatan", visibility: "10 km", humidity: 75
  },
  {
    id: "tenggarong", name: "Tenggarong", region: "Kutai Kartanegara", type: "Tengah",
    lat: -0.4225, lng: 116.9839,
    temp: 31, weather: "Cerah", windSpeed: 10, windDir: "Tenggara", visibility: "> 10 km", humidity: 65
  },
  {
    id: "samarinda", name: "Samarinda Kota", region: "Samarinda", type: "Hilir",
    lat: -0.5022, lng: 117.1536,
    temp: 33, weather: "Cerah Terik", windSpeed: 5, windDir: "Timur Laut", visibility: "> 10 km", humidity: 60
  },
  {
    id: "muara-jawa", name: "Muara Jawa", region: "Kutai Kartanegara", type: "Muara",
    lat: -0.8033, lng: 117.2300,
    temp: 30, weather: "Berawan", windSpeed: 20, windDir: "Utara", visibility: "9 km", humidity: 70
  }
];

// --- 2. HELPER FUNCTIONS (Sama dengan View) ---

const getRegionBadge = (type: string) => {
  switch (type) {
    case "Hulu": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Tengah": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Hilir": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-indigo-100 text-indigo-800 border-indigo-200";
  }
};

const getWeatherIconComponent = (weather: string) => {
  const w = weather.toLowerCase();
  if (w.includes("petir")) return <CloudLightning className="w-8 h-8 text-purple-500" />;
  if (w.includes("hujan")) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (w.includes("cerah") || w.includes("terik")) return <Sun className="w-8 h-8 text-orange-400" />;
  return <Cloud className="w-8 h-8 text-slate-400" />;
};

// Custom Marker untuk Peta (Bulatan Animasi)
const createCustomIcon = (type: string, weather: string) => {
  let colorClass = "bg-blue-500";
  if (type === "Hulu") colorClass = "bg-emerald-500";
  if (type === "Hilir") colorClass = "bg-orange-500";
  if (type === "Muara") colorClass = "bg-indigo-500";

  let IconComp = Cloud;
  if (weather.toLowerCase().includes("petir")) IconComp = CloudLightning;
  else if (weather.toLowerCase().includes("hujan")) IconComp = CloudRain;
  else if (weather.toLowerCase().includes("cerah")) IconComp = Sun;

  const iconSvg = renderToString(<IconComp size={18} color="white" strokeWidth={2.5} />);

  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center group">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75"></span>
        <div class="relative inline-flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white shadow-xl ${colorClass} transform transition-transform group-hover:scale-110">
          ${iconSvg}
        </div>
        <div class="absolute -bottom-1.5 w-3 h-3 bg-white rotate-45 transform translate-y-0 shadow-sm border-r border-b border-slate-200/50"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 46],
    popupAnchor: [0, -46],
  });
};

export default function RiverMap() {
  return (
    <div className="w-full h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 relative z-0">
      
      {/* CSS Injection untuk menghilangkan style default popup Leaflet agar card kita full custom */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
          border-radius: 1.5rem;
        }
        .leaflet-popup-content {
          margin: 0;
          width: 300px !important;
        }
        .leaflet-popup-tip-container {
          display: none; 
        }
        .leaflet-container {
            font-family: inherit;
        }
        .leaflet-control-attribution {
            display: none;
        }
      `}</style>

      <MapContainer 
        center={[-0.30, 116.0]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        <TileLayer
             url="https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png"
             opacity={0.5}
        />

        {RIVER_NODES.map((node) => (
          <Marker 
            key={node.id} 
            position={[node.lat, node.lng]} 
            icon={createCustomIcon(node.type, node.weather)}
          >
            <Popup closeButton={false} offset={[0, 10]}>
              {/* --- DESAIN KARTU POPUP (Mirip RiverForecastView) --- */}
              <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 relative overflow-hidden">
                
                {/* Region Badge (Pojok Kanan Atas) */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRegionBadge(node.type)}`}>
                    {node.type}
                </span>

                {/* Header: Lokasi */}
                <div className="mb-3 pr-16"> {/* pr-16 agar tidak nabrak badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <MapPin className="w-3 h-3" />
                        {node.region}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">
                        {node.name}
                    </h3>
                </div>

                {/* Main: Weather Info */}
                <div className="flex items-center gap-4 mb-5">
                    {getWeatherIconComponent(node.weather)}
                    <div>
                        <div className="font-bold text-slate-700 text-sm">{node.weather}</div>
                        <div className="text-xs text-slate-500 font-medium">
                            {node.temp}°C <span className="text-slate-300 mx-1">|</span> RH {node.humidity}%
                        </div>
                    </div>
                </div>

                {/* Footer: Maritim Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 px-5 pb-5">
                    <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                            <Wind className="w-3 h-3" /> Angin
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                            {node.windSpeed} km/j
                        </div>
                        <div className="text-[10px] text-slate-500">{node.windDir}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                            <Eye className="w-3 h-3" /> Jarak Pandang
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                            {node.visibility}
                        </div>
                        <div className="text-[10px] text-slate-500">Visual</div>
                    </div>
                </div>

                {/* Panah Bawah Popup (Visual Hack) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-50 rotate-45 transform"></div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}