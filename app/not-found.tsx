import Link from "next/link";
import { CloudRain, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-blue-100 p-6 rounded-full mb-6 animate-bounce">
        <CloudRain className="w-16 h-16 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Halaman Hilang</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Maaf, halaman yang Anda cari mungkin tertiup angin atau belum tersedia dalam data prakiraan kami.
      </p>
      <Link 
        href="/"
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <Home className="w-5 h-5" /> Kembali ke Beranda
      </Link>
    </div>
  );
}