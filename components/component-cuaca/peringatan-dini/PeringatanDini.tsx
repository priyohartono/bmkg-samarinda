"use client";

import { useEffect, useState } from "react";

type PeringatanData = {
  url: string;
  urlText?: string;
  error?: string;
};

export default function PeringatanDini({ kode = "CKT" }: { kode?: string }) {
  const [data, setData] = useState<PeringatanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear().toString();
    const mm = (today.getMonth() + 1).toString().padStart(2, "0");
    const dd = today.getDate().toString().padStart(2, "0");
    const tanggal = `${yyyy}-${mm}-${dd}`;

    fetch(`/api/peringatan?kode=${encodeURIComponent(kode)}&tanggal=${tanggal}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setData({ error: String(err), url: "" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [kode]);

  if (loading) {
    return <div className="text-gray-500">Memuat peringatan dini…</div>;
  }
  if (!data) {
    return <div className="text-red-600">Tidak ada data peringatan.</div>;
  }
  if (data.error) {
    return <div className="text-red-600">Error: {data.error}</div>;
  }

  return (
    <div className="space-y-4">
      <img src={data.url} alt="Infografis Peringatan Dini" className="w-full object-contain" />
      {data.urlText && (
        <img src={data.urlText} alt="Teks Peringatan Dini" className="w-full object-contain" />
      )}
    </div>
  );
}
