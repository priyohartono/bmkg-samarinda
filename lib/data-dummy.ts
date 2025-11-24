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
  {
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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


// lib/data-dummy.ts

// ... (kode berita sebelumnya biarkan saja) ...

// lib/data-dummy.ts

// ... (Bagian Berita biarkan saja)

export type BuletinItem = {
  id: number;
  title: string;
  edition: string;
  year: string;
  cover: string;
  pdfUrl: string; // Pastikan ini link valid
};

// Saya ganti pdfUrl ke sampel publik agar bisa dites tampilannya
export const MOCK_BULETIN: BuletinItem[] = [
  {
    id: 1,
    title: "Buletin Analisis Hujan & Prakiraan Hujan Bulanan",
    edition: "November 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop",
    // Link sampel PDF publik
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf", 
  },
  {
    id: 2,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 3,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 4,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 5,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 6,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 7,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2024",
    year: "2024",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 8,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2025",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 9,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2025",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 10,
    title: "Buletin Cuaca Maritim & Penerbangan",
    edition: "Oktober 2025",
    year: "2025",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  // ... data lain gunakan link yang sama dulu untuk tes
];


// lib/data-dummy.ts (Tambahkan di bagian bawah)

// lib/data-dummy.ts

// lib/data-dummy.ts

export type PublikasiType = "Artikel" | "Makalah";

export type PublikasiItem = {
  id: number;
  type: PublikasiType;
  title: string;
  author: string;
  year: string;
  tags: string[];
  abstract: string;
  pdfUrl: string;
};

export const MOCK_PUBLIKASI: PublikasiItem[] = [
  {
    id: 1,
    type: "Artikel",
    title: "Mengenal Fenomena La Nina dan Dampaknya Bagi Kalimantan Timur",
    author: "Dr. Asep Meteorologi",
    year: "2024",
    tags: ["Iklim", "Fenomena"],
    abstract: "La Nina bukan sekadar hujan lebat biasa. Pahami mekanisme pendinginan suhu muka laut Pasifik dan pengaruhnya terhadap curah hujan lokal.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 2,
    type: "Makalah",
    title: "Verifikasi Akurasi Prediksi Curah Hujan Model WRF-ARW Menggunakan Metode Dikotomi",
    author: "Tim Riset BMKG",
    year: "2023",
    tags: ["Model Numerik", "Verifikasi"],
    abstract: "Penelitian ini bertujuan untuk mengevaluasi performa model Weather Research and Forecasting (WRF) dalam memprediksi kejadian hujan lebat. Hasil verifikasi menunjukkan nilai akurasi mencapai 78%.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 3,
    type: "Artikel",
    title: "Teknologi Radar Cuaca: Mata Langit Penjaga Keselamatan Penerbangan",
    author: "Tim Teknis",
    year: "2024",
    tags: ["Teknologi", "Penerbangan"],
    abstract: "Bagaimana gelombang elektromagnetik dapat mendeteksi tetes hujan di awan? Mengupas cara kerja Radar C-Band di Bandara APT Pranoto.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 4,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 5,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 6,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 7,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 8,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 9,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 10,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
  {
    id: 11,
    type: "Makalah",
    title: "Analisis Korelasi Fenomena Dipole Mode Terhadap Variabilitas Curah Hujan Dasarian",
    author: "Budi Santoso, S.Tr",
    year: "2023",
    tags: ["Klimatologi", "Statistik"],
    abstract: "Studi ini mengkaji pengaruh IOD (Indian Ocean Dipole) terhadap pola hujan. Ditemukan bahwa fase IOD positif berkorelasi kuat dengan penurunan curah hujan di wilayah pesisir timur.",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
  },
];