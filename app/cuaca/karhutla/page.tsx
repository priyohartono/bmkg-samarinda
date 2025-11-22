import FFMCSection from "@/components/component-cuaca/karhutla/FFMCSection";
import FWISection from "@/components/component-cuaca/karhutla/FWISection";
import PolarHotspotSection from "@/components/component-cuaca/karhutla/PolarHotspotSection";
import GeoHotspotSection from "@/components/component-cuaca/karhutla/GeoHotspotSection";

export const metadata = {
  title: "Peringatan Kebakaran Hutan dan lahan | BMKG Samarinda",
  description:
    "Peringatan Kebakaran Hutan dan Lahan berdasarkan citra satelit di wilayah Kalimantan Timur.",
};

export default function SatelitPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
            Peringatan Kebakaran Hutan dan Lahan
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Visualisasi citra satelit cuaca terbaru dari{" "}
            <strong>Himawari-9</strong> dan{" "}
            <strong>HCAI (High Cloud Analysis Indonesia)</strong>.
          </p>
        </header>

        {/* Dua kartu berdampingan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FFMCSection />
          <FWISection />
          <PolarHotspotSection />
          <GeoHotspotSection />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} BMKG – Stasiun Meteorologi Samarinda.
          Data diperoleh dari portal Satelit BMKG (Inderaja).
        </footer>
      </div>
    </main>
  );
}
