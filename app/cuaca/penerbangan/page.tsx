// Impor komponen klien yang baru saja dibuat
import PenerbanganClient from "@/components/component-cuaca/cuaca-penerbangan/PenerbanganClient";

// Metadata tetap di sini karena ini adalah Server Component
export const metadata = {
  title: "Prakiraan Penerbangan | BMKG Samarinda",
  description:
    "Informasi prakiraan cuaca penerbangan termasuk data Wind & Temperature Chart serta SIGWX (Significant Weather Chart) dari BMKG Aviation.",
};

export default function PenerbanganPage() {
  return <PenerbanganClient />;
}