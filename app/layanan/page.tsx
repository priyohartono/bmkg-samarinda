"use client";

import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Ship, 
  Anchor, 
  BarChart3, 
  MessageSquareText, 
  ExternalLink 
} from 'lucide-react';

export default function LayananPage() {
  
  // DATA LAYANAN (Ganti url dengan Link GForm asli Anda)
  const services = [
    {
      id: 1,
      title: "Data Rp 0 (Pelajar)",
      description: "Layanan data nol rupiah (gratis) untuk keperluan akademik dalam mendukung kegiatan pendidikan. Biaya PNBP : Rp.0,0",
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      url: "https://forms.google.com/your-form-student" 
    },
    {
      id: 2,
      title: "Klaim Asuransi",
      description: "Informasi Cuaca untuk keperluan claim asuransi merupakan informasi analisa cuaca yang lalu untuk wilayah tertentu meliputi parameter cuaca, jenis awan, angin dan lainnya selama 24 jam. Biaya PNBP : Rp.175.000,00 per lokasi per hari",
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      url: "https://forms.google.com/your-form-insurance"
    },
    {
      id: 3,
      title: "Cuaca Pelayaran",
      description: "Informasi Cuaca untuk keperluan pelayaran merupakan informasi prakiraan cuaca maupun analisis cuaca khusus wilayah perairan tertentu. Biaya PNBP : Rp.250.000,00 per rute per hari",
      icon: Ship,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      url: "https://forms.google.com/your-form-voyage"
    },
    {
      id: 4,
      title: "Cuaca Pelabuhan",
      description: "Informasi Cuaca pelabuhan merupakan informasi prakiraan cuaca maupun analisis cuaca khusus di wilayah pelabuhan. Biaya PNBP : Rp.225.000,00 per lokasi per hari",
      icon: Anchor,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      url: "https://forms.google.com/your-form-port"
    },
    {
      id: 5,
      title: "Analisis Hujan Bulanan",
      description: "Merupakan informasi iklim/klimatologi berupa buku yang berisi analisa dan prakiraan hujan bulanan. Biaya PNBP : Rp.65.000,00 per buku",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
      url: "https://forms.google.com/your-form-rain"
    },
    {
      id: 6,
      title: "Jasa Konsultasi",
      description: "Melayani konsultasi terkait informasi Meteorologi Khusus untuk Pendukung Kegiatan Proyek, Survei, dan Penelitian Komersial. Biaya PNBP : Rp.3.750.000,00 per lokasi",
      icon: MessageSquareText,
      color: "text-orange-600",
      bg: "bg-orange-50",
      url: "https://forms.google.com/your-form-consult"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Permintaan Data & Layanan
          </h1>
          <p className="text-slate-500 text-lg">
            Pilih kategori layanan yang sesuai dengan kebutuhan Anda. Kami siap membantu menyediakan data meteorologi yang akurat dan terpercaya.
          </p>
        </div>

        {/* GRID LAYANAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer" // Keamanan untuk link eksternal
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 group flex flex-col h-full"
            >
              {/* Header Kartu: Icon */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>

              {/* Konten Text */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Call to Action (Visual) */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Isi Formulir Pengajuan →
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm text-slate-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Layanan beroperasi pada jam kerja: Senin - Jumat (08.00 - 16.00 WITA)
          </div>
        </div>

      </div>
    </div>
  );
}