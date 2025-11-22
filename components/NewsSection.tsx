export default function NewsSection() {
  const news = [
    {
      title: "BMKG Gelar Workshop Meteorologi",
      date: "24 September 2025",
      desc: "Workshop terkait prediksi iklim diadakan untuk mendukung sektor pertanian.",
    },
    {
      title: "Peringatan Dini Cuaca Ekstrem",
      date: "22 September 2025",
      desc: "BMKG mengeluarkan peringatan dini terkait hujan lebat di beberapa wilayah.",
    },
    {
      title: "Simulasi Mitigasi Gempa",
      date: "20 September 2025",
      desc: "Latihan evakuasi gempa dilakukan di Balikpapan.",
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Berita Kegiatan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{item.date}</p>
              <p className="text-gray-700">{item.desc}</p>
            </div>
            <button className="mt-4 text-blue-600 hover:underline self-start">
              Baca Selengkapnya →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
