"use client";

import { motion } from "framer-motion";

const tugasFungsi = [
  {
    kategori: "Pengamatan",
    poin: [
      "Melaksanakan pengamatan meteorologi permukaan secara terus-menerus setiap 1 (satu) jam selama 24 (dua puluh empat) jam setiap hari berdasarkan waktu standar internasional.",
      "Melaksanakan penyandian data meteorologi permukaan setiap jam pengamatan.",
      "Melaksanakan pengamatan cuaca khusus sesuai kebutuhan jaringan, antara lain radar cuaca/hujan, dan penerima citra satelit cuaca.",
      "Melaksanakan pengamatan meteorologi permukaan menggunakan peralatan di taman alat dan landas pacu untuk pelayanan penerbangan (METAR, SPECI, MET REPORT, dan SPECIAL) sesuai dengan ketentuan yang berlaku bagi stasiun meteorologi yang memberikan layanan penerbangan.",
      "Melaksanakan pengamatan meteorologi paling sedikit terhadap unsur-unsur: radiasi matahari, suhu udara, tekanan udara, angin, kelembaban udara, awan, jarak pandang, curah hujan, penguapan di stasiun meteorologi.",
      "Melaksanakan kegiatan fam flight bagi stasiun meteorologi yang memberikan layanan penerbangan.",
    ],
  },
  {
    kategori: "Pengelolaan Data",
    poin: [
      "Melaksanakan pengiriman berita data sandi meteorologi permukaan pada jam-jam 00, 03, 06, 09, 12, 15, 18, 21 UTC secara tepat waktu.",
      "Melaksanakan monitoring dan quality control pengiriman berita data sandi meteorologi permukaan dan udara atas.",
      "Melaksanakan pengumpulan data meteorologi permukaan untuk keperluan pemetaan dan analisis cuaca.",
      "Melaksanakan pengumpulan produk informasi dan prakiraan cuaca, produk Numerical Weather Prediction (NWP) dan/atau peringatan dini dari BMKG Pusat.",
      "Melaksanakan pertukaran data dan informasi cuaca penerbangan sesuai ketentuan dan kebutuhan operasi penerbangan.",
      "Melaporkan kejadian-kejadian cuaca ekstrim di wilayah pelayanan yang menjadi tanggung jawabnya ke BMKG Pusat.",
      "Melaporkan keadaan cuaca pada saat terjadinya kecelakaan pesawat ke Kepala Pusat Meteorologi Penerbangan dan Maritim BMKG.",
      "Melaksanakan pengiriman data hasil pengamatan lainnya menggunakan Sistem Pengelolaan Database Meteorologi, Klimatologi, Kualitas Udara dan Geofisika (MKKuG) yang telah ditentukan.",
    ],
  },
];

export default function TugasFungsiPage() {
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      {/* Judul */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Tugas & Fungsi
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Sesuai Peraturan Kepala Badan Meteorologi, Klimatologi dan Geofisika
          Nomor 9 Tahun 2014, Stasiun Meteorologi merupakan Unit Pelaksana
          Teknis di lingkungan BMKG yang bertanggung jawab kepada Kepala BMKG.
          Tugas pokoknya adalah melaksanakan pengamatan, pengelolaan data,
          pelayanan jasa, serta tugas penunjang.
        </p>
      </div>

      {/* List Kategori */}
      <div className="space-y-8">
        {tugasFungsi.map((section, i) => (
          <motion.div
            key={i}
            className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <h2 className="text-xl font-semibold text-bmkgBlue mb-4">
              {section.kategori}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              {section.poin.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Closing */}
      <motion.div
        className="bg-bmkgBlue text-gray-800 p-6 mt-12 rounded-xl shadow text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg font-medium">
          Stasiun Meteorologi APT Pranoto Samarinda berkomitmen untuk
          melaksanakan pengamatan, pengelolaan data, serta layanan informasi
          meteorologi yang{" "}
          <span className="font-bold">tepat waktu</span> dan{" "}
          <span className="font-bold">berkualitas</span> demi mendukung
          keselamatan masyarakat dan operasional penerbangan.
        </p>
      </motion.div>
    </div>
  );
}
