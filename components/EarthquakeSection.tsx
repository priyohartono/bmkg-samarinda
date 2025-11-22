"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Earthquake = {
  Infogempa: {
    gempa: {
      Tanggal: string;
      Jam: string;
      Magnitude: string;
      Kedalaman: string;
      Wilayah: string;
      Potensi: string;
      Shakemap: string;
    };
  };
};

export default function EarthquakeSection() {
  const [data, setData] = useState<Earthquake | null>(null);

  useEffect(() => {
    async function fetchGempa() {
      try {
        const res = await fetch(
          "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Gagal ambil data gempa:", err);
      }
    }
    fetchGempa();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
        Gempa Terkini
      </h2>

      {!data ? (
        // 🔹 Skeleton Loader
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 animate-pulse">
          <div className="h-10 w-24 bg-gray-200 rounded mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2 sm:col-span-2" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-40 bg-gray-200 rounded-lg" />
        </div>
      ) : (
        // 🔹 Konten Gempa
        <motion.div
          className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Info utama */}
          <div className="space-y-3">
            <p className="text-5xl font-extrabold text-red-600 text-center">
              {data.Infogempa.gempa.Magnitude}
            </p>
            <p className="text-gray-500 text-sm text-center">Magnitudo</p>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <p>
                <span className="font-semibold">Kedalaman:</span>{" "}
                {data.Infogempa.gempa.Kedalaman}
              </p>
              <p>
                <span className="font-semibold">Lokasi:</span>{" "}
                {data.Infogempa.gempa.Wilayah}
              </p>
              <p>
                <span className="font-semibold">Waktu:</span>{" "}
                {data.Infogempa.gempa.Tanggal} {data.Infogempa.gempa.Jam}
              </p>
            </div>

            {data.Infogempa.gempa.Potensi && (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                {data.Infogempa.gempa.Potensi}
              </span>
            )}
          </div>

          {/* Peta Shakemap */}
          {data.Infogempa.gempa.Shakemap && (
            <motion.img
              src={`https://data.bmkg.go.id/DataMKG/TEWS/${data.Infogempa.gempa.Shakemap}`}
              alt="Peta Gempa"
              className="rounded-lg max-h-72 w-full object-contain shadow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </section>
  );
}
