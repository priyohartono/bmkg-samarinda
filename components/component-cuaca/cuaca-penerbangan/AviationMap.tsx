"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { ParsedMetar, getFlightCategory } from "@/lib/bmkg/aviation-utils";

// --- 1. ICON PESAWAT (Static) ---
const createPlaneIcon = (color: string, rotation: number = 0) => {
    return L.divIcon({
      className: "custom-plane-icon",
      html: `
        <div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transform: rotate(${rotation}deg);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="m5 12 3-5m11 5-3-5"/><path d="m4 19 3-2.5"/><path d="m20 19-3-2.5"/></svg>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
};

// --- 2. ICON DESTINASI (Pulsing Radar Effect) ---
const createRadarIcon = () => {
    return L.divIcon({
        className: "radar-beacon",
        html: `
            <div class="relative flex items-center justify-center w-6 h-6">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// --- 3. HELPER: MEMBUAT GARIS MELENGKUNG (Bezier Curve) ---
// Ini membuat garis terlihat seperti rute penerbangan asli
const getCurvedPath = (start: [number, number], end: [number, number]) => {
    const lat1 = start[0];
    const lng1 = start[1];
    const lat2 = end[0];
    const lng2 = end[1];

    // Titik Tengah
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;

    // Hitung jarak untuk menentukan seberapa melengkung garisnya
    const dist = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
    
    // Offset lengkungan (makin jauh, makin melengkung ke atas)
    // Curvature logic: if long distance, arc higher (add to lat)
    const curvature = dist * 0.15; 

    const controlLat = midLat + curvature;
    const controlLng = midLng;

    // Generate titik-titik kurva (Quadratic Bezier)
    const path = [];
    for (let t = 0; t <= 1; t += 0.02) { // 50 segmen garis agar halus
        const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
        const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
        path.push([lat, lng] as [number, number]);
    }
    return path;
};

const AutoZoom = ({ data }: { data: ParsedMetar[] }) => {
    const map = useMap();
    useEffect(() => {
      if (data.length > 0) {
        const bounds = L.latLngBounds(data.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [data, map]);
    return null;
};

interface MapProps {
    airports: ParsedMetar[];
    onSelect: (icao: string) => void;
    selectedIcao: string;
}

export default function AviationMap({ airports, onSelect, selectedIcao }: MapProps) {
  
  const getColor = (cat: string) => {
    if (cat === 'VFR') return '#10b981'; 
    if (cat === 'MVFR') return '#3b82f6'; 
    return '#ef4444'; 
  };

  const wals = airports.find(a => a.icao_id === 'WALS');
  const selected = airports.find(a => a.icao_id === selectedIcao);

  // Generate Curved Path jika mode rute aktif
  const routePositions = (wals && selected && selectedIcao !== 'WALS') 
    ? getCurvedPath(
        [parseFloat(wals.latitude), parseFloat(wals.longitude)],
        [parseFloat(selected.latitude), parseFloat(selected.longitude)]
      )
    : null;

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative bg-slate-900">
      
      {/* CSS Animasi Khusus */}
      <style jsx global>{`
        /* Animasi Garis Mengalir */
        .flight-path-animated {
            stroke-dasharray: 10, 10;
            stroke-dashoffset: 200;
            animation: dash 3s linear infinite;
            filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6)); /* Glow Effect */
        }
        
        @keyframes dash {
            to {
                stroke-dashoffset: 0;
            }
        }

        /* Hilangkan background map default agar filter dark mode lebih enak */
        .leaflet-container {
            background-color: #0f172a !important;
        }
      `}</style>

      <MapContainer center={[0, 117]} zoom={6} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        {/* Peta Mode Gelap/Saturnus agar garis rute terlihat kontras */}
        <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <AutoZoom data={airports} />

        {/* 1. GAMBAR RUTE (Polyline) */}
        {routePositions && (
            <>
                {/* Garis Dasar (Shadow/Background Line) */}
                <Polyline 
                    positions={routePositions} 
                    pathOptions={{ 
                        color: '#1e3a8a', // Biru gelap
                        weight: 4, 
                        opacity: 0.5
                    }} 
                />
                {/* Garis Animasi (Flowing Line) */}
                <Polyline 
                    positions={routePositions} 
                    pathOptions={{ 
                        color: '#60a5fa', // Biru terang neon
                        weight: 2, 
                        className: 'flight-path-animated' 
                    }} 
                />
                {/* Marker Radar di Tujuan */}
                {selected && (
                    <Marker 
                        position={[parseFloat(selected.latitude), parseFloat(selected.longitude)]}
                        icon={createRadarIcon()}
                        zIndexOffset={1000}
                    />
                )}
            </>
        )}

        {/* 2. TITIK BANDARA */}
        {airports.map((apt) => {
            const cat = getFlightCategory(apt.visibility, apt.weather);
            const isSelected = selectedIcao === apt.icao_id;
            const isWals = apt.icao_id === 'WALS';

            // Jangan render marker pesawat biasa di tujuan jika sedang mode rute (ganti radar)
            // Tapi render marker default jika bukan tujuan
            if (routePositions && isSelected) return null;

            return (
                <Marker 
                    key={apt.icao_id}
                    position={[parseFloat(apt.latitude), parseFloat(apt.longitude)]}
                    icon={createPlaneIcon(getColor(cat), 0)} // Rotation 0 for map view
                    eventHandlers={{ click: () => onSelect(apt.icao_id) }}
                    opacity={selectedIcao && !isSelected && !isWals ? 0.3 : 1} // Fokuskan Origin & Dest
                >
                    <Tooltip direction="top" offset={[0, -15]} opacity={1} permanent={isSelected || isWals}>
                        <div className="text-center text-xs text-slate-800">
                            {apt.icao_id}
                        </div>
                    </Tooltip>
                </Marker>
            );
        })}
      </MapContainer>
    </div>
  );
}