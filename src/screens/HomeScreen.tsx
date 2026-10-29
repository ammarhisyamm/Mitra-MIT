import { useRef, useState } from "react";
import { CaretDown, CaretRight, ClockCounterClockwise, Info, User } from "@phosphor-icons/react";
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
    deals: { booking: number; bookingTarget: number; count: number; countTarget: number; newCustomers: number };
  }
> = {
  today: {
    leads: { total: 30, target: 40, steps: [10, 10, 10] },
    deals: { booking: 4_200_000, bookingTarget: 10_000_000, count: 20, countTarget: 40, newCustomers: 10 },
  },
  week: {
    leads: { total: 142, target: 200, steps: [58, 49, 35] },
    deals: { booking: 26_500_000, bookingTarget: 50_000_000, count: 96, countTarget: 200, newCustomers: 41 },
  },
  month: {
    leads: { total: 512, target: 800, steps: [221, 176, 115] },
    deals: { booking: 118_000_000, bookingTarget: 200_000_000, count: 388, countTarget: 800, newCustomers: 162 },
  },
};

function Donut({ value }: { value: number }) {
  const radius = 22;
  const length = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 52 52" className="h-[52px] w-[52px] flex-none -rotate-90" role="img" aria-label={`${value}% dari target`}>
      <circle cx="26" cy="26" r={radius} fill="none" stroke="var(--brand-soft)" strokeWidth="5" />
      <circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - Math.min(value, 100) / 100)}
        className="donut-arc"
      />
      <text
        x="26"
        y="26"
        transform="rotate(90 26 26)"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fill="#16191c"
      >
        {value}%
      </text>
    </svg>
  );
}

function AccentLabel({ children }: { children: string }) {
  return (
    <p className="relative -ml-3 pl-3 text-[13px] font-medium leading-[1.4] text-[var(--brand-ink)]">
      <span className="absolute left-0 top-[1px] h-[18px] w-[3px] rounded-r-[2px] bg-[var(--brand)]" aria-hidden="true" />
      {children}
    </p>
  );
}

