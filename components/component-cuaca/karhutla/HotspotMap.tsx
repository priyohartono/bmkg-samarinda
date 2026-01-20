"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { HotspotData } from "@/lib/data-karhutla";
import { Flame, MapPin, Calendar, Satellite, AlertTriangle, Info } from "lucide-react";

// --- 1. ICON GENERATOR (3 TINGKATAN) ---
const createHotspotIcon = (conf: number, isHovered: boolean) => {
  let mainColor = "";
  let pingColor = "";

  // LOGIKA SKALA BARU
  if (conf >= 9) {
    // TINGGI (9-10) -> Merah
    mainColor = "bg-red-600";
    pingColor = "bg-red-500";
  } else if (conf >= 7) {
    // SEDANG (7-8) -> Oranye
    mainColor = "bg-orange-500";
    pingColor = "bg-orange-400";
  } else {
    // RENDAH (1-6) -> Kuning
    mainColor = "bg-yellow-400";
    pingColor = "bg-yellow-300";
  }
  
  // Ukuran titik inti (Membesar jika di-hover)
  const sizeClass = isHovered ? "w-4 h-4" : "w-2.5 h-2.5";

  return L.divIcon({
    className: "custom-pulse-icon", 
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <span class="absolute inline-flex w-full h-full rounded-full ${pingColor} opacity-75 animate-ping"></span>
        
        <span class="relative inline-flex ${sizeClass} rounded-full ${mainColor} border-2 border-white shadow-sm transition-all duration-300"></span>
      </div>
    `,
    iconSize: [32, 32],   
    iconAnchor: [16, 16], 
  });
};

// Helper untuk mendapatkan Label & Warna Teks berdasarkan confidence
const getStatusInfo = (conf: number) => {
    if (conf >= 9) return { label: "Tinggi", color: "text-red-700", bg: "bg-red-50" };
    if (conf >= 7) return { label: "Sedang", color: "text-orange-700", bg: "bg-orange-50" };
    return { label: "Rendah", color: "text-yellow-700", bg: "bg-yellow-50" };
};

// Auto Zoom
const AutoBounds = ({ data }: { data: HotspotData[] }) => {
  const map = useMap();
  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(d => [d.lat, d.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([-0.5, 117], 7);
    }
  }, [data, map]);
  return null;
};

export default function HotspotMap({ data }: { data: HotspotData[] }) {
  const [hoveredSpot, setHoveredSpot] = useState<HotspotData | null>(null);

  // Ambil info status jika ada yang di-hover
  const statusInfo = hoveredSpot ? getStatusInfo(hoveredSpot.conf) : null;

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-red-100 z-0 relative bg-gray-100 group">
      
      <MapContainer 
        center={[-0.5, 117]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <AutoBounds data={data} />

        {data.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createHotspotIcon(point.conf, hoveredSpot?.id === point.id)}
            eventHandlers={{
              mouseover: () => setHoveredSpot(point),
              click: () => setHoveredSpot(point),
            }}
            zIndexOffset={hoveredSpot?.id === point.id ? 1000 : 1} 
          />
        ))}
      </MapContainer>
      
      {/* --- INFO WINDOW (Standardized) --- */}
      <div className="absolute top-4 right-4 z-[1000] w-64 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 transition-all duration-300">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
             INFO TITIK PANAS
        </h4>
        
        {hoveredSpot && statusInfo ? (
          <div>
            <div className="text-blue-900 font-bold leading-tight text-sm mb-2">
                {hoveredSpot.subDistrict}
            </div>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">Confidence:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${statusInfo.bg.replace("bg-", "text-").replace("50", "600")}`} style={{ backgroundColor: statusInfo.bg.replace("bg-", "#") === "bg-red-50" ? "#fee2e2" : (statusInfo.bg.includes("orange") ? "#ffedd5" : "#fef9c3") }}> 
                    {/* Note: Tailwind bg classes in style might be tricky, using simple conditional class logic above or consistent style */}
                     {statusInfo.label} ({hoveredSpot.conf})
                  </span>
               </div>

               <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">Satelit:</span>
                  <span className="font-medium text-gray-700">{hoveredSpot.satellite}</span>
               </div>
               
               <div className="text-[10px] text-center text-gray-400 mt-1">
                  {hoveredSpot.date}
               </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs italic">
            Arahkan kursor pada titik panas untuk melihat detail lokasi dan tingkat kepercayaan.
          </div>
        )}
      </div>

      {/* --- LEGEND (Updated: 3 Levels) --- */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs">
         <div className="space-y-2">
            {/* TINGGI */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Tinggi (9-10)</span>
            </div>
            {/* SEDANG */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Sedang (7-8)</span>
            </div>
            {/* RENDAH */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border border-white"></span>
                </span>
                <span className="font-medium text-gray-700">Rendah (1-6)</span>
            </div>
         </div>
      </div>
    </div>
  );
}