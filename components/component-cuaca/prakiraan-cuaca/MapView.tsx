"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Select from "react-select";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map } from "leaflet";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

import KecamatanCard, { DataKecamatan } from "./KecamatanCard";
import kabupatenKaltimData from "@/public/geojson/WilayahKaltim.json";
import {
  useKecamatanSearch,
  KecamatanOption,
} from "@/components/hooks/useKecamatanSearch";

// ======================================
// ⬇️ BUAT HELPER FUNCTION INI ⬇️
// ======================================
const getNormalizedApiName = (name: string): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/kabupaten |kota /g, "") // hapus prefix
    .replace(/\s+/g, "-"); // ganti spasi dengan strip
};

// ==================================================================
// PENAMBAHAN 1: Definisikan tipe untuk Feature dan FeatureCollection
// ==================================================================
interface GeoJSONFeature {
  type: "Feature";
  properties: {
    [key: string]: any;
  };
  geometry: any;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}
// Komponen tombol kembali di pojok kanan atas
const FloatingBackButton = ({ onClick }: { onClick: () => void }) => (
  <div className="leaflet-top leaflet-right">
    <div className="leaflet-control leaflet-bar">
      <button
        onClick={onClick}
        className="flex items-center justify-center w-8 h-8 bg-white text-gray-800 rounded-sm shadow-md hover:bg-gray-100 transition-colors"
        title="Kembali ke Tampilan Provinsi"
      >
        <ArrowLeft size={18} />
      </button>
    </div>
  </div>
);

