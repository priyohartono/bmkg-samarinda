import WeatherSection from "@/components/WeatherSection";
import EarthquakeSection from "@/components/EarthquakeSection";
import NewsSection from "@/components/NewsSection";
import FlyerSection from "@/components/FlyerSection";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Header */}
      <Hero/>

      {/* Section 2: Cuaca */}
      <WeatherSection />

      {/* Section 3: Gempa Terkini */}
      <EarthquakeSection />

      {/* Section 4: Berita */}
      <NewsSection />

      {/* Section 5: Flyers */}
      <FlyerSection />
    </>
  );
}
