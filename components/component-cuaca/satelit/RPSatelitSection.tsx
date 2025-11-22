"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Scan } from "lucide-react";

export default function RPSatelitSection() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = `https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_RP_Kaltim.png?id=${Date.now()}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full">
      <h2 className="text-base text-center font-semibold text-gray-800 mb-3">
        Himawari-9 Rainfall Potential
      </h2>

      <div className="relative aspect-[1/1] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!imageError ? (
            <motion.div
              key="hima"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={imageUrl}
                alt="Citra Satelit Himawari Kalimantan Timur"
                fill
                className="object-contain"
                unoptimized
                onError={() => setImageError(true)}
              />
            </motion.div>
          ) : (
            <p className="text-gray-500 text-sm">Gambar tidak tersedia.</p>
          )}
        </AnimatePresence>

        {/* Tombol Zoom */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-2 right-2 bg-gray-800/40 hover:bg-gray-800/60 text-white p-1.5 rounded-full"
          title="Perbesar"
        >
          <Scan size={16} />
        </button>
      </div>

      {/* Deskripsi */}
      <div className="bg-blue-50 text-gray-700 rounded-xl p-4 mt-4 border border-blue-100">
        <p className="text-sm sm:text-base leading-relaxed">
          Produk <strong>Himawari-9 Potential Rainfall</strong> adalah produk yang dapat digunakan 
          untuk mengestimasi potensi curah hujan, yang disajikan berdasarkan kategori 
          ringan, sedang, lebat, hingga sangat lebat, dengan menggunakan hubungan antara 
          suhu puncak awan dengan curah hujan yang berpotensi dihasilkan.
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
              className="relative bg-black rounded-lg overflow-hidden max-w-4xl w-full aspect-[1/1]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <Image
                src={imageUrl}
                alt="Zoomed Himawari-9"
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
    </div>
  );
}
