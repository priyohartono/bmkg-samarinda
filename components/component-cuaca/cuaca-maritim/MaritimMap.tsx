"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  Popup,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LatLngExpression } from "leaflet";

import dataPerairan from "@/data/wilayah_perairan.json";
import Legend from "./Legend";
import WeatherIcon from "../WeatherIcon";
import { daftarWilayah } from "@/lib/daftar_wilayah";
import { daftarPelabuhan } from "@/lib/daftar-pelabuhan";

// ======================
// 🧩 Tipe Data
// ======================
interface PerairanAPIData {
  wave_cat: string;
  wave_desc: string;
  weather: string;
  wind_from: string;
  wind_speed_min: string;
  wind_speed_max: string;
}

interface PerairanForecastItem {
  wave_cat: string;
  wave_desc: string;
  weather: string;
  angin: string;
}

interface PelabuhanForecastItem {
  name: string;
  weather: string;
  wave: string;
  wind_dir: string;
  wind_speed: string;
  lat: number;
  lon: number;
}

interface GeoJSONFeature {
  type: "Feature";
  properties: { WP_IMM: string; [key: string]: any };
  geometry: { type: string; coordinates: any[] };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// ======================
// ⚙️ Helper Functions
// ======================
const swapCoords = (coords: number[][]): LatLngExpression[] =>
  coords.map((c) => [c[1], c[0]] as LatLngExpression);

const getColorByWaveCategory = (category: string | undefined): string => {
  if (!category) return "#9ca3af";
  switch (category.toLowerCase()) {
    case "tenang":
      return "#3b82f6";
    case "rendah":
      return "#22c55e";
    case "sedang":
      return "#eab308";
    case "tinggi":
      return "#f97316";
    case "sangat tinggi":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
};

// ======================
// 🗺️ Komponen Utama
// ======================
export default function MaritimMap({
  onPolygonClick,
  onPelabuhanClick,
}: {
  onPolygonClick: (cardId: string) => void;
  onPelabuhanClick: (cardId: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [perairanData, setPerairanData] = useState<
    Record<string, PerairanForecastItem>
  >({});
  const [pelabuhanData, setPelabuhanData] = useState<
    Record<string, PelabuhanForecastItem>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPelabuhan, setShowPelabuhan] = useState(true);

  const namaWilayahAktif = daftarWilayah.map((w) => w.nama);
  const filteredFeatures = (dataPerairan as FeatureCollection).features.filter(
    (feature) => namaWilayahAktif.includes(feature.properties.WP_IMM)
  );

  // ======================
  // 📡 Fetch Data BMKG
  // ======================
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // --- Ambil Data Perairan
        const perairanPromises = daftarWilayah.map((w) =>
          fetch(`/api/maritim/${w.id}`).then((res) => res.json())
        );
        const perairanResults = await Promise.all(perairanPromises);

        const perairanDataMap: Record<string, PerairanForecastItem> = {};
        perairanResults.forEach((dataArray: PerairanAPIData[], index) => {
          if (dataArray && dataArray.length > 0) {
            const today: PerairanAPIData = dataArray[0];
            perairanDataMap[daftarWilayah[index].nama] = {
              wave_cat: today.wave_cat,
              wave_desc: today.wave_desc,
              weather: today.weather,
              angin: `${today.wind_from}, ${today.wind_speed_min}-${today.wind_speed_max} knot`,
            };
          }
        });
        setPerairanData(perairanDataMap);

        // --- Ambil Data Pelabuhan
        const pelabuhanPromises = daftarPelabuhan.map((p) =>
          fetch(`/api/pelabuhan/${p.id}`).then((res) => res.json())
        );
        const pelabuhanResults = await Promise.all(pelabuhanPromises);

        const pelabuhanDataMap: Record<string, PelabuhanForecastItem> = {};
        pelabuhanResults.forEach((res: any, index) => {
          const data = res?.data?.[0];
          const meta = res;

          if (data && meta?.latitude && meta?.longitude) {
            pelabuhanDataMap[daftarPelabuhan[index].nama] = {
              name: daftarPelabuhan[index].nama,
              weather: data.weather,
              wave: data.wave_desc || "-",
              wind_dir: data.wind_from,
              wind_speed: `${data.wind_speed_min}-${data.wind_speed_max}`,
              lat: parseFloat(meta.latitude),
              lon: parseFloat(meta.longitude),
            };
          }
        });

        setPelabuhanData(pelabuhanDataMap);
      } catch (e) {
        console.error("Gagal memuat data peta:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ======================
  // 🔁 Resize Map
  // ======================
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleResize = () => map.invalidateSize();
    const t = setTimeout(handleResize, 200);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ======================
  // 🗺️ Render
  // ======================
  return (
    <div className="relative w-full aspect-[1/1.3] md:aspect-[16/9] rounded-lg shadow-md overflow-hidden z-0">
      <MapContainer
        ref={mapRef}
        center={[-1.2, 117.1]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />

        {/* 🟦 POLYGON PERAIRAN */}
        {!isLoading &&
          filteredFeatures.map((feature) => {
            const areaName = feature.properties.WP_IMM;
            const currentData = perairanData[areaName];
            if (!currentData) return null;

            const color = getColorByWaveCategory(currentData.wave_cat);
            const wilayahInfo = daftarWilayah.find(
              (w) => w.nama === areaName
            );
            const positions = feature.geometry.coordinates?.[0]
              ? swapCoords(feature.geometry.coordinates[0])
              : [];

            return (
  <Polygon
    key={areaName}
    positions={positions as LatLngExpression[]}
    pathOptions={{
      color,
      weight: 0.5,
      fillOpacity: 0.3,
      fillColor: color,
    }}
  >
    <Tooltip sticky>
      <b>{areaName}</b>
      <br />
      🌊 {currentData.wave_desc}
    </Tooltip>

    <Popup>
      <div className="w-max-2xl bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-xl p-3 text-slate-800">
        <h3 className="font-bold text-base text-center mb-2">{areaName}</h3>
        <div className="text-center">
          <WeatherIcon
            condition={currentData.weather}
            className="w-10 h-10 mx-auto mb-1"
          />
          <p className="text-lg font-semibold">{currentData.wave_desc}</p>
          <p className="text-xs text-slate-500">{currentData.weather}</p>
          <p className="text-xs text-slate-500 mt-1">💨 {currentData.angin}</p>
        </div>
        {wilayahInfo && (
          <button
            onClick={() => onPolygonClick(wilayahInfo.cardId)}
            className="w-full text-center bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-lg mt-3 hover:bg-slate-900 transition-all"
          >
            Lihat Detail
          </button>
        )}
      </div>
    </Popup>
  </Polygon>
);

          })}

        {/* 🔵 TITIK PELABUHAN */}
        {!isLoading &&
          showPelabuhan &&
          Object.values(pelabuhanData).map((pel) => {
            const pelInfo = daftarPelabuhan.find((p) => p.nama === pel.name);
            if (!pelInfo) return null;

            return (
              <CircleMarker
                key={pel.name}
                center={[pel.lat, pel.lon]}
                radius={5}
                pathOptions={{ fillColor: "#3b82f6", fillOpacity: 1 }}
              >
                <Popup>
                  <div className="max-w-3xl bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-xl p-3 text-slate-800">
                    <h3 className="font-bold text-base text-center mb-2">
                      ⚓ {pel.name}
                    </h3>
                    <div className="flex flex-col items-center text-center">
                      <WeatherIcon condition={pel.weather} className="w-8 h-8 mb-1" />
                      <p className="text-sm font-semibold">{pel.weather}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        🌊 Gelombang: <span className="font-medium">{pel.wave}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        💨 Angin: {pel.wind_dir} ({pel.wind_speed} knot)
                      </p>
                    </div>
                    <button
  onClick={() => onPelabuhanClick(pelInfo.cardId)}
  className="w-full text-center bg-blue-600 text-white font-semibold text-xs py-2 px-3 rounded-lg mt-3 hover:bg-blue-700 transition-all"
>
  📍 Detail Pelabuhan
</button>

                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        <Legend />
      </MapContainer>

      {/* 🧭 TOGGLE */}
      <div className="absolute top-4 left-4 z-[999] bg-white/90 rounded-lg shadow p-2 flex items-center space-x-2">
        <input
          id="togglePelabuhan"
          type="checkbox"
          checked={showPelabuhan}
          onChange={() => setShowPelabuhan(!showPelabuhan)}
        />
        <label
          htmlFor="togglePelabuhan"
          className="text-sm font-medium text-gray-700 select-none"
        >
          Tampilkan Pelabuhan
        </label>
      </div>
    </div>
  );
}
