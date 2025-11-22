"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Scan } from "lucide-react"; // 🔍 ikon zoom

const levels = ["100", "150", "200", "250", "300", "400", "500", "600", "700", "850"];
const times = ["00", "06", "12", "18"];

export default function WindtempSection() {
  const [selectedLevel, setSelectedLevel] = useState("850");
  const [selectedTime, setSelectedTime] = useState("00");
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); // 🔍 state zoom

  // Tentukan tanggal (hari ini)
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");
  const d = String(today.getUTCDate()).padStart(2, "0");

  // Link gambar
  const imageUrl = `https://aviation.bmkg.go.id/shared/windtemp/${selectedLevel}_${selectedTime}.png?id=${Date.now()}`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mt-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold text-gray-800 ml-10">
          Peta Wind & Temperature ({selectedLevel} hpa)
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Dropdown Level */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setImageError(false);
            }}
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} hpa
              </option>
            ))}
          </select>

          {/* Dropdown Waktu */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              setImageError(false);
            }}
          >
            {times.map((t) => (
              <option key={t} value={t}>
                {t}:00 UTC
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gambar dengan animasi */}
      <div className="relative w-full aspect-[4.35/3] bg-white rounded-xl overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!imageError ? (
            <motion.div
              key={`${selectedLevel}-${selectedTime}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={imageUrl}
                alt={`Wind & Temp ${selectedLevel} hpa ${selectedTime}:00 UTC`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                unoptimized
                onError={() => setImageError(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-gray-500 text-sm p-4"
            >
              Data untuk level ini belum tersedia di server BMKG.<br />
              Coba pilih waktu atau level yang lain.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Zoom */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-3 right-3 bg-gray-800/40 hover:bg-gray-800/60 text-white p-2 rounded-full transition-all"
          title="Perbesar Gambar"
        >
          <Scan size={20} />
        </button>
      </div>

      {/* Deskripsi */}
      <div className="bg-blue-50 text-gray-700 rounded-xl p-4 mt-4 border border-blue-100">
        <p className="text-sm leading-relaxed">
          <strong>Wind & Temperature Chart</strong> adalah peta cuaca penerbangan
          yang menampilkan arah dan kecepatan angin serta suhu udara pada
          berbagai level penerbangan (Flight Level). Peta ini digunakan untuk
          membantu pilot, dispatcher, dan forecaster dalam menentukan jalur
          penerbangan yang efisien dan aman terhadap kondisi atmosfer di
          lapisan atas.
        </p>
      </div>

      {/* Modal Zoom */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-black rounded-lg overflow-hidden max-w-5xl w-full aspect-[4.35/3]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <Image
                src={imageUrl}
                alt={`Zoomed WindTemp FL${selectedLevel}`}
                fill
                className="object-contain"
                unoptimized
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-gray-800/70 text-white px-3 py-1.5 rounded-md text-sm"
              >
                X
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-gray-500 text-center mt-3">
        Sumber: BMKG Aviation Meteorology | Data {`${d}-${m}-${y}`}
      </p>
    </div>
  );
}
