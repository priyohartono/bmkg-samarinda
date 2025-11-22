import type { Metadata } from "next";
import BeritaClient from "@/components/component-publikasi/BeritaClient";

export const metadata: Metadata = {
  title: "Berita & Kegiatan | BMKG Samarinda",
  description: "Berita terkini, kegiatan operasional, dan edukasi meteorologi dari Stasiun Meteorologi APT Pranoto Samarinda.",
  // Open Graph image bisa ditambahkan di sini nanti
};

export default function BeritaPage() {
  return <BeritaClient />;
}