"use client";

// Daftar kategori gelombang dengan warna standar
const waveCategories = [
    { label: "Tenang", range: "0.0-0.5 m", color: "#3b82f6" },   // blue-500
    { label: "Rendah", range: "0.5-1.25 m", color: "#22c55e" },  // green-500
    { label: "Sedang", range: "1.25-2.5 m", color: "#eab308" },  // yellow-500
    { label: "Tinggi", range: "2.5-4.0 m", color: "#f97316" },   // orange-500
    { label: "Sgt. Tinggi", range: "> 4.0 m", color: "#ef4444" },   // red-500
];

export default function Legend() {
    return (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 pointer-events-none md:leaflet-left md:leaflet-bottom">
            <div
                className="leaflet-control leaflet-bar 
                    bg-white/70 text-gray-600 
                    backdrop-blur-2xl 
                    p-2 rounded-lg shadow-lg 
                    max-w-xs md:max-w-3xl w-full"
            >
                <h3 className="text-sm font-bold text-gray-600 mb-1 text-center">
                    Tinggi Gelombang
                </h3>

                {/* Tampilan MOBILE (Layout Diperbaiki)
                  Setiap item (warna + label) sekarang menjadi satu grup.
                */}
                <div className="flex justify-around items-start md:hidden">
                    {waveCategories.map((cat) => (
                        <div key={cat.label} className="flex flex-col items-center text-center gap-1 opacity-80">
                            <span
                                className="inline-block w-3.5 h-3.5 rounded-sm ml-3"
                                style={{ backgroundColor: cat.color }}
                            ></span>
                            <span className="text-sm text-gray-700 leading-none ml-2.5">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Tampilan DESKTOP (Tidak ada perubahan) */}
                <div className="hidden md:flex  justify-around items-start p-0 m-0">
                    {waveCategories.map((cat) => (
                        <div key={cat.label} className="flex flex-col items-center text-center gap-1 opacity-80">
                            <span
                                className="inline-block w-6.5 h-4.5 rounded-sm ml-1"
                                style={{ backgroundColor: cat.color }}
                            ></span>
                            <span className="font-medium text-sm text-gray-800">
                                {cat.label} ({cat.range})
                            </span>
                            
                        </div>
                    ))}
                </div>  
            </div>
        </div>
    );
}