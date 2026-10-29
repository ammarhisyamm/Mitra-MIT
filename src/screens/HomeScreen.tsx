import {
  Bell,
  CalendarCheck,
  CaretRight,
  ClipboardText,
  SignOut,
  TrendUp,
  UsersThree,
} from "@phosphor-icons/react";
import { BottomNav, StatusChip } from "@/components/mobile";
import { activityStatus, type Activity } from "@/lib/activity";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 19) return "Selamat Sore";
  return "Selamat Malam";
}

export function HomeScreen({
  name,
  activities,
  onOpenActivity,
  onActivities,
  onLogout,
  onSoon,
}: {
  name: string;
  activities: Activity[];
  onOpenActivity: (id: string) => void;
  onActivities: () => void;
  onLogout: () => void;
  onSoon: (label: string) => void;
}) {
  const next = activities.find((item) => activityStatus(item) !== "ended");
  const leads = activities.reduce((sum, item) => sum + item.leads.length, 0);
  const prospects = activities.reduce(
    (sum, item) => sum + item.leads.filter((lead) => lead.prospect).length,
    0,
  );
  const stats = [
    { icon: CalendarCheck, value: activities.length, label: "Aktivitas" },
    { icon: UsersThree, value: leads, label: "Leads" },
    { icon: TrendUp, value: prospects, label: "Prospek" },
  ];
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="hero-bg hero-safe px-6 pb-16 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-[14px] font-semibold">
              {initials}
            </span>
            <div>
              <p className="text-[12px] leading-[1.4] text-white/80">{greeting()},</p>
              <h1 className="text-[18px] font-semibold leading-[1.3]">{name}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSoon("Notifikasi")}
            aria-label="Notifikasi"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 transition active:scale-95"
          >
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#f9a11f]" />
          </button>
        </div>
        <p className="mt-4 text-[12px] leading-[1.4] text-white/80">{today}</p>
      </header>

      <main className="-mt-10 flex flex-1 flex-col gap-6 px-6 pb-8">
        <section className="card-enter rounded-[12px] border border-[#e2e8f0] bg-white p-4 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.4)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold leading-[1.4] text-[#16191c]">Aktivitas Berikutnya</h2>
            {next ? (
              <StatusChip tone={activityStatus(next) === "ongoing" ? "success" : "brand"}>
                {activityStatus(next) === "ongoing" ? "Berjalan" : "Segera"}
              </StatusChip>
            ) : null}
          </div>
          {next ? (
            <button
              type="button"
              onClick={() => onOpenActivity(next.id)}
              className="mt-3 flex w-full items-center gap-3 rounded-[8px] bg-[#f0f5fe] p-3 text-left transition active:bg-[#e3ecfd]"
            >
              <ClipboardText size={24} className="flex-none text-[#2852a3]" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium leading-[1.4] text-[#020618]">
                  {next.name}
                </span>
                <span className="block truncate text-[12px] leading-[1.4] text-[#45556c]">
                  {next.start} - {next.end} · {next.locationName}
                </span>
              </span>
              <CaretRight size={16} className="flex-none text-[#45556c]" aria-hidden="true" />
            </button>
          ) : (
            <p className="mt-3 text-[13px] leading-[1.4] text-[#4f5963]">
              Belum ada aktivitas terjadwal. Buat aktivitas baru dari menu Aktivitas.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-[14px] font-semibold leading-[1.4] text-[#16191c]">Ringkasan</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[10px] border border-[#e2e8f0] p-3">
                <item.icon size={20} className="text-[#2852a3]" aria-hidden="true" />
                <p className="mt-2 text-[20px] font-semibold leading-none tabular-nums text-[#16191c]">
                  {item.value}
                </p>
                <p className="mt-1 text-[12px] leading-[1.4] text-[#4f5963]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onActivities}
          className="flex items-center justify-between rounded-[10px] border border-[#e2e8f0] p-4 text-left transition active:bg-[#f8fafc]"
        >
          <span>
            <span className="block text-[14px] font-medium leading-[1.4] text-[#16191c]">Lihat Semua Aktivitas</span>
            <span className="block text-[12px] leading-[1.4] text-[#4f5963]">
              Buat, check-in, dan catat leads
            </span>
          </span>
          <CaretRight size={16} className="text-[#45556c]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto inline-flex items-center gap-2 self-start py-2 text-[14px] font-medium text-[#d73926]"
        >
          <SignOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </main>

      <BottomNav active="home" onHome={() => undefined} onActivity={onActivities} onSoon={onSoon} />
    </div>
  );
}
