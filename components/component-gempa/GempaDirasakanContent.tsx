"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Activity,
  Ruler,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GempaDirasakanContent() {
  const { data, error } = useSWR("/api/gempa/gempa-dirasakan", fetcher);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (error) return <div className="p-6">Gagal memuat data gempa</div>;
  if (!data) return <div className="p-6">Memuat data...</div>;

  // --- FIX: Correctly access the 'gempas' array from the API response ---
  // The API route returns an object { gempas: [...] }, so we access data.gempas
  const gempaList = data?.gempas || [];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Judul */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
          Gempa Bumi Dirasakan
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          15 gempa bumi terakhir yang dirasakan masyarakat, berdasarkan data
          resmi BMKG.
        </p>
      </div>

      {/* List Gempa */}
      <div className="space-y-6">
        {gempaList.map((gempa: any, index: number) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl border-1 p-5"
            >
              {/* Header Card */}
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h2 className="font-semibold text-lg text-gray-700">
                    {gempa.Wilayah}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-900">
                    <Item icon={<Calendar className="w-4 h-4 text-blue-600" />} text={gempa.Tanggal} />
                    <Item icon={<Clock className="w-4 h-4 text-indigo-500" />} text={gempa.Jam} />
                    <Item icon={<Activity className="w-4 h-4 text-yellow-600" />} text={`${gempa.Magnitude} SR`} />
                    <Item icon={<Ruler className="w-4 h-4 text-teal-600" />} text={gempa.Kedalaman} />
                    <Item icon={<Globe className="w-4 h-4 text-green-600" />} text={`${gempa.Lintang} | ${gempa.Bujur}`} />
                  </div>
                </div>

                {/* Alert Dirasakan */}
                {gempa.Dirasakan && (
                  <div className="md:max-w-xs w-full bg-orange-50 border-l-4 border-orange-400 p-3 rounded-lg flex items-start gap-2 text-sm text-orange-700">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{gempa.Dirasakan}</span>
                  </div>
                )}
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="mt-4 md:mt-1 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {isOpen ? (
                  <>
                    Sembunyikan Detail <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Lihat Detail <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Detail (expand) */}
              {isOpen && gempa.ShakemapUrl && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <Zoom>
                    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border">
                      <Image
                        src={gempa.ShakemapUrl}
                        alt="Shakemap Gempa"
                        fill
                        className="object-contain bg-gray-50"
                      />
                    </div>
                  </Zoom>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Item({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span>{text}</span>
    </div>
  );
}

