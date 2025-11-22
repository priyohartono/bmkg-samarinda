// file: components/component-cuaca/useKecamatanSearch.ts

// Langsung impor daftar yang sudah kita buat
import { allKecamatanOptions } from '@/data/search-index';

// Tipe ini juga bisa diimpor dari file yang sama
export type { KecamatanOption } from '@/data/search-index';

export const useKecamatanSearch = () => {
  // Hook ini sekarang hanya bertugas mengembalikan daftar yang sudah jadi.
  return allKecamatanOptions;
};