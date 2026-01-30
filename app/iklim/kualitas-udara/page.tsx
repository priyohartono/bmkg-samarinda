import type { Metadata } from "next";
import AirQualityView from "@/components/component-cuaca/kualitas-udara/AirQualityView";

export const metadata: Metadata = {
  title: "Kualitas Udara | BMKG APT Pranoto Samarinda",
  description: "Monitoring Kualitas Udara (PM2.5) Kota Samarinda secara real-time.",
};

export default function AirQualityPage() {
  // Hanya merender Client Component
  // Client Component yang akan memanggil API /api/pm25
  return <AirQualityView />;
}