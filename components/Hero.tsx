import Image from "next/image";
import gedungBMKG2 from "@/public/gedung-bmkg-baru.png"; // Pastikan path ini benar

export default function Hero() {
  return (
    <section className=" py-10 md:py-10">
      <div className="container mx-auto px-6 text-center">
        
        {/* Konten Teks */}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-blue-800 mb-4">
            Informasi Cuaca dan Iklim
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5 leading-snug">
            Selamat Datang di Stasiun Meteorologi <br /> Aji Pangeran Tumenggung Pranoto - Samarinda
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Dapatkan informasi cuaca, iklim, dan penerbangan terbaru untuk membantu merencanakan aktivitas harian, perjalanan, dan bisnis Anda dengan lebih baik.
          </p>
        </div>

        {/* Gambar Gedung */}
        <div className="mt-10 flex justify-center">
          <Image
            src={gedungBMKG2}
            alt="Gedung BMKG A. P. T. Pranoto Samarinda"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain"
            priority
          />
        </div>
        
      </div>
    </section>
  );
}