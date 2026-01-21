"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getRegencies, getDistricts, getVillages } from "@/lib/wilayah-utils";
import { searchCoordinates } from "@/lib/geocoding-utils";
import { ChevronDown, Loader2, Navigation } from "lucide-react";

// --- TIPE DATA ---
interface Wilayah {
  id: string;
  name: string;
  bmkgCode?: string;
}

// --- ICON MARKER ---
const customIcon = L.divIcon({
  className: "custom-pin",
  html: `<div style="background-color: #2563eb; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4); position: relative;">
             <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// --- HELPER AGAR PETA BERGERAK ---
function MapUpdater({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], 13, { duration: 1.5, easeLinearity: 0.25 });
  }, [coords, map]);
  return null;
}

interface Props {
  onLocationSelect: (adm4: string, fullLocationName: string) => void;
}

export default function LocationExplorer({ onLocationSelect }: Props) {
  const [regencies, setRegencies] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [villages, setVillages] = useState<Wilayah[]>([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDist, setSelectedDist] = useState("");
  const [selectedVill, setSelectedVill] = useState("");

  const [mapCoords, setMapCoords] = useState<{lat: number, lng: number} | null>(null);
  const [locationLabel, setLocationLabel] = useState("Kalimantan Timur");
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  const defaultCenter: [number, number] = [-0.5022, 117.1536];

  useEffect(() => {
    getRegencies("64").then((data: any) => setRegencies(data));
  }, []);

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCity(id);
    setSelectedDist(""); setSelectedVill("");
    setDistricts([]); setVillages([]);
    if (id) {
      const data = await getDistricts(id);
      setDistricts(data as Wilayah[]);
    }
  };

  const handleDistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDist(id);
    setSelectedVill(""); setVillages([]);
    if (id) {
      const data = await getVillages(id);
      setVillages(data as Wilayah[]);
    }
  };

  const cleanName = (name: string) => {
    return name.replace(/KABUPATEN /i, "").replace(/KOTA /i, "").replace(/KECAMATAN /i, "").replace(/KELURAHAN /i, "").replace(/DESA /i, "").trim();
  };

  const handleVillageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedVill(id);
    if (!id) return;

    const villageData = villages.find(v => v.id === id);
    if (!villageData) return;

    const codeToSend = villageData.bmkgCode || villageData.id;
    const cityName = regencies.find(r => r.id === selectedCity)?.name || "";
    const distName = districts.find(d => d.id === selectedDist)?.name || "";
    const fullName = `${villageData.name}, ${cityName}`; 
    
    onLocationSelect(codeToSend, fullName);
    setLocationLabel(villageData.name); 

    setIsSearchingMap(true);
    const cleanVill = cleanName(villageData.name);
    const cleanDist = cleanName(distName);
    const cleanCity = cleanName(cityName);

    let coords = null;
    coords = await searchCoordinates(`${cleanVill}, ${cleanDist}, ${cleanCity}`);
    if (!coords) coords = await searchCoordinates(`${cleanVill}, ${cleanCity}`);
    if (!coords) coords = await searchCoordinates(`${cleanVill}, Kalimantan Timur`);
    if (!coords) coords = await searchCoordinates(`${cleanDist}, ${cleanCity}, Kalimantan Timur`);

    if (coords) setMapCoords(coords);
    setIsSearchingMap(false);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-slate-100 group z-0">
      
      {/* LAYER 1: PETA */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
            center={defaultCenter} 
            zoom={8} 
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false} 
            scrollWheelZoom={false}
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            <MapUpdater coords={mapCoords} />
            {mapCoords && (
                <Marker position={[mapCoords.lat, mapCoords.lng]} icon={customIcon}>
                    <Popup className="font-sans font-bold text-slate-700">{locationLabel}</Popup>
                </Marker>
            )}
        </MapContainer>
      </div>

      {/* LAYER 2: PANEL FILTER (Floating Glass Effect) - Responsif */}
      <div className="absolute top-4 md:top-6 left-3 right-3 md:left-8 md:right-8 z-[1000] flex justify-center">
        <div className="bg-white/90 md:bg-white/85 backdrop-blur-xl p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-500/20 border border-white/60 w-full max-w-5xl transition-all">
            
            {/* Header Mini di dalam Card */}
            <div className="flex items-center justify-between mb-3 px-1">
                 <div className="flex items-center gap-2 text-slate-500">
                    <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Cari Lokasi</span>
                 </div>
                 {isSearchingMap && (
                    <span className="text-[10px] md:text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1.5 animate-pulse font-bold">
                        <Loader2 className="w-3 h-3 animate-spin"/> <span className="hidden md:inline">Peta bergerak...</span>
                    </span>
                )}
            </div>

            {/* Grid Selectors - 1 Kolom di Mobile, 3 Kolom di Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                {[
                    { val: selectedCity, fn: handleCityChange, opt: regencies, ph: "Pilih Kota/Kabupaten", dis: false },
                    { val: selectedDist, fn: handleDistChange, opt: districts, ph: "Pilih Kecamatan", dis: !selectedCity },
                    { val: selectedVill, fn: handleVillageChange, opt: villages, ph: "Pilih Desa/Kelurahan", dis: !selectedDist, isLast: true }
                ].map((item, idx) => (
                    <div key={idx} className="relative group">
                        <select 
                            className={`w-full p-3 pl-4 pr-10 text-xs md:text-sm font-semibold rounded-xl md:rounded-2xl outline-none appearance-none transition-all border
                            ${item.isLast && item.val ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-100'}
                            disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm`}
                            onChange={item.fn}
                            value={item.val}
                            disabled={item.dis}
                        >
                            <option value="">{item.ph}</option>
                            {item.opt.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {item.isLast && isSearchingMap ? 
                            <Loader2 className="absolute right-3 md:right-4 top-3 md:top-3.5 w-4 h-4 text-blue-500 animate-spin" /> :
                            <ChevronDown className={`absolute right-3 md:right-4 top-3 md:top-3.5 w-4 h-4 pointer-events-none transition-transform ${item.val ? 'text-slate-600' : 'text-slate-400'}`} />
                        }
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}