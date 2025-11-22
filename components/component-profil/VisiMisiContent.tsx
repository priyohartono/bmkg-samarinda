"use client";

import { motion } from "framer-motion";

const missions = [
    {
      icon: "🔭",
      color: "text-blue-500",
      title: "Mengamati dan memahami fenomena",
      desc: "BMKG melaksanakan pengamatan dan pengumpulan data meteorologi, klimatologi, kualitas udara, dan geofisika secara teratur, lengkap, dan akurat."
    },
    {
      icon: "📊",
      color: "text-green-500",
      title: "Menyediakan data dan informasi",
      desc: "Memberikan data, informasi, dan jasa kepada pengguna dengan akurasi tinggi serta tepat waktu sesuai kebutuhan."
    },
    {
      icon: "🤝",
      color: "text-yellow-500",
      title: "Mengkoordinasikan dan memfasilitasi",
      desc: "BMKG mengawasi pelaksanaan operasional, memberi pedoman teknis, serta melakukan kalibrasi peralatan sesuai regulasi."
    },
    {
      icon: "🌍",
      color: "text-purple-500",
      title: "Partisipasi aktif di tingkat internasional",
      desc: "BMKG selalu mengacu pada ketentuan internasional karena fenomena cuaca dan geofisika tidak mengenal batas negara."
    }
  ];

export default function VisiMisiPage() {
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      {/* Judul */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Visi & Misi BMKG
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dalam rangka mendukung tugas pokok dan fungsi, BMKG mengacu pada visi
          dan misi untuk mewujudkan pelayanan informasi meteorologi, klimatologi,
          kualitas udara, dan geofisika yang cepat, tepat, dan akurat.
        </p>
      </div>

      {/* Visi */}
      <motion.div
        className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-bmkgBlue mb-2">Visi</h2>
        <p className="text-gray-700 leading-relaxed">
          Mewujudkan BMKG yang handal, tanggap, dan mampu dalam rangka mendukung
          keselamatan masyarakat serta pembangunan nasional, serta berperan aktif
          di tingkat internasional.
        </p>
      </motion.div>

      {/* Misi Timeline */}
      <div className="mt-10 ">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-6">Misi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
            className="bg-blue-50 rounded-xl shadow-md p-6 text-center cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className={`text-4xl mb-3 ${m.color}`}
            >
              {m.icon}
            </motion.div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{m.title}</h3>
            <p className="text-gray-600 text-sm">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>


      {/* Closing Statement */}
      <motion.div
        className="bg-bmkgBlue text-gray-800 p-6 mt-12 rounded-xl shadow text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg font-medium">
          BMKG berkomitmen memberikan pelayanan informasi cuaca, iklim, kualitas
          udara, dan geofisika yang <span className="font-bold">cepat</span>,{" "}
          <span className="font-bold">tepat</span>, dan{" "}
          <span className="font-bold">akurat</span> untuk keselamatan masyarakat
          Indonesia.
        </p>
      </motion.div>
    </div>
  );
}
