// lib/data-dummy.ts

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  category: "Berita" | "Kegiatan" | "Edukasi";
  date: string;
  author: string;
  excerpt: string;
  image: string;
  isFeatured?: boolean;
  content?: string; // Tambahan untuk isi berita lengkap
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "BMKG Samarinda Gelar Sekolah Lapang Cuaca Nelayan 2024",
    slug: "slcn-2024",
    category: "Kegiatan",
    date: "20 Nov 2024",
    author: "Humas",
    excerpt: "Meningkatkan pemahaman nelayan terhadap informasi cuaca maritim demi keselamatan pelayaran dan peningkatan hasil tangkapan.",
    image: "https://images.unsplash.com/photo-1524591434253-02c28771a95d?q=80&w=2070&auto=format&fit=crop",
    isFeatured: true,
    content: `
      <p>Samarinda - Stasiun Meteorologi APT Pranoto Samarinda kembali menggelar Sekolah Lapang Cuaca Nelayan (SLCN) tahun 2024. Kegiatan ini bertujuan untuk memberikan pemahaman mendalam kepada para nelayan mengenai pentingnya informasi cuaca maritim sebelum melaut.</p>
      <p>Dalam sambutannya, Kepala Stasiun menekankan bahwa pemahaman terhadap dinamika cuaca laut bukan hanya soal keselamatan, tetapi juga strategi untuk meningkatkan hasil tangkapan. "Dengan mengetahui lokasi potensi gelombang tinggi dan arus laut, nelayan bisa merencanakan rute yang lebih aman dan efisien," ujarnya.</p>
      <h3>Materi Pelatihan</h3>
      <p>Para peserta diberikan materi pengenalan awan Cumulonimbus yang berbahaya, cara membaca peta prakiraan gelombang, serta cara mengakses aplikasi InfoBMKG. Antusiasme peserta terlihat saat sesi praktik pembacaan alat ukur cuaca sederhana.</p>
    `
  },
  {
    id: 2,
    title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang Sepekan Kedepan",
    slug: "waspada-hujan-lebat",
    category: "Berita",
    date: "18 Nov 2024",
    author: "Forecaster",
    excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan intensif di wilayah Kaltim.",
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
    isFeatured: false,
    content: `
      <p>Masyarakat Kalimantan Timur dihimbau untuk meningkatkan kewaspadaan menyusul dikeluarkannya peringatan dini cuaca ekstrem oleh BMKG. Berdasarkan analisis dinamika atmosfer terkini, teridentifikasi adanya belokan angin (shearline) di sekitar wilayah selat Makassar.</p>
      <p>Kondisi ini meningkatkan potensi pertumbuhan awan hujan (Convective Cloud) yang cukup signifikan. Hujan lebat yang dapat disertai kilat/petir dan angin kencang diprakirakan akan terjadi pada siang hingga sore hari.</p>
    `
  },
  {
    id: 3,
    title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang Sepekan Kedepan",
    slug: "waspada-hujan-lebat",
    category: "Berita",
    date: "18 Nov 2024",
    author: "Forecaster",
    excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan intensif di wilayah Kaltim.",
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
    isFeatured: false,
    content: `
      <p>Masyarakat Kalimantan Timur dihimbau untuk meningkatkan kewaspadaan menyusul dikeluarkannya peringatan dini cuaca ekstrem oleh BMKG. Berdasarkan analisis dinamika atmosfer terkini, teridentifikasi adanya belokan angin (shearline) di sekitar wilayah selat Makassar.</p>
      <p>Kondisi ini meningkatkan potensi pertumbuhan awan hujan (Convective Cloud) yang cukup signifikan. Hujan lebat yang dapat disertai kilat/petir dan angin kencang diprakirakan akan terjadi pada siang hingga sore hari.</p>
    `
  },
  {
    id: 4,
    title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang Sepekan Kedepan",
    slug: "waspada-hujan-lebat",
    category: "Berita",
    date: "18 Nov 2024",
    author: "Forecaster",
    excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan intensif di wilayah Kaltim.",
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
    isFeatured: false,
    content: `
      <p>Masyarakat Kalimantan Timur dihimbau untuk meningkatkan kewaspadaan menyusul dikeluarkannya peringatan dini cuaca ekstrem oleh BMKG. Berdasarkan analisis dinamika atmosfer terkini, teridentifikasi adanya belokan angin (shearline) di sekitar wilayah selat Makassar.</p>
      <p>Kondisi ini meningkatkan potensi pertumbuhan awan hujan (Convective Cloud) yang cukup signifikan. Hujan lebat yang dapat disertai kilat/petir dan angin kencang diprakirakan akan terjadi pada siang hingga sore hari.</p>
    `
  },
  {
    id: 5,
    title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang Sepekan Kedepan",
    slug: "waspada-hujan-lebat",
    category: "Berita",
    date: "18 Nov 2024",
    author: "Forecaster",
    excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan intensif di wilayah Kaltim.",
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
    isFeatured: false,
    content: `
      <p>Masyarakat Kalimantan Timur dihimbau untuk meningkatkan kewaspadaan menyusul dikeluarkannya peringatan dini cuaca ekstrem oleh BMKG. Berdasarkan analisis dinamika atmosfer terkini, teridentifikasi adanya belokan angin (shearline) di sekitar wilayah selat Makassar.</p>
      <p>Kondisi ini meningkatkan potensi pertumbuhan awan hujan (Convective Cloud) yang cukup signifikan. Hujan lebat yang dapat disertai kilat/petir dan angin kencang diprakirakan akan terjadi pada siang hingga sore hari.</p>
    `
  },
  {
    id: 6,
    title: "Waspada Potensi Hujan Lebat Disertai Angin Kencang Sepekan Kedepan",
    slug: "waspada-hujan-lebat",
    category: "Berita",
    date: "18 Nov 2024",
    author: "Forecaster",
    excerpt: "Analisis dinamika atmosfer menunjukkan adanya belokan angin yang memicu pertumbuhan awan hujan intensif di wilayah Kaltim.",
    image: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=1000&auto=format&fit=crop",
    isFeatured: false,
    content: `
      <p>Masyarakat Kalimantan Timur dihimbau untuk meningkatkan kewaspadaan menyusul dikeluarkannya peringatan dini cuaca ekstrem oleh BMKG. Berdasarkan analisis dinamika atmosfer terkini, teridentifikasi adanya belokan angin (shearline) di sekitar wilayah selat Makassar.</p>
      <p>Kondisi ini meningkatkan potensi pertumbuhan awan hujan (Convective Cloud) yang cukup signifikan. Hujan lebat yang dapat disertai kilat/petir dan angin kencang diprakirakan akan terjadi pada siang hingga sore hari.</p>
    `
  },
  // ... (Salin data lainnya ke sini, tambahkan properti 'content' sesuka hati untuk tes)
];