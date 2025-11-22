import PrakiraanClient from "@/components/component-cuaca/prakiraan-cuaca/PrakiraanClient";

export default function PrakiraanPage() {
  return (
    <main className="container w-max-7xl mx-auto text-center p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Peta Interaktif Prakiraan Cuaca</h1>
      <p className="text-gray-600">
        Klik kabupaten untuk melihat batas wilayah. Jika data tersedia, klik
        kecamatan untuk langsung menampilkan prakiraan cuaca dari seluruh
        kelurahan di dalamnya.
      </p>
      <PrakiraanClient />
    </main>
  );
}
