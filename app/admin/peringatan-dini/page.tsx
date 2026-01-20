"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  CloudRain, Sun, Save, RotateCcw, FileText, Trash2, Plus, Calendar, Loader2 
} from "lucide-react";
// Import Server Actions yang baru kita buat
import { 
  getPdieData, updateRegionStatus, updatePeriodeLabel, resetAllRegions, uploadDocument, deleteDocument 
} from "./actions";

// Tipe Data
type WarningLevel = "AWAS" | "SIAGA" | "WASPADA" | "AMAN";

interface RegionData {
  id: string;
  name: string;
  rain_level: WarningLevel;
  drought_level: WarningLevel;
}

interface DokumenItem {
  id: string;
  title: string;
  date: string;
  type: string;
  file_path: string;
}

// Helper warna
const getStatusColor = (level: string) => {
  switch (level) {
    case "AWAS": return "bg-red-100 text-red-700 border-red-200";
    case "SIAGA": return "bg-orange-100 text-orange-700 border-orange-200";
    case "WASPADA": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "AMAN": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-slate-100 text-slate-600";
  }
};

export default function AdminPeringatanPage() {
  const [activeTab, setActiveTab] = useState<"HUJAN" | "KEKERINGAN">("HUJAN");
  const [isPending, startTransition] = useTransition(); // Untuk loading state saat aksi server
  const [isLoading, setIsLoading] = useState(true); // Loading awal fetch data

  // State Data (Sekarang kosong dulu, diisi useEffect)
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [periodeLabel, setPeriodeLabel] = useState("");
  const [documents, setDocuments] = useState<DokumenItem[]>([]);
  
  // State Form Upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");

  // 1. Fetch Data saat Mount
  useEffect(() => {
    async function initData() {
      try {
        const data = await getPdieData();
        // @ts-ignore - Supabase types mapping
        setRegions(data.regions);
        setPeriodeLabel(data.periodeLabel);
        // @ts-ignore
        setDocuments(data.documents);
      } catch (e) {
        console.error("Gagal ambil data", e);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // 2. Handler: Update Status Wilayah (Realtime Optimistic UI)
  const handleStatusChange = async (id: string, newLevel: WarningLevel) => {
    // Update UI dulu (Optimistic) agar terasa cepat
    setRegions(prev => prev.map(r => r.id === id ? {
       ...r, 
       rain_level: activeTab === "HUJAN" ? newLevel : r.rain_level,
       drought_level: activeTab === "KEKERINGAN" ? newLevel : r.drought_level
    } : r));

    // Kirim ke Server
    startTransition(async () => {
      try {
        await updateRegionStatus(id, activeTab, newLevel);
      } catch (err) {
        alert("Gagal update status server!");
        // Harusnya revert UI di sini jika gagal, tapi untuk simpel kita biarkan
      }
    });
  };

  // 3. Handler: Simpan Label Periode
  const handleSaveLabel = () => {
    startTransition(async () => {
      await updatePeriodeLabel(periodeLabel);
      alert("Periode Dasarian diperbarui!");
    });
  };

  // 4. Handler: Reset Semua
  const handleResetAll = () => {
    if (confirm(`Reset semua status ${activeTab} menjadi AMAN?`)) {
      startTransition(async () => {
        await resetAllRegions(activeTab);
        // Refresh data lokal
        const data = await getPdieData();
        // @ts-ignore
        setRegions(data.regions);
      });
    }
  };

  // 5. Handler: Upload Dokumen
  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return alert("Pilih file dan isi judul!");
    
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    formData.append("type", activeTab); // Upload sesuai tab aktif
    formData.append("date", new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }));

    startTransition(async () => {
        try {
            await uploadDocument(formData);
            // Reset Form & Refresh
            setUploadFile(null);
            setUploadTitle("");
            const data = await getPdieData();
            // @ts-ignore
            setDocuments(data.documents);
            alert("Dokumen berhasil diupload!");
        } catch (e) {
            console.error(e);
            alert("Gagal upload dokumen.");
        }
    });
  };

  // 6. Handler: Hapus Dokumen
  const handleDeleteDoc = (id: string, path: string) => {
    if(confirm("Hapus dokumen ini permanen?")) {
        startTransition(async () => {
            await deleteDocument(id, path);
            setDocuments(prev => prev.filter(d => d.id !== id));
        });
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin" /> Memuat Data Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Peringatan Dini</h1>
                <p className="text-slate-500 text-sm">Update status dasarian & dokumen.</p>
            </div>
            {isPending && <div className="text-blue-600 text-sm font-bold flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"><Loader2 className="w-4 h-4 animate-spin"/> Menyimpan...</div>}
        </div>

        {/* 1. PERIODE DASARIAN */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">Label Periode Aktif</label>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        value={periodeLabel}
                        onChange={(e) => setPeriodeLabel(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 font-medium text-slate-700"
                        placeholder="Contoh: Dasarian II Januari 2026"
                    />
                </div>
                <button onClick={handleSaveLabel} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Update Label
                </button>
            </div>
        </div>

        {/* 2. TABEL STATUS UPDATE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
                <button onClick={() => setActiveTab("HUJAN")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === "HUJAN" ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>
                    <CloudRain className="w-4 h-4" /> Status Hujan
                </button>
                <button onClick={() => setActiveTab("KEKERINGAN")} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === "KEKERINGAN" ? "bg-orange-50 text-orange-700 border-b-2 border-orange-600" : "text-slate-500 hover:bg-slate-50"}`}>
                    <Sun className="w-4 h-4" /> Status Kekeringan
                </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Daftar Wilayah</span>
                <button onClick={handleResetAll} className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 font-medium px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Semua
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {regions.map((item) => {
                    const currentLevel = activeTab === "HUJAN" ? item.rain_level : item.drought_level;
                    return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                            <span className="font-semibold text-slate-700">{item.name}</span>
                            <div className="relative">
                                <select
                                    value={currentLevel}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value as WarningLevel)}
                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-md text-xs font-bold uppercase cursor-pointer border ${getStatusColor(currentLevel)}`}
                                >
                                    <option value="AMAN">🟢 Aman</option>
                                    <option value="WASPADA">🟡 Waspada</option>
                                    <option value="SIAGA">🟠 Siaga</option>
                                    <option value="AWAS">🔴 Awas</option>
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* 3. UPLOAD DOKUMEN */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Upload Dokumen ({activeTab})
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Judul Dokumen..." 
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <input 
                    type="file" 
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" 
                />
                <button onClick={handleUpload} disabled={isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isPending ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus className="w-4 h-4" />} Upload
                </button>
            </div>

            <div className="space-y-3">
                {documents.filter(d => d.type === activeTab).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded bg-white border ${doc.type === 'HUJAN' ? 'border-blue-200 text-blue-600' : 'border-orange-200 text-orange-600'}`}>
                                {doc.type === 'HUJAN' ? <CloudRain className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700">{doc.title}</h4>
                                <p className="text-xs text-slate-400">{doc.date}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteDoc(doc.id, doc.file_path)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}