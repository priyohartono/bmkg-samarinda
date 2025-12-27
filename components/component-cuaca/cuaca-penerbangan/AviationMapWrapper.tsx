"use client";

import dynamic from "next/dynamic";
import { ParsedMetar } from "@/lib/bmkg/aviation-utils";
const AviationMap = dynamic(() => import("./AviationMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function AviationMapWrapper({ airports, onSelect, selectedIcao }: { airports: ParsedMetar[], onSelect: (icao: string) => void, selectedIcao: string }) {
  return <AviationMap airports={airports} onSelect={onSelect} selectedIcao={selectedIcao} />;
}