import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import { MOCK_NEWS } from "@/lib/data-dummy"; // Pastikan path ini sesuai

// TypeScript Interface untuk Params (Next.js 15)
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fungsi untuk menghasilkan Metadata (Judul di Tab Browser) secara dinamis
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const news = MOCK_NEWS.find((item) => item.slug === slug);

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  return {
    title: `${news.title} | BMKG Samarinda`,
    description: news.excerpt,
  };
}

export default async function DetailBeritaPage({ params }: PageProps) {
  // Di Next.js 15, params harus di-await
  const { slug } = await params;

  // Cari berita berdasarkan slug
  const news = MOCK_NEWS.find((item) => item.slug === slug);

  // Jika tidak ketemu, arahkan ke halaman 404
  if (!news) {
    notFound();
  }

  // Cari berita lain untuk sidebar (rekomendasi)
  const otherNews = MOCK_NEWS.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/publikasi/berita-kegiatan" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-medium line-clamp-1">
            {news.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- Main Content (Kiri) --- */}
          <article className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
            
            {/* Header Artikel */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {news.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {news.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {news.author}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                  <Clock className="w-4 h-4" /> 3 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {news.title}
              </h1>

              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </header>

            {/* Isi Berita (Render HTML string) */}
            {/* Menggunakan typography styling manual agar rapi */}
            <div 
              className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed space-y-6"
            >
              {/* Jika ada properti content HTML, render di sini. 
                  Jika belum ada di dummy, kita pakai text placeholder */}
              {news.content ? (
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              ) : (
                // Fallback content jika dummy data belum punya field 'content'
                <>
                  <p className="text-lg font-medium text-gray-800">
                    {news.excerpt}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Analisis Lanjutan</h3>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </>
              )}
            </div>

            {/* Share Button Section */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
               <span className="text-gray-500 text-sm">Bagikan artikel ini:</span>
               <div className="flex gap-3">
                 <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition">
                    <Share2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </article>


          {/* --- Sidebar (Kanan) --- */}
          <aside className="space-y-6">
            
            {/* Widget Berita Terbaru */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
                Berita Lainnya
              </h3>
              <div className="space-y-4">
                {otherNews.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/publikasi/berita-kegiatan/${item.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                 <Link href="/publikasi/berita-kegiatan" className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center">
                    Lihat Semua Berita
                 </Link>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}