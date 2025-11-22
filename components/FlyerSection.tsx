"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const flyers = [
  {
    title: "Pengumuman Cuaca Ekstrem",
    image: "/flyers/METAR.png",
  },
  {
    title: "Peringatan Dini Gelombang Tinggi",
    image: "/flyers/METAR.png",
  },
  {
    title: "Info Layanan BMKG",
    image: "/flyers/METAR.png",
  },
  {
    title: "Info Layanan BMKG",
    image: "/flyers/METAR.png",
  },
];

export default function FlyerSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % flyers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + flyers.length) % flyers.length);
  };

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Flyer & Pengumuman
      </h2>

      <div className="relative max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            className="w-full aspect-[5/1] flex flex-col cursor-grab active:cursor-grabbing"
            custom={direction}
            initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -100 || velocity.x < -500) {
                handleNext();
              } else if (offset.x > 100 || velocity.x > 500) {
                handlePrev();
              }
            }}
          >
            <img
              src={flyers[index].image}
              alt={flyers[index].title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {flyers[index].title}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigasi dot */}
      <div className="flex justify-center mt-4 space-x-2">
        {flyers.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition ${
              i === index ? "bg-blue-600 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
