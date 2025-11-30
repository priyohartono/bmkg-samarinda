import type { Metadata } from "next";
import { FileText, Download, Calendar, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Transparansi Kinerja | BMKG Samarinda",
  description: "Laporan kinerja dan akuntabilitas Stasiun Meteorologi APT Pranoto.",
};

// Data Dummy Dokumen Kinerja
const documents = [
  {
    category: "Laporan Kinerja (LAKIP)",
    items: [
      { name: "Laporan Kinerja Instansi Pemerintah Tahun 2023", year: "2023", size: "2.5 MB" },
      { name: "Laporan Kinerja Instansi Pemerintah Tahun 2022", year: "2022", size: "2.1 MB" },
    ]
  },
  {
    category: "Perencanaan Kinerja",
    items: [
      { name: "Rencana Strategis (RENSTRA) 2020-2024", year: "2020", size: "5.4 MB" },
      { name: "Perjanjian Kinerja Tahun 2024", year: "2024", size: "1.2 MB" },
      { name: "Indikator Kinerja Utama (IKU)", year: "2024", size: "0.8 MB" },
    ]
  },
  {
    category: "Laporan Keuangan",
    items: [
      { name: "Catatan Atas Laporan Keuangan (CALK) 2023", year: "2023", size: "3.1 MB" },
    ]
  }
];

export default function TransparansiKinerjaPage() {
  return (
    <div className="space-y-10 w-full">
      
      {/* Intro */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
        <ShieldCheck className="w-10 h-10 text-blue-600 flex-shrink-0" />
        <div>
            <h2 className="text-lg font-bold text-gray-800">Komitmen Transparansi</h2>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Sebagai wujud akuntabilitas dan transparansi publik, Stasiun Meteorologi APT Pranoto Samarinda menyediakan akses terbuka terhadap dokumen perencanaan, pengukuran, dan pelaporan kinerja instansi.
            </p>
        </div>
      </section>

      {/* List Dokumen per Kategori */}
      <div className="space-y-12">
        {documents.map((section, idx) => (
            <section key={idx} className="w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    {section.category}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {section.items.map((doc, dIdx) => (
                        <div key={dIdx} className="group bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 hover:shadow-sm transition-all w-full">
                            
                            {/* Info Dokumen */}
                            <div className="flex items-start gap-4">
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {doc.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                                            <Calendar className="w-3 h-3" /> {doc.year}
                                        </span>
                                        <span>PDF • {doc.size}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Download */}
                            <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex-shrink-0 w-full sm:w-auto justify-center">
                                <Download className="w-4 h-4" /> Unduh
                            </button>

                        </div>
                    ))}
                </div>
            </section>
        ))}
      </div>

    </div>
  );
}