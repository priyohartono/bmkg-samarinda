'use client';

import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ImageOverlay,
  Circle,
  Pane,
  Polyline,
  Marker,
  Popup,
  LayerGroup,
  Tooltip,
  GeoJSON,
} from 'react-leaflet';
// --- PERUBAHAN: Impor PathOptions ---
import L, { PathOptions } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { Triangle } from 'lucide-react';
// --- PERUBAHAN: Impor tipe GeoJSON resmi ---
import type { Feature, Point, GeoJsonObject } from 'geojson';
// --- AKHIR PERUBAHAN ---
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Perbaikan ikon Leaflet
let DefaultIcon = L.icon({
  iconUrl: '/_next/static/media/marker-icon.png',
  shadowUrl: '/_next/static/media/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
if (typeof window !== 'undefined') {
  L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapDataStatus {
  radarFile: string;
  satelliteFile: string;
}

interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  type: 'conventional' | 'PBN';
}

// Tipe data yang lebih ketat untuk GeoJSON SIGWX
type SigwxText = string | {
  isoText1: string;
  isoText2: string;
  isoText3: string;
};

interface SigwxProperties {
  name: string;
  text?: SigwxText;
  file_url?: string;
  draw?: string;
  repeat?: number;
  category?: number;
  _id?: string;
}

// --- PERUBAHAN: Gunakan tipe GeoJSON resmi ---
type SigwxFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, SigwxProperties>;
// --- AKHIR PERUBAHAN ---


// --- Definisi Radar ---
const radarCenter: L.LatLngExpression = [-1.2599491508075904, 116.89707717620288];
const radarRadiusMeters = 250000;
const centerLatLng = L.latLng(radarCenter);
const calculatedRadarBounds = centerLatLng.toBounds(radarRadiusMeters * 2);

// --- Definisi Satelit (Persegi Panjang) ---
const calculatedSatelliteBounds: L.LatLngBoundsExpression = [
  [-15, 90], // [South, West]
  [15, 150],  // [North, East]
];

const center: L.LatLngExpression = [-1.2599491508075904, 116.89707717620288];


export default function PetaSection() {
  const [radarImageUrl, setRadarImageUrl] = useState<string | null>(null);
  const [satelliteImageUrl, setSatelliteImageUrl] = useState<string | null>(null);
  const [waypointData, setWaypointData] = useState<Waypoint[]>([]);
  const [sigwxData, setSigwxData] = useState<SigwxFeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastSigwxPublishTime, setLastSigwxPublishTime] = useState<string | null>(null);


  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statusResponse = await fetch('/api/penerbangan?type=status');
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || `Gagal memuat status: ${statusResponse.statusText}`);
        }
        const data: MapDataStatus = await statusResponse.json();
        const radarFile = data.radarFile;
        const satelliteFile = data.satelliteFile;
        let radarAvailable = radarFile && !radarFile.includes("nodata.png");
        let satelliteAvailable = satelliteFile && !satelliteFile.includes("nodata.png");
        if (!radarAvailable && !satelliteAvailable) {
          throw new Error('Data radar dan satelit tidak tersedia saat ini');
        }
        if (radarAvailable) {
          setRadarImageUrl(`/api/penerbangan?type=image&file=${radarFile}`);
        } else {
          setRadarImageUrl(null);
        }
        if (satelliteAvailable) {
          setSatelliteImageUrl(`/api/penerbangan?type=image&file=${satelliteFile}`);
        } else {
          setSatelliteImageUrl(null);
        }
        setLastUpdated(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }));
      } catch (err: any) {
        console.error("Error di PetaSection (fetchMapData):", err);
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    const fetchWaypoints = async () => {
      try {
        const response = await fetch('/penerbangan/waypoint.json');
        if (!response.ok) {
          throw new Error('Gagal memuat flightpath.json');
        }
        const data: Waypoint[] = await response.json();
        setWaypointData(data);
      } catch (err: any) {
        console.error("Error di PetaSection (fetchWaypoints):", err.message);
      }
    };

    const fetchSigwxData = async () => {
      try {
        const response = await fetch('/api/sigwx-proxy');
        if (!response.ok) {
          throw new Error('Gagal memuat data SIGWX');
        }
        const data = await response.json();
        
        if (data && data.data && data.data.docs && Array.isArray(data.data.docs)) {
          
          const allDocs = data.data.docs;
          if (allDocs.length === 0) {
            return;
          }

          const latestPublishTime = allDocs
            .map((doc: { publishedAt: string }) => new Date(doc.publishedAt)) // Tipe doc
            .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]; // Tipe a dan b
          
          const latestPublishTimeISO = latestPublishTime.toISOString();

          if (latestPublishTimeISO === lastSigwxPublishTime) {
             console.log("Data SIGWX masih yang terbaru.");
             return;
          }

          setLastSigwxPublishTime(latestPublishTimeISO);
          
          const latestDocs = allDocs.filter((doc: { publishedAt: string }) => doc.publishedAt === latestPublishTimeISO);

          // --- PERUBAHAN: Terapkan tipe baru saat mapping ---
          const featureCollection: SigwxFeatureCollection = {
            type: "FeatureCollection",
            features: latestDocs.map((item: any): Feature<GeoJSON.Geometry, SigwxProperties> => ({ 
              type: "Feature",
              geometry: item.geometry,
              properties: { ...item.properties, _id: item._id }
            }))
          };
          setSigwxData(featureCollection);
        } else {
          throw new Error('Format data SIGWX tidak terduga');
        }
      } catch (err: any) {
        console.error("Error Gagal fetch SIGWX:", err.message);
        setError(prev => prev ? `${prev} | ${err.message}` : err.message);
      }
    };

    fetchMapData();
    fetchWaypoints(); 
    fetchSigwxData();

    const interval = setInterval(fetchMapData, 300000); // 5 menit
    const sigwxInterval = setInterval(fetchSigwxData, 300000); // Cek data SIGWX setiap 5 menit
    return () => {
      clearInterval(interval);
      clearInterval(sigwxInterval); // Hapus interval SIGWX
    };
  }, [lastSigwxPublishTime]); 

  /**
   * Menambahkan popup ke setiap fitur.
   * Koordinat sudah otomatis dibalik oleh L.geoJSON (React-Leaflet).
   */
  const onEachFeature = (feature: Feature<GeoJSON.Geometry, SigwxProperties>, layer: L.Layer) => {
    let popupContent = "Info SIGWX";
    const props = feature.properties;

    if (props) {
      if (props.name && props.name.includes("cloud")) {
        popupContent = "Area Perawanan Signifikan (CB)";
      } else if (props.name && props.name.includes("sigwx-21") && typeof props.text === 'string') { // Type guard
        popupContent = `Jet Stream: FL${props.text}`;
      } else if (props.name && props.name.includes("sigwx-22")) {
        if (typeof props.text === 'object' && props.text !== null && 'isoText1' in props.text) { // Type guard lebih aman
          popupContent = `Awan CB: ${props.text.isoText1} (${props.text.isoText2})`;
        } else {
          popupContent = `Awan CB`;
        }
      } else if (props.name && props.name.includes("sigwx-25")) {
        popupContent = `Gunung Berapi Aktif`;
      } else if (props.name && props.name.includes("line")) {
        popupContent = `Garis ITCZ / Front Cuaca`;
      } else if (props.name && props.name.includes("pen") && typeof props.text === 'string') { // Type guard
        popupContent = props.text.replace(/\n/g, '<br />');
      }
    }
    layer.bindPopup(popupContent);
  };

  /**
   * Memberi style pada Polygon dan LineString.
   */
  const styleGeoJson = (feature?: Feature<GeoJSON.Geometry, SigwxProperties>): PathOptions => {
    if (!feature) return { color: 'blue', weight: 1 }; // Style default
    
    const geometryType = feature?.geometry?.type;
    const propsName = feature?.properties?.name || "";

    if (geometryType === 'Polygon' && propsName.includes('cloud')) {
      // Area Awan
      return {
        color: '#FF8C00', // Oranye tua
        weight: 1,
        opacity: 0.5,
        fillColor: '#FF8C00',
        fillOpacity: 0.2
      };
    }
    if (geometryType === 'LineString' && propsName.includes('line')) {
      // Garis (ITCZ, dll)
      return {
        color: 'red',
        weight: 2,
        opacity: 0.7,
        dashArray: '5, 5'
      };
    }
    return { color: 'blue', weight: 1 };
  };

  /**
   * Mengubah fitur Point menjadi Marker kustom (bukan titik biru standar).
   */
  const pointToLayer = (feature: Feature<Point, SigwxProperties>, latlng: L.LatLng): L.Layer => {
    const props = feature.properties;
    let iconUrl = props.file_url;
    
    if (!iconUrl || props.name.includes("pen")) { 
      return L.marker(latlng);
    }

    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], 
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
    
    return L.marker(latlng, { icon: customIcon }); // Gunakan latlng yang sudah benar
  };
  // --- AKHIR PERUBAHAN ---

  return (
    <div className="relative w-full max-w-7xl mx-auto aspect-[1/1.8] md:aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200">
      
      <style>{`
        /* ... CSS yang ada ... */
        .leaflet-control-container {
          z-index: 900 !important;
        }

        .custom-triangle-icon {
          background: transparent !important;
          border: none !important;
          width: 16px !important;
          height: 16px !important;
        }

        .waypoint-tooltip {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: bold;
          font-size: 10px;
          color: #000;
          text-shadow: 
            -1px -1px 0 #FFF,  
             1px -1px 0 #FFF,
            -1px  1px 0 #FFF,
             1px  1px 0 #FFF;
        }

        .waypoint-tooltip::before {
          background-color: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={6}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <Pane name="satellite-image" style={{ zIndex: 380 }} /> 
        <Pane name="radar-background" style={{ zIndex: 390 }} />
        <Pane name="sigwx-layer" style={{ zIndex: 400 }} /> 
        <Pane name="radar-image" style={{ zIndex: 410 }} />
        <Pane name="flight-path" style={{ zIndex: 420 }} /> 

        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Citra Satelit (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Peta Voyager (Carto)">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains='abcd'
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta Dark Matter (Carto)">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains='abcd'
              maxZoom={20}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Satelit Cuaca (EH)">
            {satelliteImageUrl && (
              <ImageOverlay
                url={satelliteImageUrl}
                bounds={calculatedSatelliteBounds}
                opacity={0.3}
                pane="satellite-image"
              />
            )}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Radar Cuaca">
            <LayerGroup>
              {radarImageUrl && (
              <>
                <Circle
                  center={radarCenter}
                  radius={radarRadiusMeters-50000}
                  color="transparent"
                  fillColor="#336699"
                  fillOpacity={0.2}
                  weight={1}
                  pane="radar-background"
                />
                <ImageOverlay
                  url={radarImageUrl}
                  bounds={calculatedRadarBounds}
                  opacity={0.6}
                  pane="radar-image"
                />
              </>
            )}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Waypoints">
            <LayerGroup>
              {waypointData.map((wp, idx) => {
                const isPBN = wp.type === 'PBN';
                const iconFill = isPBN ? "white" : "black";
                const iconStroke = isPBN ? "black" : "white";
                const iconHtml = ReactDOMServer.renderToString(
                  <Triangle
                    fill={iconFill}
                    stroke={iconStroke}
                    strokeWidth={isPBN ? 2 : 2}
                    size={16}
                  />
                );
                const customIcon = L.divIcon({
                  html: iconHtml,
                  className: 'custom-triangle-icon',
                  iconSize: [16, 16],
                  iconAnchor: [8, 14],
                  popupAnchor: [0, -14]
                });
                return (
                  <Marker
                    key={idx}
                    position={[wp.lat, wp.lng]}
                    icon={customIcon}
                    pane="flight-path"
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, 0]}
                      permanent={true}
                      className="waypoint-tooltip"
                    >
                      {wp.name}
                    </Tooltip>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* --- Layer Overlay baru untuk SIGWX --- */}
          <LayersControl.Overlay name="SIGWX Chart">
            <LayerGroup>
              {sigwxData && (
                <GeoJSON
                  key={lastSigwxPublishTime}
                  data={sigwxData} 
                  style={styleGeoJson}
                  onEachFeature={onEachFeature}
                  pointToLayer={pointToLayer}
                  pane="sigwx-layer"
                />
              )}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 backdrop-blur-sm p-2.5 rounded-md shadow-md text-sm border border-gray-200">
        {loading && <p className="text-blue-600 animate-pulse">Memuat data terbaru...</p>}
        {error && <p className="text-red-600 font-semibold">Error: {error}</p>}
        {!loading && !error && lastUpdated && (
           <p className="text-gray-700">Radar update: {lastUpdated} WITA</p>
        )}
      </div>
    </div>
  );
}

