export interface Pelabuhan {
  nama: string;
  id: string;
  cardId: string; // ID bersih untuk DOM
}

export const daftarPelabuhan: Pelabuhan[] = [
  {
    nama: "Samarinda",
    id: "0194_Samarinda",
    cardId: "card-pelabuhan-samarinda",
  },
  {
    nama: "Semayang, Balikpapan",
    id: "0193_Semayang, Balikpapan",
    cardId: "card-pelabuhan-balikpapan",
  },
  {
    nama: "Tanjung Santan",
    id: "0198_Tanjung Santan",
    cardId: "card-pelabuhan-tanjung-santan",
  },
  {
    nama: "Sangkulirang",
    id: "0199_Sangkuliran",
    cardId: "card-pelabuhan-sangkuliran",
  },
  {
    nama: "Kariangau",
    id: "0419_Karingau",
    cardId: "card-pelabuhan-karingau",
  },
  {
    nama: "Batulicin",
    id: "0532_Batulicin",
    cardId: "card-pelabuhan-batulicin",
  },
  {
    nama: "Pare-pare",
    id: "0207_Pare-pare",
    cardId: "card-pelabuhan-pare-pare",
  },
  {
    nama: "Penajam",
    id: "0418_Penajam",
    cardId: "card-pelabuhan-penajam",
  },
];