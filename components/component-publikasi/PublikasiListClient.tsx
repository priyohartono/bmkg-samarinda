"use client";

import { useState, useEffect } from "react"; // Tambah useEffect
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, User, Calendar, X, ExternalLink, Tag, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_PUBLIKASI, type PublikasiItem, type PublikasiType } from "@/lib/data-dummy";

const ITEMS_PER_PAGE = 5; // Tentukan jumlah item per halaman di sini

export default function PublikasiListClient() {
  const [selectedItem, setSelectedItem] = useState<PublikasiItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"Semua" | PublikasiType>("Semua");
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter Data (Keseluruhan)
  const filteredData = MOCK_PUBLIKASI.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        item.author.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Semua" || item.type === filterType;
    return matchSearch && matchType;
  });

  // 2. Logika Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  
  // Data yang ditampilkan SAAT INI (di-slice)
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset ke halaman 1 jika user melakukan filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  // Handler ganti halaman dengan scroll ke atas
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Opsional: Scroll ke atas saat ganti page
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-10 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Artikel & Makalah Ilmiah
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Repositori pengetahuan BMKG Samarinda. Kumpulan dokumen kajian teknis dan informasi populer.
          </motion.p>
        </div>

        {/* --- Controls --- */}
        <div className="space-y-6 mb-10">
            <div className="flex justify-center">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                    {(["Semua", "Artikel", "Makalah"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterType(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                filterType === tab
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-xl mx-auto relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                    placeholder="Cari judul, topik, atau penulis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* --- List Data (Gunakan currentData, bukan filteredData) --- */}
        <div className="space-y-4">
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className={`group relative bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden
                  ${item.type === 'Artikel' ? 'hover:border-orange-300' : 'hover:border-blue-300'}
                `}
              >
                {/* Border Aksen */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                    ${item.type === 'Artikel' ? 'bg-orange-400' : 'bg-blue-500'}
                `}></div>

                <div className="pl-3 md:pl-4">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                                item.type === 'Artikel' 
                                ? 'bg-orange-50 text-orange-600 border-orange-100' 
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {item.type}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {item.year}
                            </span>
                        </div>
                        <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
                            <Download className="w-5 h-5" />
                        </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{item.author}</span>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {item.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <Tag className="w-3 h-3 text-gray-400" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <BookOpen className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                <p className="text-gray-500">Tidak ada dokumen yang ditemukan.</p>
                <button 
                    onClick={() => { setSearch(""); setFilterType("Semua"); }}
                    className="text-blue-600 text-sm font-medium hover:underline mt-2"
                >
                    Reset Filter
                </button>
            </div>
          )}
        </div>

        {/* --- PAGINATION CONTROLS (BARU) --- */}
        {filteredData.length > ITEMS_PER_PAGE && (
            <div className="mt-10 flex justify-center items-center gap-4">
                {/* Tombol Previous */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Info Halaman */}
                <span className="text-sm font-medium text-gray-600">
                    Halaman <span className="text-blue-600 font-bold">{currentPage}</span> dari {totalPages}
                </span>

                {/* Tombol Next */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        )}


        {/* --- MODAL PDF PREVIEW (Tetap Sama) --- */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
            >
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedItem(null)}
              />
              <motion.div
                layoutId={selectedItem.id.toString()}
                className="bg-white w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden z-10"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                  <div className="pr-4">
                    <h3 className="font-bold text-gray-800 line-clamp-1">{selectedItem.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={selectedItem.pdfUrl}
                      download 
                      className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-grow bg-gray-100 relative">
                  <iframe
                    src={`${selectedItem.pdfUrl}#toolbar=0&view=FitH`}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
                    <a 
                       href={selectedItem.pdfUrl}
                       target="_blank"
                       className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white shadow-lg rounded-full font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" /> Buka Fullscreen
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}