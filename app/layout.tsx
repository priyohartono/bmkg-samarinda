import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


// 2. METADATA LENGKAP (SEO & Social Media)
export const metadata: Metadata = {
  // GANTI INI dengan domain asli Anda saat sudah deploy (misal: https://bmkg-samarinda.id)
  metadataBase: new URL('http://bmkg-samarinda.vercel.app'), 

  title: {
    template: '%s | BMKG APT Pranoto Samarinda',
    default: 'BMKG APT Pranoto Samarinda - Info Cuaca & Iklim Kalimantan Timur',
  },
  description: "Website Resmi Stasiun Meteorologi Kelas III Aji Pangeran Tumenggung Pranoto. Menyediakan informasi cuaca, iklim, dan penerbangan untuk wilayah Samarinda dan Kalimantan Timur.",
  
  applicationName: 'BMKG APT Pranoto',
  authors: [{ name: 'BMKG Stasiun Meteorologi APT Pranoto', url: 'https://bmkg.go.id' }],
  keywords: ['Cuaca Samarinda', 'BMKG', 'APT Pranoto', 'Prakiraan Cuaca', 'Iklim', 'Penerbangan', 'Kalimantan Timur'],
  
  // Konfigurasi OpenGraph (Tampilan saat share link di WhatsApp/Facebook)
  openGraph: {
    title: 'BMKG APT Pranoto Samarinda',
    description: 'Pantau kondisi cuaca, suhu, visibilitas penerbangan, dan peringatan dini di wilayah Samarinda secara real-time.',
    url: '/', 
    siteName: 'BMKG APT Pranoto',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // Pastikan Anda menyimpan file 'og-image.jpg' di folder 'public'
        width: 1000,
        height: 1000,
        alt: 'BMKG APT Pranoto Samarinda',
      },
    ],
  },

  // Konfigurasi Twitter Card (Tampilan saat share di Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: 'BMKG APT Pranoto Samarinda',
    description: 'Informasi cuaca dan penerbangan resmi Stasiun Meteorologi APT Pranoto Samarinda.',
    images: ['/og-image.png'], // Menggunakan gambar yang sama
    creator: '@infoBMKG', // Bisa diganti dengan akun twitter stasiun jika ada
  },

  // Ikon (Favicon)
  icons: {
    icon: '/favicon.ico', // Pastikan ada favicon di folder public
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,}: { children: React.ReactNode;}) {
  return (
    <html lang="id">
      {/* ✅ Full light theme */}
      <body
        className={`${poppins.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className=" mx-auto p-4 flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}