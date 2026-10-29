import { useMemo } from "react";

/*
 * Data and helpers for the vector dummy map. Coordinates are world units on a WORLD x WORLD canvas.
 */

export const WORLD = 1400;

export type MapView = { x: number; y: number; z: number };
export type MapPoint = { x: number; y: number };

export type MapPoi = {
  id: string;
  name: string;
  address: string;
  x: number;
  y: number;
  kind: "office" | "market" | "home" | "mosque" | "school" | "mall" | "hospital";
};

export const V_ROADS = [
  { x: 100, name: "Jl. Gading Kirana" },
  { x: 330, name: "Jl. Kelapa Hybrida" },
  { x: 560, name: "Jl. Boulevard Raya", major: true },
  { x: 790, name: "Jl. Kelapa Nias" },
  { x: 1020, name: "Jl. Pegangsaan Dua" },
  { x: 1250, name: "Jl. Raya Bekasi", major: true },
];

export const H_ROADS = [
  { y: 120, name: "Jl. Boulevard Barat" },
  { y: 360, name: "Jl. Kelapa Puan" },
  { y: 600, name: "Jl. Perintis Kemerdekaan", major: true },
  { y: 840, name: "Jl. Pulomas Barat" },
  { y: 1080, name: "Jl. Raya Cakung" },
  { y: 1300, name: "Jl. Penggilingan" },
];

export const AREAS = [
  { x: 330, y: 250, name: "Kelapa Gading Barat", city: "Kota Jakarta Utara" },
  { x: 1020, y: 250, name: "Kelapa Gading Timur", city: "Kota Jakarta Utara" },
  { x: 330, y: 960, name: "Pulo Gadung", city: "Kota Jakarta Timur" },
  { x: 1020, y: 960, name: "Cakung Barat", city: "Kota Jakarta Timur" },
];

export const RIVER =
  "M 1080 -20 C 1050 160, 1010 300, 1000 460 S 960 760, 1010 920 S 1100 1200, 1060 1420";
export const CANALS = [
  "M -20 520 C 120 500, 260 540, 380 520",
  "M 700 300 C 780 340, 860 360, 1000 330",
  "M 760 980 C 720 860, 690 760, 700 640",
  "M 1000 760 C 1120 740, 1240 700, 1420 690",
  "M 150 1200 C 260 1120, 330 1020, 360 900",
];
export const PONDS = [
  "M 820 560 l 46 -8 l 10 40 l -22 30 l -40 -6 Z",
  "M 1180 300 q 40 -20 70 6 q 10 40 -30 52 q -44 4 -40 -58 Z",
  "M 230 980 q 50 -24 86 4 q 8 34 -40 44 q -52 0 -46 -48 Z",
];
export const PATCHES = [
  { d: "M 120 860 q 80 -30 140 10 q 20 60 -40 90 q -90 10 -100 -100 Z", fill: "#f8efd9" },
  { d: "M 820 1120 q 90 -40 160 0 q 10 70 -70 90 q -90 0 -90 -90 Z", fill: "#f8efd9" },
  { d: "M 1120 1040 h 120 v 120 h -120 Z", fill: "#eef2f6" },
  { d: "M 620 140 h 140 v 110 h -140 Z", fill: "#eef2f6" },
];
export const TOLL = "M 300 -20 C 380 220, 450 420, 470 640 S 500 1100, 540 1420";
export const TOLL_RAMP = "M 466 560 C 520 420, 640 380, 760 330 S 980 180, 1110 -20";

export const USER_LOCATION: MapPoint = { x: 588, y: 640 };

export const MAP_POIS: MapPoi[] = [
  {
    id: "balai",
    name: "Balai Desa Kelurahan Pilumpanua",
    address: "Jalan Boulevard Raya, RT 13/RW 014, Klp Gading Timur, Kelapa Gading, Kota Jakarta Utara",
    x: 640,
    y: 450,
    kind: "office",
  },
  {
    id: "koperasi",
    name: "Koperasi Desa Smart Tower",
    address: "Jl Gading Ruko Kirana 3 Barat, Wajo, Sulawesi Selatan",
    x: 410,
    y: 520,
    kind: "office",
  },
  {
    id: "kirana",
    name: "Perumahan Gading Kirana",
    address: "Jl. Gading Kirana Timur, Kelapa Gading Barat, Kota Jakarta Utara",
    x: 180,
    y: 270,
    kind: "home",
  },
  {
    id: "pasar",
    name: "Pasar Pagi Kelapa Gading",
    address: "Jl. Boulevard Bar. Raya, Kelapa Gading Barat, Kota Jakarta Utara",
    x: 470,
    y: 180,
    kind: "market",
  },
  {
    id: "masjid",
    name: "Masjid Al-Musyawarah",
    address: "Jl. Kelapa Nias, Kelapa Gading Timur, Kota Jakarta Utara",
    x: 720,
    y: 270,
    kind: "mosque",
  },
  {
    id: "sekolah",
    name: "SDN Kelapa Gading 01",
    address: "Jl. Pulomas Barat, Pulo Gadung, Kota Jakarta Timur",
    x: 240,
    y: 760,
    kind: "school",
  },
  {
    id: "mall",
    name: "Mal Kelapa Gading",
    address: "Jl. Boulevard Raya, Kelapa Gading Timur, Kota Jakarta Utara",
    x: 680,
    y: 760,
    kind: "mall",
  },
  {
    id: "rs",
    name: "RS Mitra Keluarga",
    address: "Jl. Raya Bekasi, Cakung Barat, Kota Jakarta Timur",
    x: 1150,
    y: 730,
    kind: "hospital",
  },
  {
    id: "pkp",
    name: "Pasar Cakung",
    address: "Jl. Raya Cakung, Cakung Barat, Kota Jakarta Timur",
    x: 1120,
    y: 1010,
    kind: "market",
  },
];

