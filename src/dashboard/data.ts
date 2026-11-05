export const TODAY = { y: 2026, m: 10, d: 4 }; // 4 November 2026 (fixed for the prototype)
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const MONTH_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
export const DAY_HEADERS = ["SENIN", "SELASA", "RABU", "KAMIS", "JUM'AT", "SABTU", "MINGGU"];

export const SO_LIST = [
  { id: "so1", name: "Muhammad Syamsul Arifin" },
  { id: "so2", name: "Abdoel Rahman" },
  { id: "so3", name: "Abdoel Hakim" },
  { id: "so4", name: "Arifin Pratama" },
  { id: "so5", name: "Dewi Lestari" },
];

export type Metric = { actual: number; target: number };
export type DayResult = { so: number; leads: Metric; booking: Metric; nominal: Metric };

export const key = (y: number, m: number, d: number) => `${y}-${m + 1}-${d}`;

export const RESULTS: Record<string, DayResult> = {
  [key(2026, 10, 1)]: { so: 5, leads: { actual: 40, target: 40 }, booking: { actual: 30, target: 30 }, nominal: { actual: 20_000_000, target: 20_000_000 } },
  [key(2026, 10, 2)]: { so: 4, leads: { actual: 40, target: 40 }, booking: { actual: 13, target: 15 }, nominal: { actual: 40_000_000, target: 50_000_000 } },
  [key(2026, 10, 3)]: { so: 5, leads: { actual: 38, target: 40 }, booking: { actual: 10, target: 10 }, nominal: { actual: 10_000_000, target: 10_000_000 } },
  [key(2026, 10, 4)]: { so: 5, leads: { actual: 5, target: 40 }, booking: { actual: 0, target: 20 }, nominal: { actual: 25_000_000, target: 25_000_000 } },
};

export type SoPlan = { id: string; on: boolean; leads: number; booking: number; nominal: number };

export const emptyPlan = (): SoPlan[] =>
  SO_LIST.map((s) => ({ id: s.id, on: true, leads: 0, booking: 0, nominal: 0 }));

export const SEED_PLANS: Record<string, SoPlan[]> = {
  [key(2026, 10, 7)]: SO_LIST.map((s) => ({ id: s.id, on: true, leads: 8, booking: 4, nominal: 50_000_000 })),
};

export const planTotals = (p: SoPlan[]) =>
  p.filter((x) => x.on).reduce(
    (a, x) => ({ leads: a.leads + x.leads, booking: a.booking + x.booking, nominal: a.nominal + x.nominal }),
    { leads: 0, booking: 0, nominal: 0 },
  );

export const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
export const rupiahShort = (n: number) =>
  n >= 1_000_000 ? `Rp ${Math.round(n / 1_000_000)}jt` : rupiah(n);

export type SoDetail = { name: string; leads: Metric; booking: Metric; nominal: Metric };

const DETAIL_TODAY: SoDetail[] = [
  { name: "Muhammad Syamsul Arifin", leads: { actual: 9, target: 10 }, booking: { actual: 6, target: 5 }, nominal: { actual: 5_000_000, target: 5_500_000 } },
  { name: "Abdoel", leads: { actual: 9, target: 10 }, booking: { actual: 5, target: 5 }, nominal: { actual: 5_000_000, target: 5_000_000 } },
  { name: "Abdoel", leads: { actual: 10, target: 10 }, booking: { actual: 4, target: 4 }, nominal: { actual: 16_000_000, target: 15_500_000 } },
  { name: "Arifin", leads: { actual: 10, target: 10 }, booking: { actual: 6, target: 6 }, nominal: { actual: 10_000_000, target: 10_000_000 } },
];

const split = (total: number, n: number, i: number) =>
  Math.floor(total / n) + (i < total % n ? 1 : 0);

export function detailFor(k: string): SoDetail[] {
  if (k === key(2026, 10, 4)) return DETAIL_TODAY;
  const r = RESULTS[k];
  if (!r) return [];
  return SO_LIST.slice(0, r.so).map((s, i) => ({
    name: s.name,
    leads: { actual: split(r.leads.actual, r.so, i), target: split(r.leads.target, r.so, i) },
    booking: { actual: split(r.booking.actual, r.so, i), target: split(r.booking.target, r.so, i) },
    nominal: { actual: Math.round(r.nominal.actual / r.so), target: Math.round(r.nominal.target / r.so) },
  }));
}

export const sumDetail = (d: SoDetail[]) =>
  d.reduce(
    (a, x) => ({
      leads: { actual: a.leads.actual + x.leads.actual, target: a.leads.target + x.leads.target },
      booking: { actual: a.booking.actual + x.booking.actual, target: a.booking.target + x.booking.target },
      nominal: { actual: a.nominal.actual + x.nominal.actual, target: a.nominal.target + x.nominal.target },
    }),
    { leads: { actual: 0, target: 0 }, booking: { actual: 0, target: 0 }, nominal: { actual: 0, target: 0 } },
  );

export const RINGKASAN_SO: { name: string; leads: number; booking: number; nominal: number }[] = [
  { name: "Muhammad Syamsul Arifin", leads: 30, booking: 16, nominal: 300_000_000 },
  { name: "Abdoel Rahman", leads: 30, booking: 16, nominal: 300_000_000 },
  { name: "Abdoel Hakim", leads: 30, booking: 16, nominal: 300_000_000 },
  { name: "Arifin Pratama", leads: 30, booking: 16, nominal: 300_000_000 },
  { name: "Dewi Lestari", leads: 30, booking: 16, nominal: 300_000_000 },
];

export const NOV_SUMMARY = {
  leads: 587, booking: 105, nominal: 145_000_000,
  todayLeads: 40, todayBooking: 20, todayNominal: 25_000_000,
};

export const dateLabel = (y: number, m: number, d: number) => `${d} ${MONTH_FULL[m]} ${y}`;
