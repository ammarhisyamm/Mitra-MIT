import { useMemo, useState } from "react";
import { ArrowLeftToLine, ChevronDown, ChevronRight, LayoutGrid, User } from "lucide-react";
import "@fontsource-variable/inter";
import {
  DAY_HEADERS, MONTHS, MONTH_FULL, NOV_SUMMARY, RESULTS, SEED_PLANS, TODAY,
  dateLabel, emptyPlan, key, planTotals, rupiah, rupiahShort, type Metric, type SoPlan,
} from "./data";
import { DetailModal, EditModal, RingkasanModal } from "./Modals";

const TONE = {
  green: { bg: "#e9f6eb", fg: "#24663f", bar: "#24663f" },
  red: { bg: "#fdebe9", fg: "#d92d20", bar: "#ef402b" },
  blue: { bg: "#e1e7f2", fg: "#2852a3", bar: "#2852a3" },
  gray: { bg: "#f1f1f1", fg: "#384047", bar: "#384047" },
} as const;
type Tone = keyof typeof TONE;

const GROUPS = [
  { title: "Menu", active: true, subs: ["Target SO", "Sub Menu", "Sub Menu", "Sub Menu", "Sub Menu", "Sub Menu"] },
  { title: "Menu", active: false, subs: ["Sub Menu", "Sub Menu"] },
  { title: "Organisasi", active: false, subs: ["Sub Menu", "Sub Menu", "Sub Menu"] },
];

