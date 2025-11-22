"use client";

import Image from "next/image";

export default function HariTanpaHujanContent() {
  return (
    <div>
      {/* Judul */}
      <h1 className="text-3xl text-center md:text-4xl font-bold text-blue-600 mb-4">
        Informasi Hari Tanpa Hujan
      </h1>

      {/* Deskripsi Singkat */}
      <p className="text-gray-700 text-center max-w-3xl mb-10 leading-relaxed">
        Halaman ini menyajikan informasi mengenai pantauan jumlah hari tanpa hujan 
        yang terjadi di wilayah Kalimantan Timur. Data ini dapat membantu masyarakat 
        dan instansi terkait dalam memantau potensi kekeringan, ketersediaan air, serta 
        mendukung perencanaan sektor pertanian dan lingkungan.
      </p>

      {/* Peta */}
      <div className="w-full max-w-4xl mb-8">
        <Image
          src="/iklim/hth-map.jpg" // ganti dengan peta asli
          alt="Peta Hari Tanpa Hujan"
          width={1000}
          height={600}
          className="object-cover w-full h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Penjelasan tambahan */}
      <div className="max-w-3xl text-center bg-blue-50 border border-blue-100 rounded-lg p-6 text-gray-700 leading-relaxed">
        <p>
          Peta di atas menggambarkan distribusi hari tanpa hujan di berbagai wilayah. 
          Warna dan simbol yang ditampilkan memberikan informasi terkait tingkat kekeringan 
          serta potensi dampaknya terhadap kondisi lingkungan dan aktivitas masyarakat.
        </p>
      </div>
    </div>
  );
}