export default function MapView() {
  const mapRef = useRef<Map>(null);
  const forecastSectionRef = useRef<HTMLDivElement>(null);
  const searchTriggered = useRef<boolean>(false);

  const [viewLevel, setViewLevel] = useState<"provinsi" | "kabupaten">("provinsi");
  const [selectedKabupaten, setSelectedKabupaten] = useState<any | null>(null);
  const [kecamatanData, setKecamatanData] = useState<any | null>(null);
  const [isKecamatanLoading, setIsKecamatanLoading] = useState(false);

  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<DataKecamatan | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const allSearchOptions = useKecamatanSearch();
  const [filteredOptions, setFilteredOptions] = useState<KecamatanOption[]>([]);

  // PENAMBAHAN 2: Gunakan type assertion pada data yang diimpor
  const kabupatenKaltim = kabupatenKaltimData as FeatureCollection;

  // ================================================================
  // 🔹 Efek: Muat GeoJSON Kecamatan Saat Kabupaten Dipilih
  // ================================================================
  useEffect(() => {
    if (!selectedKabupaten) {
      setKecamatanData(null);
      return;
    }

    // ==========================================================
    // ⬇️ MODIFIKASI: Tambahkan AbortController ⬇️
    // ==========================================================
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchKecamatanData = async () => {
      try {
        setIsKecamatanLoading(true);
        setWeatherData(null);
        setWeatherError(null);

        // ⬇️ GUNAKAN HELPER ⬇️
        const kabupatenName = getNormalizedApiName(
          selectedKabupaten.properties.nm_dati2 ||
          selectedKabupaten.properties.KABKOT
        );

        const fileName = kabupatenName
          .toLowerCase()
          .replace(/kabupaten |kota /g, "")
          .replace(/\s+/g, "-");

        const filePath = `/geojson/kecamatan/${fileName}.geojson`;

        const response = await fetch(filePath, { signal }); // <-- Tambahkan signal
        if (!response.ok) throw new Error("Peta kecamatan tidak ditemukan.");

        const data = await response.json();
        setKecamatanData(data);
      } catch (error: any) {
        // Tangani AbortError secara khusus
        if (error.name === 'AbortError') {
          console.log('Fetch GeoJSON kecamatan dibatalkan');
        } else {
          console.error("Gagal memuat data kecamatan:", error);
          setWeatherError(error.message);
        }
      } finally {
        // Hanya set loading jika request tidak dibatalkan
        if (!signal.aborted) {
          setIsKecamatanLoading(false);
        }
      }
    };

    fetchKecamatanData();

    // Fungsi cleanup untuk membatalkan fetch
    return () => {
      controller.abort();
    };
  }, [selectedKabupaten]);

  // ================================================================
  // 🔹 Efek: Muat Data Cuaca per Kecamatan
  // ================================================================
  useEffect(() => {
    if (!selectedKecamatan || !selectedKabupaten) {
      setWeatherData(null);
      return;
    }

    // ==========================================================
    // ⬇️ MODIFIKASI: Tambahkan AbortController ⬇️
    // ==========================================================
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchWeatherData = async () => {
      try {
        setIsWeatherLoading(true);
        setWeatherError(null);
        setWeatherData(null);

        // ⬇️ GUNAKAN HELPER ⬇️
        const namaKotaApi = getNormalizedApiName(
          selectedKabupaten.properties.nm_dati2 ||
          selectedKabupaten.properties.KABKOT
        );

        const encodedKecamatan = encodeURIComponent(selectedKecamatan);

        const response = await fetch(
          `/api/cuaca/${namaKotaApi}/${encodedKecamatan}`,
          { signal } // <-- Tambahkan signal
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Gagal mengambil data dari server (status: ${response.status})`
          );
        }

        const data: DataKecamatan = await response.json();
        const allFailed =
          data.kelurahan.length > 0 && data.kelurahan.every((kel) => kel.error);

        if (allFailed) {
          setWeatherError(
            "Data cuaca dari BMKG tidak tersedia untuk semua kelurahan di kecamatan ini."
          );
          setWeatherData(null);
        } else {
          setWeatherData(data);
        }
      } catch (error: any) {
        // Tangani AbortError secara khusus
        if (error.name === 'AbortError') {
          console.log('Fetch data cuaca dibatalkan.');
        } else {
          console.error("Gagal mengambil data cuaca:", error);
          setWeatherError(error.message);
        }
      } finally {
        // Hanya set loading jika request tidak dibatalkan
        if (!signal.aborted) {
          setIsWeatherLoading(false);
        }
      }
    };

    fetchWeatherData();

    // Fungsi cleanup untuk membatalkan fetch
    return () => {
      controller.abort();
    };
  }, [selectedKecamatan, selectedKabupaten]);

  // ================================================================
  // 🔹 Efek: Scroll otomatis ke hasil prakiraan
  // ================================================================
  useEffect(() => {
    if ((weatherData || weatherError) && !isWeatherLoading) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 300)); // beri jeda 300ms
        forecastSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      })();
    }
  }, [weatherData, weatherError, isWeatherLoading]);

  // ================================================================
  // 🔹 Fungsi Event Handlers
  // ================================================================
  const onEachKabupatenFeature = useCallback((feature: any, layer: any) => {
    const namaKabupaten = feature.properties.nm_dati2 || feature.properties.KABKOT;
    layer.bindTooltip(namaKabupaten);
    layer.on({
      click: async (e: any) => {
        setSelectedKabupaten(feature);
        setViewLevel("kabupaten");

        // ✅ gunakan await agar peta menyesuaikan dengan smooth
        await new Promise((r) => setTimeout(r, 200));
        mapRef.current?.fitBounds(e.target.getBounds());
      },
    });
  }, []);

  const onEachKecamatanFeature = useCallback((feature: any, layer: any) => {
    const namaKecamatan = feature.properties.nm_kecamatan;
    layer.bindTooltip(namaKecamatan);
    layer.on({
      click: async () => {
        // 1. Cek apakah kecamatan yang diklik sama dengan yang sudah aktif
        if (selectedKecamatan === namaKecamatan) {
          return; // Jangan lakukan apa-apa
        }

        // 2. Tampilkan loader dan bersihkan data/error sebelumnya SEGERA
        setIsWeatherLoading(true);
        setWeatherData(null);
        setWeatherError(null);
        
        // 3. Beri jeda kecil untuk UX (loader akan terlihat selama jeda ini)
        await new Promise((r) => setTimeout(r, 150)); 

        // 4. Set kecamatan baru, yang akan memicu useEffect untuk fetch data
        setSelectedKecamatan(namaKecamatan);
      },
    });
  }, [selectedKecamatan]);

  const handleBackToProvince = async () => {
    setViewLevel("provinsi");
    setSelectedKabupaten(null);
    setWeatherError(null);

    // ==================================================
    // ⬇️ TAMBAHKAN DUA BARIS INI ⬇️
    // ==================================================
    setSelectedKecamatan(null); // Reset kecamatan yg sedang aktif
    setWeatherData(null);       // Hapus data cuaca sebelumnya
    // ==================================================

    await new Promise((r) => setTimeout(r, 200));
    mapRef.current?.setView([-0.5, 116.5], 7);
  };

  const handleSearchSelect = (selectedOption: KecamatanOption | null) => {
    if (!selectedOption) return;

    // 1. Normalisasi nama dari 'selectedOption' (hasil search)
    const normalizedSearchKab = getNormalizedApiName(selectedOption.kabupaten);

    const targetKabupatenFeature = kabupatenKaltim.features.find(
      (f: GeoJSONFeature) => {
        const propName = f.properties.nm_dati2 || f.properties.KABKOT;
        const normalizedPropName = getNormalizedApiName(propName);
        return normalizedPropName === normalizedSearchKab;
      }
    );

    if (targetKabupatenFeature) {
      searchTriggered.current = true;
      
      // 2. Tampilkan loader dan bersihkan data/error SEGERA saat search
      setIsWeatherLoading(true);
      setWeatherData(null);
      setWeatherError(null);

      // 3. Set state yang diperlukan
      setSelectedKabupaten(targetKabupatenFeature);
      setViewLevel('kabupaten');
      setSelectedKecamatan(selectedOption.value); // Ini akan memicu useEffect

      // 4. Fit map
      if (typeof window !== 'undefined') {
        import('leaflet').then(L => {
          const layer = L.geoJSON(targetKabupatenFeature);
          mapRef.current?.fitBounds(layer.getBounds());
        }).catch(err => console.error("Gagal load Leaflet module:", err));
      }
    } else {
      console.error(
        "Search Gagal: Tidak dapat mencocokkan kabupaten.",
        { 
          dicari: normalizedSearchKab, 
          dari_option: selectedOption.kabupaten 
        }
      );
    }
  };

  const handleInputChange = (inputValue: string) => {
    if (inputValue) {
      const filtered = allSearchOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  // ================================================================
  // 🔹 Style Peta
  // ================================================================
  const kabupatenStyle = {
    weight: 1,
    color: "white",
    fillOpacity: 1,
    fillColor: "#333",
  };
  const kecamatanStyle = (feature: any) => {
    
    // Ambil nama dari properti GeoJSON, bersihkan dari spasi
    const featureName = feature?.properties?.nm_kecamatan?.trim();

    // Ambil nama dari state, bersihkan dari spasi
    const stateName = selectedKecamatan?.trim();
    
    // Bandingkan keduanya dalam huruf kecil
    const isSelected = 
      featureName && 
      stateName && 
      featureName.toLowerCase() === stateName.toLowerCase();

    return {
      fillColor: isSelected ? "#3b82f6" : "#ffffff", // biru jika sama
      weight: 1,
      color: "#4b5563",
      fillOpacity: 0.8,
    };
  };

  // ================================================================
  // 🔹 Render
  // ================================================================
  return (
    <div className="space-y-6">
      {/* 🔍 Pencarian */}
      <div className="w-full max-w-md mx-auto">
        <Select<KecamatanOption>
          inputId="search-kecamatan"
          options={filteredOptions}
          onInputChange={handleInputChange}
          onChange={handleSearchSelect}
          placeholder="Ketik nama kecamatan..."
          isClearable
        />
      </div>

      {/* 🗺️ Map */}
      <div className="relative w-full aspect-[1/1.3] md:aspect-[16/9] rounded-lg shadow-md overflow-hidden z-0">
        <MapContainer
          ref={mapRef}
          center={[-0.5, 116.5]}
          zoom={7}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {viewLevel === "provinsi" && (
            <GeoJSON
              data={kabupatenKaltim as any}
              onEachFeature={onEachKabupatenFeature}
              style={kabupatenStyle}
            />
          )}

          {viewLevel === "kabupaten" &&
            kecamatanData &&
            !isKecamatanLoading && (
              <GeoJSON
                key={
                  selectedKabupaten.properties.nm_dati2 + selectedKecamatan
                }
                data={kecamatanData}
                onEachFeature={onEachKecamatanFeature}
                style={kecamatanStyle}
              />
            )}

{viewLevel === "kabupaten" && (
            <FloatingBackButton onClick={handleBackToProvince} />
          )}
        </MapContainer>
        {(isKecamatanLoading || isWeatherLoading) && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-500">
            <Loader2 size={48} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* 🌦️ Prakiraan Cuaca */}
      <div ref={forecastSectionRef}>
        {!selectedKecamatan &&
          !isWeatherLoading &&
          !weatherError &&
          !isKecamatanLoading &&
          viewLevel === "kabupaten" && (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Pilih Kecamatan
              </h3>
              {/* =========================================== */}
              {/* ⬇️ PERBAIKAN TYPO DI SINI ⬇️ */}
              {/* =========================================== */}
              <p className="text-gray-500 mt-2">
                Klik salah satu kecamatan pada peta untuk melihat prakiraan
                cuaca.
              </p>
            </div>
          )}

        {isWeatherLoading && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-700 animate-pulse">
              Mengambil data prakiraan cuaca dari BMKG...
            </p>
          </div>
        )}

        {weatherError && !isWeatherLoading && (
          <div className="mt-4 p-4 flex items-center space-x-3 rounded-lg bg-red-100 border border-red-300">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-bold text-red-800">Gagal Memuat Data</h3>
              <p className="text-sm text-red-700">{weatherError}</p>
            </div>
          </div>
        )}

        {weatherData && !isWeatherLoading && !weatherError && (
          <KecamatanCard
            kecamatan={selectedKecamatan || ""}
            data={weatherData}
          />
        )}
      </div>
    </div>
  );
}