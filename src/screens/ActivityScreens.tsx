import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Repeat2,
  ShieldCheck,
  Timer,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  InlineAlert,
  PrimaryButton,
  StepHeader,
} from "@/components/primitives";
import { cn } from "@/lib/cn";
import {
  ACTIVITY_LEADS,
  getUnit,
  type ActivityArea,
  type ActivityDraft,
  type ActivityKind,
  type ActivityLead,
  type BusinessUnit,
} from "@/lib/demo";

const KIND_OPTIONS = [
  {
    id: "kunjungan" as const,
    label: "Kunjungan mitra",
    detail: "Datangi mitra binaan di lokasi.",
    icon: UsersRound,
  },
  {
    id: "prospek" as const,
    label: "Prospek baru",
    detail: "Cari dan catat calon mitra.",
    icon: UserPlus,
  },
  {
    id: "followup" as const,
    label: "Follow-up",
    detail: "Tindak lanjuti prospek atau lead.",
    icon: Repeat2,
  },
];

const AREA_OPTIONS: { id: ActivityArea; label: string; detail: string }[] = [
  { id: "inside", label: "Dalam area unit", detail: "Sesuai wilayah kerja Anda." },
  { id: "outside", label: "Luar area unit", detail: "Ditandai untuk persetujuan Admin Unit." },
];

function kindMeta(kind: ActivityKind) {
  return KIND_OPTIONS.find((item) => item.id === kind) ?? KIND_OPTIONS[0];
}

function areaLabel(area: ActivityArea) {
  return AREA_OPTIONS.find((item) => item.id === area)?.label ?? AREA_OPTIONS[0].label;
}

