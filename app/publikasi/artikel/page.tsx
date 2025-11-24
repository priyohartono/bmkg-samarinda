import type { Metadata } from "next";
import PublikasiListClient from "@/components/component-publikasi/PublikasiListClient";

export const metadata: Metadata = {
  title: "Artikel & Makalah | BMKG Samarinda",
  description: "Repository publikasi ilmiah, artikel populer, dan jurnal meteorologi klimatologi.",
};

export default function ArtikelMakalahPage() {
  return <PublikasiListClient />;
}