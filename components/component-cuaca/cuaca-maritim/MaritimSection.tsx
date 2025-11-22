"use client";

import dynamic from "next/dynamic";

const MaritimMap = dynamic(() => import("./MaritimMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aaspect-[1/1.3] md:aspect-[16/9] flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Memuat peta...</p>
    </div>
  ),
});

interface MaritimSectionProps {
  onPolygonClick: (cardId: string) => void;
  onPelabuhanClick: (pelabuhanId: string) => void;
}

export default function MaritimSection({
  onPolygonClick,
  onPelabuhanClick,
}: MaritimSectionProps) {
  return (
    <MaritimMap
      onPolygonClick={onPolygonClick}
      onPelabuhanClick={onPelabuhanClick}
    />
  );
}
