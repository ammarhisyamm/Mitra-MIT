import { useRef, useState } from "react";
import { CaretDown, CaretRight, ClockCounterClockwise, Crosshair, Info, User } from "@phosphor-icons/react";
import { BottomNav, RadioList, Sheet } from "@/components/mobile";
import { ActivityCard } from "@/screens/ActivityScreens";
import { cn } from "@/lib/cn";
import { activityStatus, rupiah, type Activity } from "@/lib/activity";

type Period = "today" | "week" | "month";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Hari Ini" },
  { value: "week", label: "Minggu Ini" },
  { value: "month", label: "Bulan Ini" },
];

// Dummy achievement numbers per period.
const ACHIEVEMENTS: Record<
  Period,
  {
    leads: { total: number; target: number; steps: [number, number, number] };
    deals: { total: number; target: number; steps: [number, number, number] };
  }
> = {
  today: { leads: { total: 30, target: 40, steps: [10, 10, 10] }, deals: { total: 6, target: 10, steps: [3, 2, 1] } },
  week: { leads: { total: 142, target: 200, steps: [58, 49, 35] }, deals: { total: 31, target: 50, steps: [14, 10, 7] } },
  month: { leads: { total: 512, target: 800, steps: [221, 176, 115] }, deals: { total: 118, target: 200, steps: [52, 39, 27] } },
};

function Donut({ value }: { value: number }) {
  const radius = 26;
  const length = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 flex-none -rotate-90" role="img" aria-label={`${value}% dari target`}>
      <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--brand-soft)" strokeWidth="8" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="8"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - value / 100)}
        className="donut-arc"
      />
      <text
        x="32"
        y="32"
        transform="rotate(90 32 32)"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="600"
        fill="#16191c"
      >
        {value}%
      </text>
    </svg>
  );
}

function CalculatorArt() {
  return (
    <svg viewBox="0 0 80 80" className="h-[72px] w-[72px] flex-none" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="var(--brand-softer)" />
      <g transform="rotate(14 40 40)">
        <rect x="22" y="14" width="36" height="52" rx="6" fill="#3b4cc0" />
        <rect x="24" y="16" width="32" height="48" rx="5" fill="#4f63e0" />
        <rect x="28" y="20" width="24" height="10" rx="2" fill="#bfe9ff" />
        <text x="40" y="27.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1e3a8a">12345</text>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={28 + col * 8.5}
              y={34 + row * 9}
              width="6.5"
              height="6.5"
              rx="1.5"
              fill={col === 2 && row > 0 ? "#facc15" : "#93c5fd"}
            />
          )),
        )}
      </g>
    </svg>
  );
}