export const POI_COLORS: Record<MapPoi["kind"], string> = {
  office: "#2852a3",
  market: "#e8710a",
  home: "#7b61c9",
  mosque: "#13a06b",
  school: "#a0602a",
  mall: "#d6336c",
  hospital: "#d73926",
};

export const POI_GLYPH: Record<MapPoi["kind"], string> = {
  office: "M-3.5 3.5V-2l3.5-2.5L3.5-2v5.5Z",
  market: "M-4-1h8l-1 4.5h-6Zm1.5-1 1.5-2.5h2L5-2",
  home: "M-4 0 0-3.5 4 0v4h-8Z",
  mosque: "M-3.5 4v-3a3.5 3.5 0 0 1 7 0v3Zm3.5-8.5v2",
  school: "M-4.5-1 0-3.5 4.5-1 0 1.5Zm1.5 1v2.5l3 1.5 3-1.5V0",
  mall: "M-3.5-1.5h7v5.5h-7Zm1.5 0v-1a2 2 0 0 1 4 0v1",
  hospital: "M-1.2-4h2.4v2.8H4v2.4H1.2V4h-2.4V1.2H-4v-2.4h2.8Z",
};

export function clampView(view: MapView): MapView {
  return {
    x: Math.min(WORLD, Math.max(0, view.x)),
    y: Math.min(WORLD, Math.max(0, view.y)),
    z: Math.min(3, Math.max(0.55, view.z)),
  };
}

/** Fake reverse geocoder: nearest landmark, otherwise nearest street + house number. */
export function resolvePoint(point: MapPoint) {
  const poi = MAP_POIS.find((item) => Math.hypot(item.x - point.x, item.y - point.y) < 34);
  if (poi) return { name: poi.name, address: poi.address };
  const v = V_ROADS.reduce((best, road) =>
    Math.abs(road.x - point.x) < Math.abs(best.x - point.x) ? road : best,
  );
  const h = H_ROADS.reduce((best, road) =>
    Math.abs(road.y - point.y) < Math.abs(best.y - point.y) ? road : best,
  );
  const onVertical = Math.abs(v.x - point.x) <= Math.abs(h.y - point.y);
  const street = onVertical ? v.name : h.name;
  const along = onVertical ? point.y : point.x;
  const number = Math.max(1, Math.round(along / 14));
  // AREAS is ordered NW, NE, SW, SE.
  const area = AREAS[(point.x >= WORLD / 2 ? 1 : 0) + (point.y >= WORLD / 2 ? 2 : 0)];
  return {
    name: `${street} No. ${number}`,
    address: `${street} No. ${number}, ${area.name}, ${area.city}`,
  };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Smoothly animate a view towards a target. Returns a cancel function. */
export function animateView(
  from: MapView,
  to: MapView,
  apply: (view: MapView) => void,
  done: () => void,
  duration = 520,
) {
  const start = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const k = easeOut(t);
    apply({
      x: from.x + (to.x - from.x) * k,
      y: from.y + (to.y - from.y) * k,
      z: from.z + (to.z - from.z) * k,
    });
    if (t < 1) frame = requestAnimationFrame(tick);
    else done();
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function useMapSearch(query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const streets = [...V_ROADS, ...H_ROADS]
      .filter((road) => road.name.toLowerCase().includes(q))
      .map((road) => {
        const point = "x" in road ? { x: road.x + 1, y: 600 } : { x: 560, y: road.y + 1 };
        return { id: road.name, name: road.name, address: resolvePoint(point).address.split(", ").slice(1).join(", "), ...point };
      });
    const pois = MAP_POIS.filter(
      (poi) => poi.name.toLowerCase().includes(q) || poi.address.toLowerCase().includes(q),
    );
    return [...pois, ...streets].slice(0, 6);
  }, [query]);
}
