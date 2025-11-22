"use client";

import useSWR from "swr";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Activity,
  Globe,
  Waves,
  AlertTriangle,
  ZoomIn,
  X,
} from "lucide-react";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GempaTerbaruContent() {
  const { data, error } = useSWR("/api/gempa/gempa-terbaru", fetcher);

  const [isOpen, setIsOpen] = useState(false);

  if (error) return <div className="p-6">Gagal memuat data gempa</div>;
  if (!data) return <div className="p-6">Memuat data...</div>;

  const gempa = data.Infogempa.gempa;
  const imgUrl = gempa.ShakemapUrl; // langsung pakai dari API backend

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Judul */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
          Gempa Bumi Terbaru
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Informasi resmi dari BMKG mengenai gempa bumi terkini beserta lokasi,
          magnitudo, kedalaman, dan potensi dampak.
        </p>
      </div>

      {/* Grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Shakemap */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative border-gray-800 rounded-xl overflow-hidden shadow bg-white flex flex-col h-full"
        >
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-4">
          <Image
            src={imgUrl}
            alt="Shakemap Gempa"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsOpen(true)}
          />
        </div>
        </motion.div>

        {/* Detail */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow border-gray-800 p-6 space-y-5 flex flex-col"
        >
          <DetailItem
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            label="Tanggal"
            value={gempa.Tanggal}
          />
          <DetailItem
            icon={<Clock className="w-5 h-5 text-indigo-500" />}
            label="Jam"
            value={gempa.Jam}
          />
          <DetailItem
            icon={<MapPin className="w-5 h-5 text-red-500" />}
            label="Wilayah"
            value={gempa.Wilayah}
          />
          <DetailItem
            icon={<Globe className="w-5 h-5 text-green-600" />}
            label="Koordinat"
            value={`${gempa.Lintang} | ${gempa.Bujur}`}
          />
          <DetailItem
            icon={<Activity className="w-5 h-5 text-yellow-600" />}
            label="Magnitudo"
            value={`${gempa.Magnitude} SR`}
          />
          <DetailItem
            icon={<Ruler className="w-5 h-5 text-teal-600" />}
            label="Kedalaman"
            value={gempa.Kedalaman}
          />
          <DetailItem
            icon={<Waves className="w-5 h-5 text-purple-600" />}
            label="Potensi"
            value={gempa.Potensi}
          />
          {gempa.Dirasakan && (
            <DetailItem
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              label="Dirasakan"
              value={gempa.Dirasakan}
            />
          )}
        </motion.div>
      </div>

      {/* Modal Zoom */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)} // klik background close
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-lg overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()} // cegah close saat klik gambar
            >
              {/* Tombol Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 z-50 bg-white/90 hover:bg-white p-2 rounded-full shadow"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>

              {/* Zoomable Image */}
              <div className="flex justify-center items-center bg-black p-4">
                <Zoom>
                  <img
                    src={imgUrl}
                    alt="Shakemap Gempa Zoom"
                    className="object-contain max-h-[80vh] max-w-[90vw] rounded"
                  />
                </Zoom>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}