import { AlertTriangle } from "lucide-react";

export default function RunningText() {
  return (
    <div className="bg-yellow-400 border-b border-yellow-500 text-blue-900 text-sm font-semibold h-10 overflow-hidden relative flex items-center z-40">
      {/* Label Statis (Kiri) */}
      <div className="absolute left-0 top-0 bottom-0 bg-yellow-500 px-4 flex items-center gap-2 z-10 shadow-lg md:px-6">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span className="font-bold">PERINGATAN DINI:</span>
      </div>
      
      {/* Teks Berjalan */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-marquee whitespace-nowrap absolute">
          Waspada potensi hujan sedang-lebat yang dapat disertai kilat/petir dan angin kencang di wilayah Balikpapan, Samarinda, Kutai Kartanegara, dan Bontang pada siang dan sore hari. • Gelombang laut setinggi 1.25 - 2.5 meter di Selat Makassar bagian utara.
        </div>
      </div>
    </div>
  );
}