function CalculatorArt() {
  return (
    <svg viewBox="0 0 80 80" className="h-[60px] w-[60px] flex-none" aria-hidden="true">
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
  const { leads, deals } = ACHIEVEMENTS[period];
  const leadPercent = Math.round((leads.total / leads.target) * 100);
  const bookingPercent = Math.round((deals.booking / deals.bookingTarget) * 100);

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <header className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full bg-[var(--brand-softer)] text-[var(--brand)]">
            <User size={30} weight="fill" className="translate-y-1" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[12px] leading-[1.4] text-[#384047]">Selamat Datang</p>
            <h1 className="text-[16px] font-medium leading-[1.4] text-[#16191c]">{name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] bg-[var(--brand-soft)] p-4">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onSoon("Detail Insentif")}
              className="flex items-center gap-1.5 text-[13px] font-medium leading-[1.4] text-[var(--brand-ink)]"
            >
              Estimasi Insentif Bulan ini
              <Info size={16} aria-hidden="true" />
            </button>
            <p className="mt-1 text-[16px] font-semibold leading-[1.4] text-[#16191c] tabular-nums">
              {rupiah(2_500_000)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSoon("Riwayat Insentif")}
            className="flex flex-col items-center gap-0.5 rounded-[8px] px-1 py-1 text-[13px] leading-[1.4] text-[#384047] transition active:bg-white/60"
          >
            <ClockCounterClockwise size={24} className="text-[#16191c]" aria-hidden="true" />
            Insentif
          </button>
        </div>

        <section className="flex flex-col gap-3" aria-label="Pencapaian Anda">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-medium leading-[1.4] text-[#16191c]">Pencapaian Anda</h2>
            <button
              type="button"
              onClick={() => setPeriodOpen(true)}
              className="flex items-center gap-1 rounded-[16px] border border-[#dfe4ea] px-4 py-2 text-[12px] leading-[1.4] text-[#16191c] transition active:bg-[#f8fafc]"
            >
              {PERIODS.find((item) => item.value === period)?.label}
              <CaretDown size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="flex gap-2" role="tablist" aria-label="Jenis pencapaian">
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
                  "rounded-[16px] border px-4 py-2 text-[12px] leading-[1.4] transition",
                  tab === id
                    ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                    : "border-[#dfe4ea] text-[#16191c]",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div key={`${tab}-${period}`} className="card-enter overflow-hidden rounded-[8px] border border-[#dfe4ea]" role="tabpanel">
            {tab === "leads" ? (
              <>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <AccentLabel>Total Leads</AccentLabel>
                    <p className="mt-1 flex items-end gap-1">
                      <span className="text-[16px] font-medium leading-[1.4] text-[#16191c] tabular-nums">{leads.total}</span>
                      <span className="text-[12px] font-medium leading-[1.6] text-[#65737f]">/{leads.target}</span>
                    </p>
                  </div>
                  <Donut value={leadPercent} />
                </div>
                <div className="px-2 pb-2">
                  <div className="grid grid-cols-3 rounded-[4px] bg-[var(--brand-soft)]">
                    {["Cold", "Warm", "Hot"].map((label, index) => (
                      <div key={label} className="relative p-2">
                        <p className="text-[13px] leading-[1.4] text-[var(--brand-ink)]">{label}</p>
                        <p className="mt-1 text-[16px] font-medium leading-[1.4] text-[#16191c] tabular-nums">
                          {leads.steps[index]}
                        </p>
                        {index < 2 ? (
                          <CaretRight
                            size={16}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#65737f]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1 p-3">
                  <AccentLabel>Total Booking</AccentLabel>
                  <p className="text-[16px] font-medium leading-[1.4] text-[#16191c] tabular-nums">
                    {rupiah(deals.booking)}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="h-[6px] flex-1 overflow-hidden rounded-[12px] bg-[var(--brand-soft)]">
                      <span
                        className="progress-fill block h-full rounded-[12px] bg-[var(--brand)]"
                        style={{ width: `${bookingPercent}%` }}
                      />
                    </span>
                    <span className="text-[12px] leading-[1.4] text-[#16191c] tabular-nums">{bookingPercent}%</span>
                  </div>
                  <p className="text-[12px] leading-[1.4] text-[#65737f]">Target: {rupiah(deals.bookingTarget)}</p>
                </div>
                <div className="px-2 pb-2">
                  <div className="grid grid-cols-2 gap-2 rounded-[4px] bg-[var(--brand-soft)]">
                    <div className="p-2">
                      <p className="text-[13px] leading-[1.4] text-[var(--brand-ink)]">Jumlah Transaksi</p>
                      <p className="mt-1 flex items-end gap-1">
                        <span className="text-[16px] font-medium leading-[1.4] text-[#16191c] tabular-nums">{deals.count}</span>
                        <span className="text-[12px] font-medium leading-[1.6] text-[#65737f]">/{deals.countTarget}</span>
                      </p>
                    </div>
                    <div className="p-2">
                      <p className="text-[13px] leading-[1.4] text-[var(--brand-ink)]">Nasabah Baru</p>
                      <p className="mt-1 text-[16px] font-medium leading-[1.4] text-[#16191c] tabular-nums">
                        {deals.newCustomers}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </header>

      <div className="h-3 flex-none bg-[#f1f1f1]" />

      <main className="flex flex-1 flex-col gap-4 py-6">
        <div className="px-6">
          <button
            type="button"
            onClick={onSimulate}
            className="flex w-full items-center gap-3 rounded-[8px] bg-[var(--brand-soft)] p-4 text-left transition active:scale-[0.99]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-medium leading-[1.4] text-[#020618]">Simulasi Gadai</span>
              <span className="mt-1 block text-[12px] leading-[1.4] text-[#45556c]">
                Coba simulasi Gadai untuk mengetahui estimasi nilai pinjaman.
              </span>
            </span>
            <CalculatorArt />
          </button>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="px-6 text-[16px] font-medium leading-[1.4] text-[#16191c]">Aktivitas Berjalan</h2>
          {running.length ? (
            <>
              <div
                ref={carousel}
                onScroll={(event) => {
                  const node = event.currentTarget;
                  const width = node.firstElementChild?.clientWidth ?? 1;
                  setSlide(Math.round(node.scrollLeft / (width + 12)));
                }}
                className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6"
              >
                {running.map((activity) => (
                  <div key={activity.id} className="w-[330px] max-w-[86%] flex-none snap-start">
                    <ActivityCard
                      activity={activity}
                      onOpen={() => onOpenActivity(activity.id)}
                      onCheckIn={() => onCheckIn(activity.id)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-1" aria-hidden="true">
                {running.map((activity, index) => (
                  <span
                    key={activity.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === slide ? "w-4 bg-[var(--brand)]" : "w-1.5 bg-[var(--brand-softer)]",
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-6 rounded-[8px] bg-[#f8fafc] p-4 text-[13px] leading-[1.4] text-[#4f5963]">
              Belum ada aktivitas berjalan hari ini.{" "}
              <button type="button" onClick={onActivities} className="font-medium text-[var(--brand-ink)] underline">
                Lihat aktivitas
              </button>
            </div>
          )}
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
