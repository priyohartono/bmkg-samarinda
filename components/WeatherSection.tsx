// components/WeatherSection.tsx
"use client";

import { useEffect, useState, useRef } from "react";

type WeatherItem = {
  city: string;
  t: number | string;
  hu: number | string;
  weather_desc: string;
  image?: string;
  jam: string;
};

const CITIES = [
  { name: "Balikpapan", code: "64.72.01.1002" },
  { name: "Samarinda", code: "64.72.01.1002" },
  { name: "Bontang", code: "64.72.01.1002" },
  { name: "Tenggarong", code: "64.72.01.1002" },
  { name: "Kutai Timur", code: "64.72.01.1002" },
  { name: "Berau", code: "64.72.01.1002" },
  { name: "Kutai Barat", code: "64.72.01.1002" },
  { name: "Penajam Paser Utara", code: "64.72.01.1002" },
  { name: "Paser", code: "64.72.01.1002" },
  { name: "Mahakam Ulu", code: "64.72.01.1002" },
  { name: "Kutai Kartanegara", code: "64.72.01.1002" }
];

export default function WeatherSection() {
  const [data, setData] = useState<WeatherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // fetch data
  useEffect(() => {
    let mounted = true;
    async function fetchWeather() {
      try {
        const promises = CITIES.map(async (c) => {
          const res = await fetch(
            `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${c.code}`
          );
          const json = await res.json();
          const forecast = json?.data?.[0]?.cuaca?.[0]?.[0] ?? null;
          return {
            city: c.name,
            t: forecast?.t ?? "-",
            hu: forecast?.hu ?? "-",
            weather_desc: forecast?.weather_desc ?? "N/A",
            image: forecast?.image ?? "",
            jam: forecast?.local_datetime
              ? new Date(forecast.local_datetime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              })
              : "-",
          } as WeatherItem;
        });

        const results = await Promise.all(promises);
        if (mounted) setData(results);
      } catch (err) {
        console.error("Gagal ambil data cuaca:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchWeather();
    return () => {
      mounted = false;
    };
  }, []);

  // auto scroll (desktop only)
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;

    const interval = setInterval(() => {
      if (!isPaused && window.innerWidth >= 768) {
        el.scrollBy({ left: 1, behavior: "smooth" });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollTo({ left: 0 });
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="grid max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Prakiraan Cuaca Kalimantan Timur
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {data.map((item, idx) => (
              <WeatherCard key={idx} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WeatherCard({ item }: { item: WeatherItem }) {
  return (
    <article className="flex-shrink-0 w-40 sm:w-44 bg-white rounded-xl shadow-sm border border-blue-100 p-3 flex flex-col items-center text-center transition-transform hover:scale-105">
      <p className="text-[11px] text-gray-500 mt-1">
          {item.jam} WITA
      </p>
      <div className="w-12 h-12 mb-2 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.weather_desc}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-2xl">☁️</span>
        )}
      </div>
      <h3 className="font-medium text-xs text-gray-800 mb-1 line-clamp-2">
        {item.city}
      </h3>
      <p className="text-blue-400 text-lg font-bold leading-none">
        {item.t}°C
      </p>
      <p className="text-[11px] text-gray-500 mt-1">
        {item.weather_desc}
        <span className="block text-[10px] text-gray-400">RH: {item.hu}%</span>
      </p>
      
    </article>
  );
}
