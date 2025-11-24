import type { Metadata } from "next";
import BuletinClient from "@/components/component-publikasi/BuletinClient";

export const metadata: Metadata = {
  title: "Arsip Buletin | BMKG Samarinda",
  description: "Unduh buletin cuaca bulanan dan laporan iklim dari Stasiun Meteorologi APT Pranoto Samarinda.",
};

export default function BuletinPage() {
  return <BuletinClient />;
}