function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      style={{ width: collapsed ? 76 : 260 }}
      className="sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-[#e2e5e8] bg-white transition-[width]"
    >
      <div className="h-16 shrink-0 px-5 pt-5">
        <img src="/dashboard/logo.png" alt="Mulia Informasi Teknologi" className="h-[31px] w-auto" />
      </div>
      <nav className="mt-1 flex-1 overflow-y-auto px-5 pb-6">
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            <div
              className="relative flex h-12 items-center rounded-lg px-[18px]"
              style={{ background: g.active ? "#f0f5fe" : "transparent", color: g.active ? "#2852a3" : "#4b5563" }}
            >
              {g.active && <span className="absolute top-0 left-0 h-full w-1 rounded-sm bg-[#2852a3]" />}
              <span className="size-6 shrink-0 rounded-full border-[1.5px] border-current" />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-[16px]">{g.title}</span>
                  <span className="size-3.5 rounded-full border-[1.5px] border-current" />
                </>
              )}
            </div>
            {!collapsed && (
              <div className="py-1">
                {g.subs.map((s, si) => {
                  const act = g.active && si === 0;
                  return (
                    <div key={si} className="flex h-11 items-center pl-[56px] text-[16px]" style={{ color: act ? "#2852a3" : "#4b5563" }}>
                      <span className="mr-2 size-[3px] rounded-full bg-current" />
                      {s}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Header({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-[#e2e5e8] bg-white px-8">
      <button
        aria-label="Ciutkan sidebar" onClick={onToggle}
        className="absolute top-4 -left-4 grid size-8 cursor-pointer place-items-center rounded-full border border-[#e2e5e8] bg-white text-[#1f2937]"
      >
        <ArrowLeftToLine size={16} style={{ transform: collapsed ? "scaleX(-1)" : undefined }} />
      </button>
      <div className="flex items-center gap-2 text-[16px]">
        <LayoutGrid size={16} className="text-[#4b5563]" />
        <span className="text-[#6b7280]">Menu</span>
        <ChevronRight size={16} className="text-[#9ca3af]" />
        <span className="font-medium text-[#1f2937]">Target SO</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="grid size-[42px] place-items-center rounded-full bg-[#f0f5fe] text-[20px] font-semibold text-[#2852a3]">A</span>
        <div className="leading-5">
          <div className="text-[16px] font-medium text-[#1f2937]">Joko Susanto</div>
          <div className="text-[14px] text-[#9ca3af]">Role</div>
        </div>
        <ChevronDown size={18} className="ml-1 text-[#6b7280]" />
      </div>
    </header>
  );
}

function MetricRow({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const c = TONE[tone];
  return (
    <div className="flex h-[25px] items-center justify-between rounded px-[6px] text-[13px]" style={{ background: c.bg, color: c.fg, borderLeft: `3px solid ${c.bar}` }}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

const toneOf = (m: Metric, today: boolean): Tone => (today ? "blue" : m.actual >= m.target ? "green" : "red");

type CellInfo = { y: number; m: number; d: number; other: boolean; col: number };

function buildGrid(y: number, m: number): CellInfo[] {
  // Desain Figma menampilkan 1 Nov 2026 pada hari Selasa (30 Okt di kolom Senin), jadi dipakai apa adanya.
  const first = y === TODAY.y && m === TODAY.m ? 1 : (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const total = Math.ceil((first + days) / 7) * 7;
  return Array.from({ length: total }, (_, i) => {
    const dt = new Date(y, m, 1 - first + i);
    return { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate(), other: dt.getMonth() !== m, col: i % 7 };
  });
}

const cmp = (c: { y: number; m: number; d: number }) => c.y * 10000 + c.m * 100 + c.d;

function Calendar({
  year, month, plans, onPast, onFuture,
}: {
  year: number; month: number; plans: Record<string, SoPlan[]>;
  onPast: (c: CellInfo) => void; onFuture: (c: CellInfo) => void;
}) {
  const cells = useMemo(() => buildGrid(year, month), [year, month]);
  const todayN = cmp(TODAY);
  return (
    <section className="overflow-hidden rounded-xl border border-[#dfe4ea] bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <h2 className="m-0 text-[20px] font-semibold text-[#1f2937]">Kalender {MONTH_FULL[month]} {year}</h2>
        <div className="flex items-center gap-4 text-[14px] text-[#4b5563]">
          {([["Achieve", "green"], ["Not Achieve", "red"], ["Active", "blue"], ["Scheduled", "gray"]] as const).map(([t, tone]) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="size-[6px]" style={{ background: TONE[tone].bar }} />
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="grid h-12 grid-cols-7 border-y border-[#dfe4ea] bg-[#f1f1f1] text-[15px] font-medium text-[#4b5563]">
        {DAY_HEADERS.map((h) => <div key={h} className="flex items-center px-3">{h}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((c, i) => {
          const k = key(c.y, c.m, c.d);
          const n = cmp(c);
          const isToday = n === todayN;
          const res = !c.other ? RESULTS[k] : undefined;
          const plan = !c.other && n > todayN ? plans[k] : undefined;
          const pt = plan ? planTotals(plan) : null;
          const planSo = plan ? plan.filter((p) => p.on).length : 0;
          const clickable = !c.other && (res ? n <= todayN : n > todayN);
          const weekend = c.col >= 5;
          const badgeColor = c.other ? "#d1d5db" : isToday ? "#fff" : weekend ? "#ef402b" : "#1f2937";
          const last = i >= cells.length - 7;
          return (
            <div
              key={i}
              onClick={() => clickable && (res ? onPast(c) : onFuture(c))}
              className={`h-[175px] px-3 pt-3 ${clickable ? "cursor-pointer hover:bg-[#fafbfc]" : ""} ${c.col < 6 ? "border-r" : ""} ${last ? "" : "border-b"} border-[#dfe4ea]`}
            >
              <span
                className="grid size-[31px] place-items-center rounded-full border text-[16px] font-medium"
                style={{ color: badgeColor, borderColor: isToday ? "#2852a3" : c.other ? "#eceef1" : "#e5e7eb", background: isToday ? "#2852a3" : "#fff" }}
              >
                {c.d}
              </span>
              {(res || (plan && pt && planSo > 0)) && (
                <>
                  <div className="mt-2 flex h-5 items-center gap-1.5 text-[15px] text-[#4b5563]">
                    <User size={16} /> {res ? res.so : planSo} SO
                  </div>
                  <div className="mt-1 flex flex-col gap-[6px]">
                    {res ? (
                      <>
                        <MetricRow label="Leads" value={`${res.leads.actual}/${res.leads.target}`} tone={toneOf(res.leads, isToday)} />
                        <MetricRow label="Booking" value={`${res.booking.actual}/${res.booking.target}`} tone={toneOf(res.booking, isToday)} />
                        <MetricRow label="Transaksi" value={rupiahShort(res.nominal.actual)} tone={toneOf(res.nominal, isToday)} />
                      </>
                    ) : (
                      <>
                        <MetricRow label="Leads" value={String(pt!.leads)} tone="gray" />
                        <MetricRow label="Booking" value={String(pt!.booking)} tone="gray" />
                        <MetricRow label="Transaksi" value={rupiahShort(pt!.nominal)} tone="gray" />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [year, setYear] = useState(TODAY.y);
  const [month, setMonth] = useState(TODAY.m);
  const [plans, setPlans] = useState<Record<string, SoPlan[]>>(SEED_PLANS);
  const [modal, setModal] = useState<
    null | { type: "ringkasan" } | { type: "past" | "edit"; c: CellInfo }
  >(null);

  const isNov = year === TODAY.y && month === TODAY.m;
  const summary = useMemo(() => {
    if (isNov) return NOV_SUMMARY;
    let leads = 0, booking = 0, nominal = 0;
    for (const [k, p] of Object.entries(plans)) {
      const [y, m] = k.split("-").map(Number);
      if (y === year && m - 1 === month) {
        const t = planTotals(p);
        leads += t.leads; booking += t.booking; nominal += t.nominal;
      }
    }
    return { leads, booking, nominal, todayLeads: 0, todayBooking: 0, todayNominal: 0 };
  }, [isNov, plans, year, month]);

  const cols = [
    { label: "Total Target Leads", value: String(summary.leads), today: String(summary.todayLeads) },
    { label: "Total Target Booking", value: String(summary.booking), today: String(summary.todayBooking) },
    { label: "Total Target Transaksi", value: rupiah(summary.nominal), today: rupiah(summary.todayNominal) },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#1f2937]" style={{ fontFamily: "'Inter Variable', Inter, system-ui, sans-serif" }}>
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex flex-col gap-6 px-6 pt-[23px] pb-8">
          <div className="flex flex-col gap-3.5">
            <h1 className="m-0 text-[24px] leading-8 font-semibold">Target SO</h1>
            <div className="flex items-center gap-3">
              <label className="relative">
                <select
                  value={year} onChange={(e) => setYear(Number(e.target.value))}
                  className="h-[46px] w-[99px] cursor-pointer appearance-none rounded-lg border border-[#dfe4ea] bg-white pr-8 pl-3 text-[16px] text-[#1f2937]"
                >
                  {[2025, 2026, 2027].map((y) => <option key={y}>{y}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute top-3.5 right-3 text-[#4b5563]" />
              </label>
              <span className="h-5 w-px bg-[#dfe4ea]" />
              <div className="flex flex-1 gap-3">
                {MONTHS.map((mn, i) => {
                  const on = i === month;
                  const live = year === TODAY.y && i === TODAY.m;
                  return (
                    <button
                      key={mn} onClick={() => setMonth(i)}
                      className={`relative h-[46px] flex-1 cursor-pointer rounded-lg border text-[16px] ${on ? "border-[#2852a3] bg-[#2852a3] font-medium text-white" : "border-[#dfe4ea] bg-white text-[#1f2937]"}`}
                    >
                      {live && (
                        <span className="absolute -top-3 left-0 flex items-center gap-1 rounded-full bg-[#dce9ff] px-2 py-0.5 text-[12px] leading-4 font-medium text-[#2852a3]">
                          <span className="size-2 rounded-full bg-[#2852a3]" /> Aktif
                        </span>
                      )}
                      {mn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-[#dfe4ea] bg-white">
            <div className="flex h-[57px] items-center justify-between border-b border-[#dfe4ea] px-4">
              <h2 className="m-0 text-[20px] font-semibold">Ringkasan Target</h2>
              <button onClick={() => setModal({ type: "ringkasan" })} className="flex cursor-pointer items-center gap-1 border-0 bg-transparent text-[16px] font-medium text-[#2852a3]">
                Detail <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 pt-3.5 pb-[13px]">
              {cols.map((c, i) => (
                <div key={c.label} className={`px-4 ${i === 0 ? "" : "border-l border-[#dfe4ea]"}`}>
                  <div className="text-[16px] leading-6 text-[#4b5563]">{c.label}</div>
                  <div className="mt-0.5 text-[24px] leading-8 font-medium">{c.value}</div>
                  <div className="mt-1 text-[14px] leading-5 text-[#6b7280]">
                    Total Target Hari ini: <span className="ml-1 font-medium text-[#1f2937]">{c.today}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Calendar
            year={year} month={month} plans={plans}
            onPast={(c) => setModal({ type: "past", c })}
            onFuture={(c) => setModal({ type: "edit", c })}
          />
        </main>
      </div>

      {modal?.type === "ringkasan" && <RingkasanModal onClose={() => setModal(null)} />}
      {modal?.type === "past" && (
        <DetailModal dateKey={key(modal.c.y, modal.c.m, modal.c.d)} label={dateLabel(modal.c.y, modal.c.m, modal.c.d)} onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (() => {
        const k = key(modal.c.y, modal.c.m, modal.c.d);
        return (
          <EditModal
            key={k} label={dateLabel(modal.c.y, modal.c.m, modal.c.d)} initial={plans[k] ?? emptyPlan()}
            onSave={(p) => { setPlans((cur) => ({ ...cur, [k]: p })); setModal(null); }}
            onClose={() => setModal(null)}
          />
        );
      })()}
    </div>
  );
}