function clockLabel(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}.${String(date.getMinutes()).padStart(2, "0")}`;
}

function timeLabel(value: string) {
  return value.replace(":", ".");
}

function todayLabel() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

function scheduledDate(value: string) {
  const date = new Date();
  const [hours, minutes] = value.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function tolerance(value: string) {
  const difference = scheduledDate(value).getTime() - Date.now();
  return {
    open: Math.abs(difference) <= 60 * 60 * 1000,
    minutes: Math.round(difference / 60000),
  };
}

function ActivityMap({ address, height = "h-[150px]" }: { address: string; height?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#f2f5f2]",
        height,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 150" className="h-full w-full" preserveAspectRatio="none">
        <rect width="320" height="150" fill="#f1f5f1" />
        <path d="M-10 48H330" stroke="#ffffff" strokeWidth="18" />
        <path d="M-10 48H330" stroke="#e2e8e2" strokeWidth="1" />
        <path d="M88 -10V160" stroke="#ffffff" strokeWidth="14" />
        <path d="M238 -10V160" stroke="#ffffff" strokeWidth="10" />
        <path d="M-10 112H330" stroke="#ffffff" strokeWidth="9" />
        <path d="M156 -10L214 160" stroke="#ffffff" strokeWidth="7" />
        <rect x="196" y="62" width="32" height="36" rx="3" fill="#e0ebdd" />
        <rect x="104" y="70" width="24" height="28" rx="3" fill="#e4ece2" />
        <rect x="252" y="18" width="42" height="20" rx="3" fill="#e7efe5" />
      </svg>
      <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2852a3] text-white shadow-[0_8px_20px_-6px_rgba(40,82,163,0.7)] ring-4 ring-white">
        <MapPin className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </span>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-[10px] bg-white/95 px-3 py-2 backdrop-blur">
        <Navigation className="h-3.5 w-3.5 flex-none text-[#2852a3]" aria-hidden="true" />
        <span className="truncate text-[11px] font-medium leading-4 text-[#344054]">
          {address}
        </span>
      </div>
    </div>
  );
}

export function ActivityListScreen({
  unit,
  activity,
  completed,
  leadCount,
  onBack,
  onCreate,
  onOpen,
}: {
  unit: BusinessUnit;
  activity: ActivityDraft;
  completed: boolean;
  leadCount: number;
  onBack: () => void;
  onCreate: () => void;
  onOpen: () => void;
}) {
  const selected = getUnit(unit);
  const FeaturedIcon = completed ? CircleCheck : kindMeta(activity.kind).icon;
  const featuredMeta = completed
    ? `${leadCount} lead · Checkout tercatat`
    : `${selected.short} · ${areaLabel(activity.area)} · 2,4 km`;

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader title="Aktivitas" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Kelola kunjungan, check-in, dan lead dalam satu aktivitas.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold leading-5 text-[#151b2b]">Hari ini</p>
        <p className="flex items-center gap-1.5 text-[12px] leading-[18px] text-[#667085]">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {todayLabel()}
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
        <div
          className="flex gap-3.5 border-l-[3px] p-4"
          style={{ borderColor: completed ? "#12b76a" : selected.color }}
        >
          <span
            className={cn(
              "mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-full",
              completed && "bg-[#ecfdf3] text-[#067647]",
            )}
            style={completed ? undefined : { background: selected.soft, color: selected.ink }}
          >
            <FeaturedIcon
              className="h-[18px] w-[18px]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold leading-4"
                style={{ color: completed ? "#067647" : selected.ink }}
              >
                {completed ? null : (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: selected.color }}
                    aria-hidden="true"
                  />
                )}
                {completed ? "Selesai" : "Berikutnya"}
              </span>
              <span className="tabular text-[13px] font-semibold leading-5 text-[#151b2b]">
                {timeLabel(activity.time)}
              </span>
            </div>
            <p className="mt-1 text-[15px] font-semibold leading-5 text-[#151b2b]">
              {activity.name}
            </p>
            <p className="mt-1 text-[12px] leading-[18px] text-[#667085]">{featuredMeta}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="flex min-h-11 w-full items-center justify-between gap-3 border-t border-[#eef2f6] bg-[#fbfcfe] px-4 text-left transition hover:bg-[#f5f8fc]"
        >
          <span className="text-[13px] font-medium text-[#2852a3]">
            {completed ? "Lihat ringkasan" : "Buka aktivitas"}
          </span>
          <ChevronRight className="h-4 w-4 text-[#98a2b3]" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold leading-5 text-[#151b2b]">Aktivitas lain</h2>
        <span className="text-[11px] leading-4 text-[#98a2b3]">2 aktivitas</span>
      </div>
      <div className="mt-3 overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#fffaeb] text-[#b54708]">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-[13px] font-medium leading-5 text-[#151b2b]">
                Follow-up prospek
              </p>
              <span className="tabular flex-none text-[11px] font-medium leading-4 text-[#667085]">
                16.00
              </span>
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-[#667085]">
              Hari ini · Terjadwal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-[#eef2f6] px-4 py-3.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#ecfdf3] text-[#067647]">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-[13px] font-medium leading-5 text-[#151b2b]">
                Kunjungan mitra binaan
              </p>
              <span className="flex-none text-[11px] leading-4 text-[#98a2b3]">Kemarin</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-4 text-[#667085]">
              Selesai · 2 lead
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={onCreate}>
        Buat aktivitas
      </PrimaryButton>
    </div>
  );
}

export function ActivityTypeScreen({
  initialKind,
  initialArea,
  onBack,
  onContinue,
}: {
  initialKind: ActivityKind;
  initialArea: ActivityArea;
  onBack: () => void;
  onContinue: (kind: ActivityKind, area: ActivityArea) => void;
}) {
  const [kind, setKind] = useState<ActivityKind>(initialKind);
  const [area, setArea] = useState<ActivityArea>(initialArea);

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader step={1} total={2} title="Buat aktivitas" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Tentukan tujuan dan jangkauan area sebelum mengisi detail aktivitas.
      </p>

      <p className="mt-7 text-[12px] font-medium leading-[18px] text-[#151b2b]">
        Jenis aktivitas
      </p>
      <div className="mt-2 space-y-2">
        {KIND_OPTIONS.map((item) => {
          const active = kind === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setKind(item.id)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center gap-3 rounded-[12px] border p-3 text-left transition",
                active
                  ? "border-[#2852a3] bg-[#f5f8fe]"
                  : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1]",
              )}
            >
              <span
                className={cn(
                  "grid h-10 w-10 flex-none place-items-center rounded-[10px]",
                  active ? "bg-[#e8effb] text-[#2852a3]" : "bg-[#f3f4f6] text-[#667085]",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium leading-5 text-[#151b2b]">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[12px] leading-[18px] text-[#667085]">
                  {item.detail}
                </span>
              </span>
              <span
                className={cn(
                  "grid h-5 w-5 flex-none place-items-center rounded-full border",
                  active
                    ? "border-[#2852a3] bg-[#2852a3] text-white"
                    : "border-[#d0d5dd] text-transparent",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[12px] font-medium leading-[18px] text-[#151b2b]">
        Jangkauan area
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {AREA_OPTIONS.map((item) => {
          const active = area === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setArea(item.id)}
              aria-pressed={active}
              className={cn(
                "rounded-[12px] border px-3 py-3 text-left transition",
                active
                  ? "border-[#2852a3] bg-[#f5f8fe]"
                  : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1]",
              )}
            >
              <span
                className={cn(
                  "block text-[13px] font-medium leading-5",
                  active ? "text-[#2852a3]" : "text-[#151b2b]",
                )}
              >
                {item.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-[#667085]">
                {item.detail}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={() => onContinue(kind, area)}>
        Lanjut
      </PrimaryButton>
    </div>
  );
}

export function ActivityScheduleScreen({
  kind,
  area,
  initialName,
  initialLocation,
  initialTime,
  onBack,
  onCreated,
}: {
  kind: ActivityKind;
  area: ActivityArea;
  initialName: string;
  initialLocation: string;
  initialTime: string;
  onBack: () => void;
  onCreated: (draft: ActivityDraft) => void;
}) {
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation);
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim()) {
      setError("Nama aktivitas wajib diisi.");
      return;
    }
    if (!location.trim()) {
      setError("Tentukan titik lokasi aktivitas.");
      return;
    }
    if (!time) {
      setError("Tentukan waktu pelaksanaan.");
      return;
    }
    if (scheduledDate(time).getTime() < Date.now()) {
      setError("Waktu pelaksanaan tidak boleh sebelum sekarang.");
      return;
    }
    setError("");
    onCreated({ kind, area, name: name.trim(), location: location.trim(), time });
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader step={2} total={2} title="Detail aktivitas" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Lengkapi nama, titik lokasi, dan waktu pelaksanaan.
      </p>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-[12px] font-medium leading-[18px] text-[#344054]">
          Nama aktivitas
        </span>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          className="field"
          placeholder="Contoh: Kunjungan mitra binaan"
          autoComplete="off"
        />
      </label>

      <div className="mt-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium leading-[18px] text-[#344054]">
            Lokasi
          </span>
          <span className="flex items-center gap-2">
            <input
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setError("");
              }}
              className="field"
              placeholder="Cari alamat atau titik maps"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setLocation("Jl. Fatmawati No. 12, Jakarta Selatan")}
              className="grid h-11 w-11 flex-none place-items-center rounded-[8px] border border-[#dfe4ea] text-[#2852a3] transition hover:bg-[#f8fafc]"
              aria-label="Gunakan lokasi saat ini"
            >
              <LocateFixed className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </span>
        </label>
        <div className="mt-2">
          <ActivityMap address={location || "Titik lokasi belum dipilih"} height="h-[128px]" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[12px] font-medium leading-[18px] text-[#344054]">
          Waktu pelaksanaan
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-[#667085]">
          Hari ini · {todayLabel()}
        </p>
        <input
          type="time"
          value={time}
          onChange={(event) => {
            setTime(event.target.value);
            setError("");
          }}
          className="field mt-1.5"
          aria-label="Waktu pelaksanaan"
        />
      </div>

      {error ? <InlineAlert className="mt-4">{error}</InlineAlert> : null}

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={submit}>
        Buat aktivitas
      </PrimaryButton>
      <p className="mt-3 text-center text-[11px] leading-4 text-[#667085]">
        Aktivitas {kindMeta(kind).label.toLowerCase()} · {areaLabel(area)}
      </p>
    </div>
  );
}

export function ActivityCreatedScreen({
  draft,
  onBack,
  onCheckin,
}: {
  draft: ActivityDraft;
  onBack: () => void;
  onCheckin: () => void;
}) {
  const status = tolerance(draft.time);
  const checkinWindow = new Date(scheduledDate(draft.time).getTime() - 60 * 60 * 1000);

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader title="Aktivitas dibuat" onBack={onBack} />
      <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-[#bfe6d6] bg-[#f3fbf7] p-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#e2f5ec] text-[#24663f]">
          <Check className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-5 text-[#151b2b]">
            Aktivitas berhasil dijadwalkan
          </p>
          <p className="text-[11px] leading-4 text-[#667085]">
            {status.open
              ? "Waktu check-in sudah tersedia."
              : status.minutes > 0
                ? `Check-in dibuka pukul ${clockLabel(checkinWindow)}.`
                : "Waktu check-in telah lewat."}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[16px] border border-[#e5e7eb]">
        <div className="px-4 py-4">
          <p className="text-[15px] font-semibold leading-5 text-[#151b2b]">{draft.name}</p>
          <p className="mt-1 text-[12px] leading-[18px] text-[#667085]">
            {kindMeta(draft.kind).label} · {areaLabel(draft.area)}
          </p>
        </div>
        <dl className="divide-y divide-[#e5e7eb] border-t border-[#e5e7eb] px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-[12px] leading-[18px] text-[#667085]">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Jadwal
            </dt>
            <dd className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
              Hari ini, {timeLabel(draft.time)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-[12px] leading-[18px] text-[#667085]">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Lokasi
            </dt>
            <dd className="line-clamp-2 max-w-[190px] text-right text-[12px] font-medium leading-[18px] text-[#151b2b]">
              {draft.location}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-[12px] leading-[18px] text-[#667085]">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              Toleransi check-in
            </dt>
            <dd className="text-[12px] font-medium leading-[18px] text-[#151b2b]">
              1 jam sebelum–sesudah
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[12px] leading-[18px] text-[#667085]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Check-in mencatat waktu dan titik lokasi Anda.
      </p>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={onCheckin}>
        Check-in sekarang
      </PrimaryButton>
      <button
        type="button"
        onClick={onBack}
        className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Kembali ke daftar aktivitas
      </button>
    </div>
  );
}

export function ActivityCheckinScreen({
  draft,
  onBack,
  onCheckedIn,
}: {
  draft: ActivityDraft;
  onBack: () => void;
  onCheckedIn: (time: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const status = tolerance(draft.time);
  const windowStart = new Date(scheduledDate(draft.time).getTime() - 60 * 60 * 1000);

  function checkin() {
    if (!status.open || loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onCheckedIn(clockLabel());
    }, 700);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader title="Check-in aktivitas" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Pastikan Anda berada di titik aktivitas sebelum check-in.
      </p>

      <div className="mt-6">
        <ActivityMap address={draft.location} height="h-[176px]" />
      </div>

      <div className="mt-4 rounded-[12px] border border-[#e5e7eb] px-4">
        <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] py-3">
          <span className="text-[12px] leading-[18px] text-[#667085]">Jadwal</span>
          <span className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
            Hari ini, {timeLabel(draft.time)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <span className="text-[12px] leading-[18px] text-[#667085]">Toleransi</span>
          <span className="text-[13px] font-medium leading-5 text-[#151b2b]">
            ±1 jam dari jadwal
          </span>
        </div>
      </div>

      {status.open ? (
        <p className="mt-4 flex items-start gap-2 rounded-[12px] border border-[#bfe6d6] bg-[#f3fbf7] px-3 py-3 text-[12px] leading-[18px] text-[#1e5c3c]">
          <LocateFixed className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          Anda berada dalam area aktivitas. Check-in akan mencatat waktu dan lokasi.
        </p>
      ) : (
        <div className="mt-4 rounded-[12px] border border-[#f5d9a8] bg-[#fffbf2] px-3 py-3 text-[12px] leading-[18px] text-[#8a5a12]">
          <p className="font-medium">Belum bisa check-in.</p>
          <p className="mt-0.5">
            {status.minutes > 0
              ? `Check-in dibuka pukul ${clockLabel(windowStart)}.`
              : "Waktu check-in sudah lewat. Ubah jadwal atau hubungi Admin Unit."}
          </p>
        </div>
      )}

      <div className="flex-1" />
      <PrimaryButton
        type="button"
        className="mt-7"
        onClick={checkin}
        disabled={!status.open}
        loading={loading}
        loadingLabel="Mencatat check-in…"
      >
        Check-in sekarang
      </PrimaryButton>
      {!status.open ? (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
        >
          Kembali ubah aktivitas
        </button>
      ) : null}
    </div>
  );
}

export function ActivityLeadsScreen({
  draft,
  checkinTime,
  leads,
  onAddLead,
  onBack,
  onFinish,
}: {
  draft: ActivityDraft;
  checkinTime: string;
  leads: ActivityLead[];
  onAddLead: (lead: ActivityLead) => void;
  onBack: () => void;
  onFinish: (leadCount: number) => void;
}) {
  const allAdded = leads.length === ACTIVITY_LEADS.length;

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader title="Input leads" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Catat lead yang ditemukan sebelum menutup aktivitas.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-[12px] border border-[#bfe6d6] bg-[#f3fbf7] px-3 py-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#e2f5ec] text-[#24663f]">
          <CircleCheck className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-5 text-[#151b2b]">
            Check-in tercatat pukul {checkinTime}
          </p>
          <p className="truncate text-[11px] leading-4 text-[#667085]">{draft.location}</p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-medium leading-5 text-[#151b2b]">Leads aktivitas</p>
        <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-semibold text-[#667085]">
          {leads.length} lead
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="mt-2 rounded-[12px] border border-dashed border-[#d0d5dd] px-4 py-7 text-center">
          <UserPlus className="mx-auto h-6 w-6 text-[#667085]" strokeWidth={1.6} aria-hidden="true" />
          <p className="mt-2 text-[13px] font-medium leading-5 text-[#151b2b]">Belum ada lead</p>
          <p className="mx-auto mt-1 max-w-[240px] text-[11px] leading-4 text-[#667085]">
            Tambahkan lead yang ditemukan selama aktivitas berlangsung.
          </p>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
          {leads.map((lead) => (
            <li key={lead.phone} className="flex items-center gap-3 py-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#f3f6fb] text-[11px] font-semibold text-[#2852a3]">
                {lead.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-5 text-[#151b2b]">
                  {lead.name}
                </p>
                <p className="truncate text-[11px] leading-4 text-[#667085]">
                  {lead.phone} · {lead.note}
                </p>
              </div>
              <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[10px] font-semibold text-[#2852a3]">
                Baru
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          const nextLead = ACTIVITY_LEADS[leads.length];
          if (nextLead) onAddLead(nextLead);
        }}
        disabled={allAdded}
        className="secondary-button mt-3 w-full"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {allAdded ? "Semua contoh sudah ditambahkan" : "Tambah lead"}
      </button>
      <p className="mt-2 text-center text-[10px] leading-4 text-[#667085]">
        Data contoh untuk prototype. Form lengkap ada di modul Leads.
      </p>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={() => onFinish(leads.length)}>
        Selesaikan aktivitas
      </PrimaryButton>
    </div>
  );
}

export function ActivityCheckoutScreen({
  draft,
  checkinTime,
  leadCount,
  onBack,
  onDone,
}: {
  draft: ActivityDraft;
  checkinTime: string;
  leadCount: number;
  onBack: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const checkoutTime = clockLabel();

  function checkout() {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onDone();
    }, 800);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader title="Selesaikan aktivitas" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Periksa ringkasan sebelum checkout dan menutup aktivitas.
      </p>

      <div className="mt-6 overflow-hidden rounded-[16px] border border-[#e5e7eb]">
        <div className="px-4 py-4">
          <p className="text-[15px] font-semibold leading-5 text-[#151b2b]">{draft.name}</p>
          <p className="mt-1 text-[12px] leading-[18px] text-[#667085]">
            {kindMeta(draft.kind).label} · {areaLabel(draft.area)}
          </p>
        </div>
        <dl className="divide-y divide-[#e5e7eb] border-t border-[#e5e7eb] px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">Check-in</dt>
            <dd className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
              {checkinTime}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">Checkout</dt>
            <dd className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
              {checkoutTime}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">Leads tercatat</dt>
            <dd className="text-[13px] font-medium leading-5 text-[#151b2b]">
              {leadCount} lead
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4 py-3">
            <dt className="flex-none text-[12px] leading-[18px] text-[#667085]">Lokasi</dt>
            <dd className="max-w-[210px] text-right text-[12px] font-medium leading-[18px] text-[#151b2b]">
              {draft.location}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-[12px] border border-[#f5d9a8] bg-[#fffbf2] px-3 py-3 text-[12px] leading-[18px] text-[#8a5a12]">
        Setelah checkout, waktu dan lokasi tersimpan dan aktivitas tidak bisa diubah.
      </div>

      <div className="flex-1" />
      <PrimaryButton
        type="button"
        className="mt-7"
        onClick={checkout}
        loading={loading}
        loadingLabel="Menyimpan checkout…"
      >
        Checkout & selesaikan
      </PrimaryButton>
      <button
        type="button"
        onClick={onBack}
        className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Kembali input leads
      </button>
    </div>
  );
}

export function ActivityDoneScreen({
  leadCount,
  checkinTime,
  onHome,
  onActivity,
}: {
  leadCount: number;
  checkinTime: string;
  onHome: () => void;
  onActivity: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-16">
      <div className="flex flex-1 flex-col items-center justify-center pb-6 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-[#ecfdf3] text-[#24663f]">
          <CircleCheck className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="mt-6 rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
          Data contoh
        </span>
        <h1 className="mt-3 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          Aktivitas selesai
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-[14px] leading-6 text-[#667085]">
          Checkout tercatat dan aktivitas sudah ditutup.
        </p>
      </div>

      <div className="grid grid-cols-3 border-y border-[#e5e7eb] py-4">
        <div className="text-center">
          <p className="tabular text-[18px] font-semibold leading-6 text-[#151b2b]">{leadCount}</p>
          <p className="text-[11px] leading-4 text-[#667085]">Leads</p>
        </div>
        <div className="border-l border-[#e5e7eb] text-center">
          <p className="tabular text-[18px] font-semibold leading-6 text-[#151b2b]">{checkinTime}</p>
          <p className="text-[11px] leading-4 text-[#667085]">Check-in</p>
        </div>
        <div className="border-l border-[#e5e7eb] text-center">
          <p className="text-[18px] font-semibold leading-6 text-[#24663f]">Selesai</p>
          <p className="text-[11px] leading-4 text-[#667085]">Status</p>
        </div>
      </div>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={onHome}>
        Kembali ke beranda
      </PrimaryButton>
      <button
        type="button"
        onClick={onActivity}
        className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Lihat daftar aktivitas
      </button>
    </div>
  );
}
