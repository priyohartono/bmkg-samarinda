import type { Metadata } from "next";
import Image from "next/image";
import { User, Award, Briefcase, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Pegawai | BMKG Samarinda",
};

// --- DATA DUMMY ---
const pegawai = [
  {
    name: "Dr. Meteorologiwan, S.Si, M.Si",
    nip: "19800101 200501 1 001",
    position: "Kepala Stasiun Meteorologi Kelas III",
    group: "Pimpinan",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Budi Santoso, S.Kom",
    nip: "19850202 200801 1 002",
    position: "Kepala Seksi Data & Informasi",
    group: "Struktural",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Siti Aminah, S.Tr.Met",
    nip: "19880303 201001 2 003",
    position: "Kepala Seksi Observasi",
    group: "Struktural",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Andi Prakiraan",
    nip: "19900404 201501 1 004",
    position: "Forecaster (PMG Ahli Muda)",
    group: "Fungsional",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Dewi Analisa",
    nip: "19920505 201601 2 005",
    position: "Analis Iklim",
    group: "Fungsional",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Rudi Teknisi",
    nip: "19930606 201701 1 006",
    position: "Teknisi Peralatan",
    group: "Fungsional",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Rina Administrasi",
    nip: "19950707 201801 2 007",
    position: "Bendahara Pengeluaran",
    group: "Fungsional",
    image: "https://images.unsplash.com/photo-1558203728-00f45181dd84?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Joko Pengamat",
    nip: "19960808 201901 1 008",
    position: "Pengamat Meteorologi",
    group: "Fungsional",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=400&auto=format&fit=crop",
  },
];

export default function DaftarPegawaiPage() {
  const pimpinan = pegawai.filter((p) => p.group === "Pimpinan");
  const struktural = pegawai.filter((p) => p.group === "Struktural");
  const fungsional = pegawai.filter((p) => p.group === "Fungsional");

  return (
    // ROOT: Gunakan block w-full
    <div className="w-full space-y-12">
      
      {/* 1. KEPALA STASIUN */}
      <section className="w-full">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">Pimpinan Stasiun</h2>
        </div>

        {/* CONTAINER GRID SINGLE (Memaksa Lebar 100%) */}
        <div className="grid grid-cols-1 w-full">
            {pimpinan.map((item, idx) => (
            
            // CARD GRID (2 Kolom: Gambar - Konten)
            <div key={idx} className="w-full bg-gradient-to-r from-blue-50 to-white p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
                
                {/* Kolom 1: Foto */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto md:mx-0 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                    <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                    />
                </div>
                
                {/* Kolom 2: Info (Otomatis memenuhi sisa ruang) */}
                <div className="space-y-3 text-center md:text-left w-full">
                    <div>
                        <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            Kepala Stasiun
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{item.name}</h3>
                    </div>
                    
                    <div className="space-y-1">
                        <p className="text-lg text-blue-700 font-medium">{item.position}</p>
                        <p className="text-gray-500 font-mono text-sm bg-white/50 inline-block px-3 py-1 rounded border border-blue-100">
                            NIP. {item.nip}
                        </p>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* 3. KELOMPOK FUNGSIONAL */}
      <section className="w-full">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3 w-full">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Kelompok Jabatan Fungsional</h2>
        </div>
        
        {/* GRID 3 Kolom Lebar Penuh */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          {fungsional.map((item, idx) => (
            <div key={idx} className="w-full bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all flex items-start gap-4">
               <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                  <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                  />
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">
                      {item.name}
                  </h4>
                  <p className="text-xs text-blue-600 font-medium mb-2 truncate">{item.position}</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">NIP. {item.nip}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}