"use client"; // <-- INI YANG PALING PENTING

import WindtempSection from "@/components/component-cuaca/cuaca-penerbangan/WindTempSection";
import SIGWXSection from "@/components/component-cuaca/cuaca-penerbangan/SIGWXSection";
import CBAreaSection from "@/components/component-cuaca/cuaca-penerbangan/CbAreaSection";
import dynamic from "next/dynamic";


// --- PERBAIKAN ---
// Saya ganti nama variabel dinamisnya agar lebih jelas
// Anda menamakannya 'WeatherMap' tapi mengimpor 'PetaSection', itu tidak masalah
// tapi saat merendernya, Anda harus menggunakan nama variabel 'WeatherMap'
const PetaSectionDinamis = dynamic(
  () => import('@/components/component-cuaca/cuaca-penerbangan/PetaSection'),
  {
    ssr: false, // Nonaktifkan Server-Side Rendering untuk komponen ini
    loading: () => (
      // Tampilkan pesan loading sementara peta dimuat
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-500">Memuat peta...</p>
      </div>
    )
  }
);

// Komponen placeholder jika file aslinya belum ada
const WindTempSection = () => <div className="p-4 bg-gray-100 rounded-lg shadow">WindTempSection Placeholder</div>;
const SigwxSection = () => <div className="p-4 bg-gray-100 rounded-lg shadow">SigwxSection Placeholder</div>;
const CbAreaSection = () => <div className="p-4 bg-gray-100 rounded-lg shadow">CbAreaSection Placeholder</div>;


export default function PenerbanganClient() {
  return (
    <main className=" bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Wrapper utama */}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Judul halaman */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-700 md:text-3xl">
            Prakiraan Cuaca Penerbangan
          </h1>
          <p className="mx-auto  text-sm text-gray-600 md:text-base">
            Halaman ini menyajikan informasi prakiraan cuaca penerbangan dari
            BMKG, meliputi peta <strong>Wind & Temperature</strong> serta{" "}
            <strong>SIGWX (Significant Weather Chart)</strong> untuk berbagai
            level atmosfer.
          </p>
        </header>

        <section className="mb-10">
          <PetaSectionDinamis />
        </section>

        {/* Section Wind & Temp */}
        <section className="mb-10">
          <WindtempSection />
        </section>

        {/* Section SIGWX */}
        <section className="mb-10">
          <SIGWXSection />
        </section>

        {/* Section CB Area */}
        <section className="mb-10">
          <CBAreaSection />
        </section>

        {/* Footer kecil */}
        <footer className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} BMKG – Stasiun Meteorologi Samarinda.
          Data diperoleh dari portal Aviation BMKG.
        </footer>
      </div>
    </main>
  );
}