export function HomeScreen({
  name,
  activities,
  onOpenActivity,
  onCheckIn,
  onActivities,
  onSimulate,
  onProfile,
  onSoon,
}: {
  name: string;
  activities: Activity[];
  onOpenActivity: (id: string) => void;
  onCheckIn: (id: string) => void;
  onActivities: () => void;
  onSimulate: () => void;
  onProfile: () => void;
  onSoon: (label: string) => void;
}) {
  const [period, setPeriod] = useState<Period>("today");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [tab, setTab] = useState<"leads" | "deals">("leads");
  const [slide, setSlide] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const running = activities.filter((item) => activityStatus(item) !== "ended").slice(0, 5);
  const data = ACHIEVEMENTS[period][tab];
  const percent = Math.round((data.total / data.target) * 100);
  const steps = tab === "leads" ? ["Cold", "Warm", "Hot"] : ["Booking", "Pencairan", "Lunas"];

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="hero-bg hero-safe px-6 pb-6 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-full bg-[#dbe8ff] text-[#5b7fc7]">
            <User size={34} weight="fill" className="translate-y-1.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[14px] leading-[1.4] text-white/90">Selamat Datang</p>
            <h1 className="text-[20px] font-semibold leading-[1.3]">{name}</h1>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[10px] bg-white px-4 py-4 text-[#16191c] shadow-[0_8px_24px_-16px_rgba(15,23,42,0.5)]">
          <div>
            <button
              type="button"
              onClick={() => onSoon("Detail Insentif")}
              className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[var(--brand-ink)]"
            >
              Estimasi Insentif Bulan ini
              <Info size={16} aria-hidden="true" />
            </button>
            <p className="mt-1 text-[20px] font-semibold leading-[1.2] tabular-nums">{rupiah(2_500_000)}</p>
          </div>
          <button
            type="button"
            onClick={() => onSoon("Riwayat Insentif")}
            className="flex flex-col items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] leading-[1.4] text-[#384047] transition active:bg-[#f1f3f5]"
          >
            <ClockCounterClockwise size={22} aria-hidden="true" />
            Insentif
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col pb-6">
        <section className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Ringkasan Pencapaian</h2>
            <button
              type="button"
              onClick={() => setPeriodOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full border border-[#dfe4ea] px-4 text-[13px] leading-[1.4] text-[#16191c] transition active:bg-[#f8fafc]"
            >
              {PERIODS.find((item) => item.value === period)?.label}
              <CaretDown size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 flex gap-2" role="tablist" aria-label="Jenis pencapaian">
            {(
              [
                ["leads", "Leads"],
                ["deals", "Transaksi"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  "h-9 rounded-full border px-4 text-[13px] leading-[1.4] transition",
                  tab === id
                    ? "border-[var(--brand-ink)] bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                    : "border-[#dfe4ea] text-[#16191c]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div key={`${tab}-${period}`} className="card-enter mt-3 overflow-hidden rounded-[10px] border border-[#e2e8f0]">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[14px] leading-[1.4] text-[var(--brand-ink)]">
                  {tab === "leads" ? "Total Leads" : "Total Transaksi"}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <Crosshair size={18} className="self-center text-[#16191c]" aria-hidden="true" />
                  <span className="text-[18px] font-semibold tabular-nums text-[#16191c]">{data.total}</span>
                  <span className="text-[13px] text-[#4f5963]">/{data.target}</span>
                </p>
              </div>
              <Donut value={percent} />
            </div>
            <div className="grid grid-cols-3 bg-[#f8fafc] px-4 py-3">
              {steps.map((label, index) => (
                <div key={label} className="relative">
                  <p className="text-[13px] leading-[1.4] text-[#4f5963]">{label}</p>
                  <p className="mt-1 text-[16px] font-semibold tabular-nums text-[#16191c]">{data.steps[index]}</p>
                  {index < 2 ? (
                    <CaretRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65737f]" aria-hidden="true" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 h-3 bg-[#f1f3f5]" />

        <section className="pt-6">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Aktivitas Berjalan</h2>
            <button type="button" onClick={onActivities} className="text-[13px] font-medium text-[var(--brand-ink)]">
              Lihat Semua
            </button>
          </div>
          {running.length ? (
            <>
              <div
                ref={carousel}
                onScroll={(event) => {
                  const node = event.currentTarget;
                  const width = node.firstElementChild?.clientWidth ?? 1;
                  setSlide(Math.round(node.scrollLeft / (width + 12)));
                }}
                className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6"
              >
                {running.map((activity) => (
                  <div key={activity.id} className="w-[86%] flex-none snap-start">
                    <ActivityCard
                      activity={activity}
                      onOpen={() => onOpenActivity(activity.id)}
                      onCheckIn={() => onCheckIn(activity.id)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
                {running.map((activity, index) => (
                  <span
                    key={activity.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === slide ? "w-6 bg-[var(--brand)]" : "w-1.5 bg-[var(--brand-line)]",
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="mx-6 mt-3 rounded-[8px] bg-[#f8fafc] p-4 text-[13px] leading-[1.4] text-[#4f5963]">
              Belum ada aktivitas berjalan hari ini.
            </p>
          )}
        </section>

        <section className="px-6 pt-6">
          <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Menu Lainnya</h2>
          <button
            type="button"
            onClick={onSimulate}
            className="mt-3 flex w-full items-center gap-3 rounded-[10px] bg-[#f8fafc] p-4 text-left transition active:scale-[0.99] active:bg-[#f1f3f5]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-semibold leading-[1.3] text-[#16191c]">Simulasi Gadai</span>
              <span className="mt-1 block text-[13px] leading-[1.45] text-[#4f5963]">
                Coba simulasi Gadai untuk mengetahui estimasi nilai pinjaman.
              </span>
            </span>
            <CalculatorArt />
          </button>
        </section>
      </main>

      <BottomNav active="home" onHome={() => undefined} onActivity={onActivities} onProfile={onProfile} onSoon={onSoon} />

      <Sheet open={periodOpen} onClose={() => setPeriodOpen(false)} label="Pilih periode">
        <h2 className="mb-3 text-[18px] font-semibold leading-[1.3] text-[#16191c]">Pilih Periode</h2>
        <RadioList
          options={PERIODS}
          value={period}
          onChange={(value) => {
            setPeriod(value);
            setPeriodOpen(false);
          }}
        />
      </Sheet>
    </div>
  );
}
