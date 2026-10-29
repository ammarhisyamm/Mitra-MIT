import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  CalendarDots,
  Camera,
  CaretRight,
  ChatCircleText,
  ClipboardText,
  Checks,
  Clock,
  Coins,
  Crosshair,
  DeviceMobile,
  ImageSquare,
  MapPin,
  MapTrifold,
  Minus,
  Plus,
  Scales,
  SignIn,
  SignOut,
  Trash,
  User,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { MapPinOff, PackageX } from "lucide-react";
import {
  AppBar,
  BottomBar,
  BottomNav,
  Button,
  EmptyState,
  Fab,
  FieldLabel,
  FilterButton,
  FilterChip,
  PageIntro,
  RadioCard,
  RadioList,
  ResultDialog,
  SearchField,
  SelectField,
  Sheet,
  StatusChip,
  TextField,
  type ChipTone,
} from "@/components/mobile";
import { DummyMap } from "@/components/DummyMap";
import { DateWheelSheet } from "@/components/DateWheel";
import {
  USER_LOCATION,
  animateView,
  clampView,
  resolvePoint,
  useMapSearch,
  type MapView,
} from "@/lib/map";
import { cn } from "@/lib/cn";
import {
  ACTIVITY_KINDS,
  CURRENT_PLACE,
  ELECTRONIC_CATEGORIES,
  ELECTRONIC_ITEMS,
  FILTER_KINDS,
  GOLD_ITEMS,
  GOLD_KARATS,
  MESSAGE_TEMPLATES,
  PLACES,
  activityStatus,
  areaLabel,
  clockNow,
  collateralDetail,
  displayDate,
  estimateCollateral,
  longDate,
  maskPhone,
  rupiah,
  todayIso,
  uid,
  type Activity,
  type ActivityForm,
  type ActivityStatus,
  type Collateral,
  type CollateralType,
  type Lead,
  type Place,
} from "@/lib/activity";

const STATUS_META: Record<ActivityStatus, { label: string; tone: ChipTone }> = {
  ongoing: { label: "Berjalan", tone: "success" },
  upcoming: { label: "Segera", tone: "brand" },
  ended: { label: "Berakhir", tone: "muted" },
};

const HEAT_META: Record<Lead["heat"], { label: string; tone: ChipTone }> = {
  warm: { label: "Warm", tone: "warm" },
  hot: { label: "Hot", tone: "hot" },
  cold: { label: "Cold", tone: "cold" },
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function useAutoClose(open: boolean, onDone: () => void, delay = 1600) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => done.current(), delay);
    return () => window.clearTimeout(timer);
  }, [open, delay]);
}

function mapsUrl(activity: Pick<Activity, "locationName" | "locationAddress">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${activity.locationName}, ${activity.locationAddress}`,
  )}`;
}

function Breadcrumb({ kind, area, light }: { kind: string; area: Activity["area"]; light?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <span
        className={cn(
          "truncate text-[12px] font-semibold leading-[1.4]",
          light ? "text-white" : "text-[#2953a4]",
        )}
      >
        {kind}
      </span>
      <span
        className={cn("h-1 w-1 flex-none rounded-full", light ? "bg-white/70" : "bg-[#90a1b9]")}
        aria-hidden="true"
      />
      <span
        className={cn(
          "truncate text-[12px] leading-[1.4]",
          light ? "text-white/90" : "text-[#45556c]",
        )}
      >
        {areaLabel(area)}
      </span>
    </span>
  );
}

function Schedule({ activity, light }: { activity: Activity; light?: boolean }) {
  const tone = light ? "text-white/90" : "text-[#4f5963]";
  return (
    <span className={cn("flex items-center gap-2 text-[12px] leading-[1.4]", tone)}>
      <span className="flex items-center gap-1">
        <CalendarDots size={16} aria-hidden="true" />
        {displayDate(activity.date)}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={16} aria-hidden="true" />
        {activity.start} - {activity.end}
      </span>
    </span>
  );
}

/* ---------------------------------- List ---------------------------------- */

type ListFilter = {
  time: "today" | "week" | "month" | "custom" | null;
  from: string;
  to: string;
  status: ActivityStatus | null;
  kind: string | null;
};

const EMPTY_FILTER: ListFilter = { time: null, from: "", to: "", status: null, kind: null };

function withinTime(activity: Activity, filter: ListFilter) {
  if (!filter.time) return true;
  const date = activity.date;
  if (filter.time === "today") return date === todayIso();
  if (filter.time === "week") return date >= todayIso(-6) && date <= todayIso(6);
  if (filter.time === "month") return date.slice(0, 7) === todayIso().slice(0, 7);
  if (filter.from && date < filter.from) return false;
  if (filter.to && date > filter.to) return false;
  return true;
}

function filterIsActive(filter: ListFilter) {
  return Boolean(filter.time || filter.status || filter.kind);
}

export function ActivityCard({
  activity,
  onOpen,
  onCheckIn,
  compact = false,
}: {
  activity: Activity;
  onOpen: () => void;
  onCheckIn: () => void;
  /** Home carousel variant: single-line title, no check-in footer for upcoming activities. */
  compact?: boolean;
}) {
  const status = activityStatus(activity);
  const meta = STATUS_META[status];
  const showFooter = status !== "ongoing" && !(compact && status === "upcoming");
  return (
    <article className="card-enter flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-[var(--brand-soft)] pt-1.5">
      <div className="flex items-center justify-between gap-2 px-3 py-1">
        <Breadcrumb kind={activity.kind} area={activity.area} />
        <StatusChip tone={meta.tone}>{meta.label}</StatusChip>
      </div>
      <div className="mt-1 flex-1 rounded-[8px] border border-[#e2e8f0] bg-white">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full flex-col gap-3 p-3 text-left transition active:bg-[#f8fafc]"
        >
          <span className="flex w-full items-center gap-3">
            <span
              className={cn(
                "min-w-0 flex-1 text-[14px] font-medium leading-[1.4] text-[#020618]",
                compact && "truncate",
              )}
            >
              {activity.name}
            </span>
            <CaretRight size={16} className="flex-none text-[#16191c]" aria-hidden="true" />
          </span>
          <Schedule activity={activity} />
          <span className="flex w-full items-center gap-2 rounded-[4px] border border-[#dfe4ea] px-2 py-1.5">
            <MapPin size={20} className="flex-none text-[var(--brand-ink)]" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] leading-[1.4] text-[#020618]">
                {activity.locationName}
              </span>
              <span className="block truncate text-[12px] leading-[1.4] text-[#45556c]">
                {activity.locationAddress}
              </span>
            </span>
          </span>
        </button>
        {showFooter ? (
          <div className="mx-3 flex items-center justify-between border-t border-[#f1f1f1] py-3">
            {status === "upcoming" ? (
              <>
                <span className="text-[13px] font-medium leading-[1.4] text-[#384047]">
                  Belum Check In
                </span>
                <Button size="sm" onClick={onCheckIn}>
                  <SignIn size={16} aria-hidden="true" />
                  Check In
                </Button>
              </>
            ) : (
              <span className="text-[13px] font-medium leading-[1.4] text-[#65737f]">
                Check Out {activity.checkoutTime}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ActivityListScreen({
  activities,
  onOpen,
  onCheckIn,
  onCreate,
  onHome,
  onProfile,
  onSoon,
}: {
  activities: Activity[];
  onOpen: (id: string) => void;
  onCheckIn: (id: string) => void;
  onCreate: () => void;
  onHome: () => void;
  onProfile: () => void;
  onSoon: (label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ListFilter>(EMPTY_FILTER);
  const [draft, setDraft] = useState<ListFilter>(EMPTY_FILTER);
  const [filterOpen, setFilterOpen] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return activities.filter((activity) => {
      if (
        needle &&
        !`${activity.name} ${activity.locationName} ${activity.kind}`.toLowerCase().includes(needle)
      ) {
        return false;
      }
      if (filter.status && activityStatus(activity) !== filter.status) return false;
      if (filter.kind) {
        const kind = FILTER_KINDS.includes(activity.kind) ? activity.kind : "Lainnya";
        if (kind !== filter.kind) return false;
      }
      return withinTime(activity, filter);
    });
  }, [activities, filter, query]);

  const searching = query.trim() !== "" || filterIsActive(filter);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="hero-bg hero-safe flex flex-col gap-3 px-6 pb-6">
        <div>
          <h1 className="text-[18px] font-semibold leading-[1.2] text-white">Aktivitas</h1>
          <p className="mt-2 text-[14px] leading-[1.4] text-white">
            Pantau kegiatan dan hasil lapanganmu
          </p>
        </div>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <SearchField value={query} onChange={setQuery} placeholder="Cari Aktivitas" />
          </div>
          <FilterButton
            active={filterIsActive(filter)}
            onClick={() => {
              setDraft(filter);
              setFilterOpen(true);
            }}
          />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-24 pt-6">
        {activities.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              image="/activity/empty-activity.png"
              title="Belum Ada Aktivitas Hari Ini"
              message="Catat aktivitas yang Anda lakukan hari ini"
              action={
                <Button variant="outline" size="sm" onClick={onCreate}>
                  <Plus size={16} aria-hidden="true" />
                  Tambah Aktivitas
                </Button>
              }
            />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              image="/activity/empty-activity.png"
              title="Aktivitas Tidak Ditemukan"
              message="Coba kata kunci lain atau atur ulang filter."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setFilter(EMPTY_FILTER);
                  }}
                >
                  <ArrowCounterClockwise size={16} aria-hidden="true" />
                  Atur Ulang
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {searching ? (
              <p className="self-start text-[12px] leading-[1.4] text-[#4f5963]">
                {visible.length} aktivitas ditemukan
              </p>
            ) : null}
            {visible.map((activity) => (
              <div key={activity.id} className="w-full">
                <ActivityCard
                  activity={activity}
                  onOpen={() => onOpen(activity.id)}
                  onCheckIn={() => onCheckIn(activity.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {activities.length > 0 ? <Fab label="Tambah Aktivitas" above="nav" onClick={onCreate} /> : null}
      <BottomNav active="activity" onHome={onHome} onActivity={() => undefined} onProfile={onProfile} onSoon={onSoon} />

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} label="Filter aktivitas">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Filter</h2>
          <button
            type="button"
            onClick={() => setDraft(EMPTY_FILTER)}
            className="flex items-center gap-1 text-[13px] font-medium text-[var(--brand-ink)]"
          >
            <ArrowCounterClockwise size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
        <FilterGroup title="Waktu">
          {(
            [
              ["today", "Hari Ini"],
              ["week", "Minggu Ini"],
              ["month", "Bulan Ini"],
              ["custom", "Kustom"],
            ] as const
          ).map(([id, label]) => (
            <FilterChip
              key={id}
              label={label}
              selected={draft.time === id}
              onClick={() => setDraft((current) => ({ ...current, time: current.time === id ? null : id }))}
            />
          ))}
        </FilterGroup>
        {draft.time === "custom" ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <TextField
              label="Dari Tanggal"
              type="date"
              value={draft.from}
              onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))}
            />
            <TextField
              label="Sampai Tanggal"
              type="date"
              value={draft.to}
              min={draft.from || undefined}
              onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))}
            />
          </div>
        ) : null}
        <FilterGroup title="Status">
          {(["ongoing", "upcoming", "ended"] as const).map((id) => (
            <FilterChip
              key={id}
              label={STATUS_META[id].label}
              selected={draft.status === id}
              onClick={() =>
                setDraft((current) => ({ ...current, status: current.status === id ? null : id }))
              }
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Jenis Aktivitas">
          {FILTER_KINDS.map((kind) => (
            <FilterChip
              key={kind}
              label={kind}
              selected={draft.kind === kind}
              onClick={() =>
                setDraft((current) => ({ ...current, kind: current.kind === kind ? null : kind }))
              }
            />
          ))}
        </FilterGroup>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setFilter(draft);
            setFilterOpen(false);
          }}
        >
          Tampilkan Aktivitas
        </Button>
      </Sheet>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-[14px] font-medium leading-[1.4] text-[#16191c]">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/* --------------------------------- Create --------------------------------- */

function formReady(form: ActivityForm) {
  return Boolean(
    form.kind &&
      form.area &&
      form.name.trim() &&
      form.locationName &&
      form.date &&
      form.start &&
      form.end &&
      form.end > form.start,
  );
}

/** Types "0930" as "09:30" while the user writes, keeping only digits and a colon. */
function formatTypedTime(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

export function ActivityCreateScreen({
  form,
  onChange,
  onBack,
  onPickMap,
  onCreated,
}: {
  form: ActivityForm;
  onChange: (form: ActivityForm) => void;
  onBack: () => void;
  onPickMap: () => void;
  onCreated: () => void;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const [kindOpen, setKindOpen] = useState(false);
  const [kindDraft, setKindDraft] = useState<string | null>(null);
  const [placeOpen, setPlaceOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(false);
  const set = (patch: Partial<ActivityForm>) => onChange({ ...form, ...patch });
  const timeError = form.start && form.end && form.end <= form.start ? "Jam selesai harus setelah jam mulai." : undefined;

  useAutoClose(created, onCreated);

  async function submit() {
    setSaving(true);
    await wait(900);
    setSaving(false);
    setCreated(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-4">
        <PageIntro title="Buat Aktivitas" description="Isi detail kegiatan dan lokasi pelaksanaan" />
        <SelectField
          label="Jenis Aktivitas"
          placeholder="Pilih Jenis Aktivitas"
          value={form.kind}
          onClick={() => {
            setKindDraft(form.kind || null);
            setKindOpen(true);
          }}
        />
        <div>
          <FieldLabel>Jangkauan Area</FieldLabel>
          <div className="flex gap-3" role="radiogroup" aria-label="Jangkauan Area">
            <RadioCard checked={form.area === "inside"} label="Dalam Area Unit" onClick={() => set({ area: "inside" })} />
            <RadioCard checked={form.area === "outside"} label="Luar Area Unit" onClick={() => set({ area: "outside" })} />
          </div>
          <p className="mt-2 text-[12px] leading-[1.4] text-[#45556c]">
            Dalam Area Unit = radius ≤ 5km | Luar Area Unit &gt; 5km
          </p>
        </div>
        <TextField
          label="Nama Aktivitas"
          placeholder="Contoh: Kunjungan Mitra Koperasi Desa"
          value={form.name}
          maxLength={60}
          onChange={(event) => set({ name: event.target.value })}
        />
        <SelectField
          label="Nama Lokasi"
          placeholder="Masukkan nama lokasi"
          value={form.locationName ? `${form.locationName}, ${form.locationAddress}` : ""}
          chevron="right"
          emphasize
          onClick={() => setPlaceOpen(true)}
        />
        <SelectField
          label="Tanggal Pelaksanaan"
          placeholder="DD/MM/YYYY"
          value={form.date ? displayDate(form.date) : ""}
          chevron="calendar"
          onClick={() => setDateOpen(true)}
        />
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Dari Jam"
            placeholder="HH:MM"
            inputMode="numeric"
            maxLength={5}
            autoComplete="off"
            value={form.start}
            onChange={(event) => set({ start: formatTypedTime(event.target.value) })}
          />
          <TextField
            label="Sampai Jam"
            placeholder="HH:MM"
            inputMode="numeric"
            maxLength={5}
            autoComplete="off"
            value={form.end}
            error={timeError}
            onChange={(event) => set({ end: formatTypedTime(event.target.value) })}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 mt-6 bg-white px-6 pb-6 pt-3">
        <Button className="w-full" disabled={!formReady(form)} loading={saving} onClick={submit}>
          {saving ? "Menyimpan…" : "Lanjut"}
        </Button>
      </div>

      <DateWheelSheet
        open={dateOpen}
        value={form.date}
        onClose={() => setDateOpen(false)}
        onApply={(date) => {
          set({ date });
          setDateOpen(false);
        }}
      />
      <Sheet open={kindOpen} onClose={() => setKindOpen(false)} label="Pilih jenis aktivitas">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Jenis Aktivitas</h2>
        <div className="mt-2">
          <RadioList
            options={ACTIVITY_KINDS.map((kind) => ({ value: kind, label: kind }))}
            value={kindDraft}
            onChange={setKindDraft}
          />
        </div>
        <Button
          className="mt-5 w-full"
          disabled={!kindDraft}
          onClick={() => {
            if (kindDraft) set({ kind: kindDraft });
            setKindOpen(false);
          }}
        >
          Pilih
        </Button>
      </Sheet>

      <PlaceSheet
        open={placeOpen}
        onClose={() => setPlaceOpen(false)}
        onPick={(place) => {
          set({ locationName: place.name, locationAddress: place.address });
          setPlaceOpen(false);
        }}
        onMap={() => {
          setPlaceOpen(false);
          onPickMap();
        }}
      />

      <ResultDialog
        open={created}
        tone="success"
        title="Aktivitas Berhasil Dibuat"
        message="Detail aktivitas telah tersimpan dan dapat dilihat kembali."
        onClose={onCreated}
      />
    </div>
  );
}

function PlaceSheet({
  open,
  onClose,
  onPick,
  onMap,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (place: Place) => void;
  onMap: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Place | null>(null);
  const [locating, setLocating] = useState(false);
  const needle = query.trim().toLowerCase();
  const results = needle
    ? PLACES.filter((place) => `${place.name} ${place.address}`.toLowerCase().includes(needle))
    : [];

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(null);
  }, [open]);

  async function useCurrent() {
    setLocating(true);
    await wait(700);
    setLocating(false);
    setSelected(CURRENT_PLACE);
  }

  return (
    <Sheet open={open} onClose={onClose} label="Pilih nama lokasi">
      <div className="flex min-h-[420px] flex-col">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Nama Lokasi</h2>
        <div className="mt-4">
          <SearchField value={query} onChange={setQuery} placeholder="Cari nama jalan, gedung, no tempat" />
        </div>
        {needle && results.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f1f3f5] text-[#71808e]">
              <MapPinOff className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[16px] font-semibold leading-[1.4] text-[#16191c]">
              Lokasi Tidak Ditemukan
            </p>
            <p className="mt-1 max-w-[260px] text-[12px] leading-[1.4] text-[#4f5963]">
              Coba kata kunci lain atau tentukan lokasi secara manual melalui peta.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={onMap}>
              <MapTrifold size={16} aria-hidden="true" />
              Pilih Lokasi Lewat Peta
            </Button>
          </div>
        ) : (
          <div className="mt-2 flex-1">
            <PlaceRow
              icon={<Crosshair size={20} />}
              title={locating ? "Mencari lokasimu…" : "Pilih Lokasimu Saat Ini"}
              detail={selected === CURRENT_PLACE ? CURRENT_PLACE.address : undefined}
              selected={selected === CURRENT_PLACE}
              onClick={useCurrent}
            />
            {results.map((place) => (
              <PlaceRow
                key={place.name}
                icon={<MapPin size={20} />}
                title={place.name}
                detail={place.address}
                selected={selected === place}
                onClick={() => setSelected(place)}
              />
            ))}
            {!needle ? (
              <button
                type="button"
                onClick={onMap}
                className="mt-1 flex w-full items-center gap-2 py-3 text-left text-[14px] font-medium text-[var(--brand-ink)]"
              >
                <MapTrifold size={20} aria-hidden="true" />
                Pilih Lokasi Lewat Peta
              </button>
            ) : null}
          </div>
        )}
        <Button
          className="mt-4 w-full"
          disabled={!selected}
          onClick={() => {
            if (selected) onPick(selected);
          }}
        >
          Pilih Set Lokasi
        </Button>
      </div>
    </Sheet>
  );
}

function PlaceRow({
  icon,
  title,
  detail,
  selected,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  detail?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "-mx-2 flex w-[calc(100%+16px)] items-start gap-2 rounded-[8px] border-b border-[#f1f1f1] px-2 py-3 text-left transition",
        selected && "bg-[var(--brand-soft)]",
      )}
    >
      <span className="mt-0.5 flex-none text-[var(--brand-ink)]" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium leading-[1.4] text-[#16191c]">{title}</span>
        {detail ? (
          <span className="mt-0.5 block text-[12px] leading-[1.4] text-[#4f5963]">{detail}</span>
        ) : null}
      </span>
    </button>
  );
}

export function ActivityMapScreen({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (place: Place) => void;
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<MapView>({ ...USER_LOCATION, z: 1.25 });
  const [moving, setMoving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [place, setPlace] = useState<Place>(() => resolvePoint(USER_LOCATION));
  const [confirming, setConfirming] = useState(false);
  const cancelFly = useRef<(() => void) | null>(null);
  const results = useMapSearch(query);
  const busy = moving || resolving;

  // Fake reverse-geocoding once the map settles.
  useEffect(() => {
    if (moving) return;
    setResolving(true);
    const timer = window.setTimeout(() => {
      setPlace(resolvePoint(view));
      setResolving(false);
    }, 380);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moving]);

  const handleMoving = useCallback((next: boolean) => {
    if (next) cancelFly.current?.();
    setMoving(next);
  }, []);

  function flyTo(target: MapView) {
    cancelFly.current?.();
    setMoving(true);
    cancelFly.current = animateView(view, clampView(target), setView, () => {
      cancelFly.current = null;
      setMoving(false);
    });
  }

  return (
    <div className="relative flex h-full min-h-full flex-col bg-white pt-status">
      <div className="flex items-center gap-1 pr-6">
        <AppBar onBack={onBack} />
        <h1 className="text-[16px] font-semibold leading-[1.4] text-[#16191c]">Pilih Titik Lokasi</h1>
      </div>
      <div className="relative z-20 px-6 pb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama jalan, gedung, no tempat" />
        {query.trim() ? (
          <div className="card-enter absolute inset-x-6 top-[52px] max-h-[280px] overflow-y-auto rounded-[8px] border border-[#dfe4ea] bg-white py-1 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.35)]">
            {results.length ? (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    flyTo({ x: item.x, y: item.y, z: Math.max(view.z, 1.5) });
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition active:bg-[var(--brand-soft)]"
                >
                  <MapPin size={18} weight="fill" className="mt-0.5 flex-none text-[var(--brand-ink)]" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-medium leading-[1.4] text-[#16191c]">{item.name}</span>
                    <span className="block truncate text-[12px] leading-[1.4] text-[#4f5963]">{item.address}</span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-4 text-[13px] leading-[1.4] text-[#4f5963]">
                Lokasi tidak ditemukan. Coba geser peta untuk memilih titik secara manual.
              </p>
            )}
          </div>
        ) : null}
      </div>
      <div className="relative flex-1 overflow-hidden border-t border-[#eef0f3]">
        <DummyMap view={view} onViewChange={setView} onMovingChange={handleMoving} className="absolute inset-0" />

        {/* fixed centre pin */}
        <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
          <span className="map-pin-shadow" data-lifted={moving} />
          <svg className="map-pin" data-lifted={moving} width="44" height="52" viewBox="0 0 44 52">
            <path d="M22 51 15.5 41.5A20 20 0 1 1 28.5 41.5Z" fill="var(--brand)" />
            <circle cx="22" cy="21" r="8" fill="#fff" />
            <circle cx="22" cy="21" r="3.5" fill="var(--brand)" />
          </svg>
        </div>

        <div className="absolute right-4 top-4 flex flex-col gap-3">
          {(
            [
              ["Perbesar peta", Plus, 1.4],
              ["Perkecil peta", Minus, 1 / 1.4],
            ] as const
          ).map(([label, Icon, factor]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => flyTo({ ...view, z: view.z * factor })}
              className="grid h-10 w-10 place-items-center rounded-[10px] bg-white text-[var(--brand-ink)] shadow-[0_4px_14px_-8px_rgba(15,23,42,0.35)] transition active:scale-95"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Kembali ke lokasi saya"
          onClick={() => flyTo({ ...USER_LOCATION, z: Math.max(view.z, 1.25) })}
          className="absolute bottom-10 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--brand-ink)] shadow-[0_4px_14px_-8px_rgba(15,23,42,0.35)] transition active:scale-95"
        >
          <Crosshair size={22} />
        </button>
      </div>

      <section className="pb-safe relative z-10 -mt-6 rounded-t-[24px] bg-white px-6 pt-3 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.3)]">
        <span className="mx-auto block h-1 w-10 rounded-full bg-[#dfe4ea]" aria-hidden="true" />
        <h2 className="mt-5 text-[18px] font-semibold leading-[1.3] text-[#16191c]">Titik Lokasi Aktivitas</h2>
        <div className="mt-4 min-h-[60px]" aria-live="polite">
          {busy ? (
            <div className="flex flex-col gap-2 pl-8 pt-1" aria-label="Mencari alamat">
              <span className="skeleton h-4 w-3/5" />
              <span className="skeleton h-3 w-4/5" />
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <MapPin size={22} weight="fill" className="mt-px flex-none text-[var(--brand-ink)]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-[1.4] text-[#16191c]">{place.name}</p>
                <p className="mt-1 text-[13px] leading-[1.45] text-[#65737f]">{place.address}</p>
              </div>
            </div>
          )}
        </div>
        <Button
          className="mb-2 mt-5 w-full"
          disabled={busy}
          loading={confirming}
          onClick={async () => {
            setConfirming(true);
            await wait(450);
            onConfirm(place);
          }}
        >
          Konfirmasi Lokasi
        </Button>
      </section>
    </div>
  );
}

/* --------------------------------- Check in -------------------------------- */

export function ActivityCameraScreen({
  activity,
  onClose,
  onCheckedIn,
}: {
  activity: Activity;
  onClose: () => void;
  onCheckedIn: (time: string) => void;
}) {
  const [captured, setCaptured] = useState(false);
  const [flash, setFlash] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const time = useRef("");
  useAutoClose(result === "success", () => onCheckedIn(time.current));

  function capture() {
    setFlash(true);
    window.setTimeout(() => {
      setFlash(false);
      setCaptured(true);
    }, 180);
  }

  async function send() {
    setSending(true);
    await wait(1100);
    setSending(false);
    time.current = clockNow();
    setResult(activity.date < todayIso() ? "error" : "success");
  }

  return (
    <div className="flex h-full min-h-full flex-col bg-[#1b1f24] pt-status text-white">
      <div className="flex h-12 items-center gap-1 px-[14px]">
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 active:scale-95"
          aria-label="Tutup kamera"
        >
          <X size={18} />
        </button>
        <h1 className="text-[16px] font-medium leading-[1.4]">Foto Kegiatan</h1>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <img
          src="/activity/camera-scene.jpg"
          alt={captured ? "Foto kegiatan yang diambil" : "Pratinjau kamera"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500",
            !captured && "camera-live",
          )}
        />
        {!captured ? (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ef4444]" aria-hidden="true" />
            Kamera aktif
          </span>
        ) : null}
        {flash ? <span className="camera-flash" aria-hidden="true" /> : null}
      </div>
      <div className="flex h-[118px] flex-none items-center justify-center gap-3 px-6">
        {captured ? (
          <>
            <Button
              variant="ghost-light"
              className="flex-1"
              disabled={sending}
              onClick={() => setCaptured(false)}
            >
              Ulangi
            </Button>
            <Button className="flex-1" loading={sending} onClick={send}>
              {sending ? "Mengirim…" : "Kirim"}
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={capture}
            className="grid h-[70px] w-[70px] place-items-center rounded-full bg-white/90 ring-[6px] ring-white/25 transition active:scale-90"
            aria-label="Ambil foto"
          >
            <Camera size={22} className="text-[#16191c]" />
          </button>
        )}
      </div>
      <ResultDialog
        open={result === "success"}
        tone="success"
        title="Check-In Berhasil"
        message="Anda berhasil melakukan check-in aktivitas."
        onClose={() => onCheckedIn(time.current)}
      />
      <ResultDialog
        open={result === "error"}
        tone="error"
        title="Check-In Gagal"
        message="Anda tidak bisa check-in karena telah melewati batas waktu."
        onClose={onClose}
      >
        <Button onClick={onClose}>Mengerti</Button>
      </ResultDialog>
    </div>
  );
}

/* --------------------------------- Detail --------------------------------- */

type LeadFilter = { simulation: "belum" | "sudah" | null; heat: "warm" | "hot" | null };
type LeadSheet =
  | { type: "lead"; lead: Lead }
  | { type: "template"; lead: Lead }
  | null;

export function ActivityDetailScreen({
  activity,
  onBack,
  onCheckIn,
  onCheckOut,
  onAddLead,
  onSimulate,
  onVerify,
}: {
  activity: Activity;
  onBack: () => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onAddLead: () => void;
  onSimulate: (leadId: string) => void;
  onVerify: (leadId: string) => void;
}) {
  const status = activityStatus(activity);
  const [tab, setTab] = useState<"prospect" | "other">("prospect");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadFilter>({ simulation: null, heat: null });
  const [draft, setDraft] = useState<LeadFilter>(filter);
  const [filterOpen, setFilterOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [sheet, setSheet] = useState<LeadSheet>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checkout, setCheckout] = useState<"confirm" | "done" | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  useAutoClose(sent, () => setSent(false));
  useAutoClose(checkout === "done", () => setCheckout(null));

  const prospects = activity.leads.filter((lead) => lead.prospect);
  const others = activity.leads.filter((lead) => !lead.prospect);
  const needle = query.trim().toLowerCase();
  const visibleProspects = prospects.filter((lead) => {
    if (needle && !lead.name.toLowerCase().includes(needle)) return false;
    if (filter.simulation === "belum" && lead.simulation) return false;
    if (filter.simulation === "sudah" && !lead.simulation) return false;
    if (filter.heat && lead.heat !== filter.heat) return false;
    return true;
  });
  const visibleOthers = others.filter((lead) => !needle || lead.name.toLowerCase().includes(needle));
  const filterActive = Boolean(filter.simulation || filter.heat);

  const templateLead = sheet?.type === "template" ? sheet.lead : null;
  const templates = templateLead?.simulation ? MESSAGE_TEMPLATES.simulated : MESSAGE_TEMPLATES.fresh;
  const visibleTemplates = templates.filter((item) =>
    item.title.toLowerCase().includes(templateQuery.trim().toLowerCase()),
  );

  function openTemplate(lead: Lead) {
    setTemplate(null);
    setTemplateQuery("");
    setSheet({ type: "template", lead });
  }

  async function sendTemplate() {
    setSending(true);
    await wait(900);
    setSending(false);
    setSheet(null);
    setSent(true);
  }

  async function confirmCheckout() {
    setCheckingOut(true);
    await wait(900);
    setCheckingOut(false);
    onCheckOut();
    setCheckout("done");
  }

  const empty = activity.leads.length === 0;

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <header className="hero-bg px-6 py-4 text-white">
        <Breadcrumb kind={activity.kind} area={activity.area} light />
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="mt-1 flex w-full items-center gap-3 text-left"
          aria-haspopup="dialog"
        >
          <h1 className="min-w-0 flex-1 text-[18px] font-semibold leading-[1.3]">{activity.name}</h1>
          <CaretRight size={18} aria-label="Lihat detail aktivitas" />
        </button>
        <div className="mt-1.5">
          <Schedule activity={activity} light />
        </div>
        <a
          href={mapsUrl(activity)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/15"
        >
          <MapPin size={20} className="flex-none" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium leading-[1.4]">{activity.locationName}</span>
            <span className="block truncate text-[12px] leading-[1.4] text-white/85">{activity.locationAddress}</span>
          </span>
          <ArrowUpRight size={18} className="flex-none" aria-label="Buka di Google Maps" />
        </a>
        {status === "ongoing" ? (
          <Button variant="ghost-light" className="mt-3 w-full" onClick={() => setCheckout("confirm")}>
            <SignOut size={16} aria-hidden="true" />
            Check Out
          </Button>
        ) : status === "upcoming" ? (
          <Button variant="ghost-light" className="mt-3 w-full" onClick={onCheckIn}>
            <SignIn size={16} aria-hidden="true" />
            Check In
          </Button>
        ) : (
          <p className="mt-3 text-[12px] leading-[1.4] text-white/85">
            Check in {activity.checkinTime} · Check out {activity.checkoutTime}
          </p>
        )}
      </header>

      <div className="sticky-under-status sticky z-10 flex bg-white" role="tablist" aria-label="Daftar leads">
        {(
          [
            ["prospect", "Prospek", prospects.length],
            ["other", status === "ended" ? "Tidak Prospek" : "Belum Prospek", others.length],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 border-b py-3 text-[14px] leading-[1.4] transition",
              tab === id
                ? "border-b-2 border-[var(--brand-ink)] font-medium text-[var(--brand-ink)]"
                : "border-[#dfe4ea] text-[#4f5963]",
            )}
          >
            {label}
            <span
              className={cn(
                "rounded-[4px] px-1.5 text-[12px] leading-[18px]",
                tab === id ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]" : "bg-[#f1f3f5] text-[#4f5963]",
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <main className={cn("flex flex-1 flex-col px-6 pt-4", status === "ongoing" ? "pb-6" : "pb-10")}>
        {empty ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <EmptyState
              image="/activity/empty-leads.png"
              title="Belum Ada Leads Tercatat"
              message={
                status === "upcoming"
                  ? "Check in terlebih dahulu untuk mulai mencatat leads."
                  : "Tambahkan leads untuk melengkapi hasil aktivitas."
              }
            />
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <SearchField value={query} onChange={setQuery} placeholder="Cari Nama Leads" />
              </div>
              <FilterButton
                active={filterActive}
                onClick={() => {
                  setDraft(filter);
                  setFilterOpen(true);
                }}
              />
            </div>
            <div className="mt-3 flex flex-col gap-3" role="tabpanel">
              {tab === "prospect"
                ? visibleProspects.map((lead) => (
                    <ProspectCard key={lead.id} lead={lead} onClick={() => setSheet({ type: "lead", lead })} />
                  ))
                : visibleOthers.map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => onVerify(lead.id)}
                      className="card-enter flex items-center gap-3 rounded-[8px] border border-[#e2e8f0] p-3 text-left transition active:bg-[#f8fafc]"
                    >
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.4] text-[#020618]">
                        {lead.name}
                      </span>
                      <StatusChip tone="cold">Cold</StatusChip>
                      <CaretRight size={16} className="flex-none" aria-hidden="true" />
                    </button>
                  ))}
              {(tab === "prospect" ? visibleProspects : visibleOthers).length === 0 ? (
                <p className="py-10 text-center text-[13px] leading-[1.4] text-[#4f5963]">
                  {needle || filterActive ? "Leads tidak ditemukan." : "Belum ada leads di daftar ini."}
                </p>
              ) : null}
            </div>
          </>
        )}
      </main>

      {status === "ongoing" ? (
        <BottomBar>
          <Button className="w-full" onClick={onAddLead}>
            Tambah Leads Baru
          </Button>
        </BottomBar>
      ) : null}

      <Sheet open={infoOpen} onClose={() => setInfoOpen(false)} label="Detail aktivitas">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Detail Aktivitas</h2>
        <dl className="mt-3 rounded-[8px] border border-[#dfe4ea] px-3">
          {(
            [
              [ClipboardText, "Jenis Aktivitas", activity.kind],
              [UsersThree, "Jangkauan Area", areaLabel(activity.area)],
              [CalendarDots, "Tanggal Aktivitas", longDate(activity.date)],
              [Clock, "Waktu Pelaksanaan", `${activity.start} - ${activity.end}`],
              [MapPin, "Lokasi", activity.locationName],
            ] as const
          ).map(([Icon, label, value], index) => (
            <div
              key={label}
              className={cn("flex items-center gap-2 py-3 text-[13px]", index < 4 && "border-b border-[#f1f1f1]")}
            >
              <Icon size={18} className="flex-none text-[#16191c]" aria-hidden="true" />
              <dt className="flex-none text-[#16191c]">{label}</dt>
              <dd className="ml-auto truncate pl-3 text-right font-medium text-[#16191c]">{value}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-5 text-[16px] font-semibold leading-[1.3] text-[#16191c]">Detail Kehadiran</h2>
        <div className="mt-3 rounded-[8px] border border-[#dfe4ea] px-3">
          <button
            type="button"
            disabled={!activity.checkinTime}
            onClick={() => {
              setInfoOpen(false);
              setCheckinOpen(true);
            }}
            className="flex w-full items-center gap-2 border-b border-[#f1f1f1] py-3 text-left text-[13px] text-[#16191c]"
          >
            <ImageSquare size={18} aria-hidden="true" />
            <span className="flex-1">Foto Check-in</span>
            {activity.checkinTime ? (
              <CaretRight size={16} aria-hidden="true" />
            ) : (
              <span className="text-[#4f5963]">-</span>
            )}
          </button>
          <div className="flex items-center gap-2 border-b border-[#f1f1f1] py-3 text-[13px] text-[#16191c]">
            <Clock size={18} aria-hidden="true" />
            <span className="flex-1">Waktu Check-in</span>
            <span className="font-medium">{activity.checkinTime ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 py-3 text-[13px] text-[#16191c]">
            <Clock size={18} aria-hidden="true" />
            <span className="flex-1">Waktu Check-out</span>
            <span className="font-medium">{activity.checkoutTime ?? "-"}</span>
          </div>
        </div>
      </Sheet>

      <Sheet open={checkinOpen} onClose={() => setCheckinOpen(false)} label="Foto check-in">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Foto Check-in</h2>
        <img
          src="/activity/checkin-photo.jpg"
          alt="Foto kegiatan saat check-in"
          className="mt-4 aspect-[345/350] w-full rounded-[8px] border border-[#dfe4ea] object-cover"
        />
      </Sheet>

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} label="Filter leads">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Filter</h2>
          <button
            type="button"
            onClick={() => setDraft({ simulation: null, heat: null })}
            className="flex items-center gap-1 text-[13px] font-medium text-[var(--brand-ink)]"
          >
            <ArrowCounterClockwise size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
        <FilterGroup title="Simulasi">
          {(
            [
              ["belum", "Belum Simulasi"],
              ["sudah", "Sudah Simulasi"],
            ] as const
          ).map(([id, label]) => (
            <FilterChip
              key={id}
              label={label}
              selected={draft.simulation === id}
              onClick={() =>
                setDraft((current) => ({ ...current, simulation: current.simulation === id ? null : id }))
              }
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Status">
          {(["warm", "hot"] as const).map((id) => (
            <FilterChip
              key={id}
              label={HEAT_META[id].label}
              selected={draft.heat === id}
              onClick={() => setDraft((current) => ({ ...current, heat: current.heat === id ? null : id }))}
            />
          ))}
        </FilterGroup>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setFilter(draft);
            setTab("prospect");
            setFilterOpen(false);
          }}
        >
          Tampilkan Leads
        </Button>
      </Sheet>

      <Sheet open={sheet?.type === "lead"} onClose={() => setSheet(null)} label="Detail leads">
        {sheet?.type === "lead" ? (
          <LeadSummary
            lead={sheet.lead}
            footer={
              sheet.lead.simulation ? (
                <Button className="w-full" onClick={() => openTemplate(sheet.lead)}>
                  Follow Up
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSheet(null);
                      onSimulate(sheet.lead.id);
                    }}
                  >
                    Lanjut Simulasi Gadai
                  </Button>
                  <Button variant="link" onClick={() => openTemplate(sheet.lead)}>
                    Follow Up
                  </Button>
                </div>
              )
            }
          />
        ) : null}
      </Sheet>

      <Sheet open={sheet?.type === "template"} onClose={() => setSheet(null)} label="Pilih template pesan">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Pilih Template Pesan</h2>
        <div className="mt-4">
          <SearchField value={templateQuery} onChange={setTemplateQuery} placeholder="Cari Template" />
        </div>
        <div className="mt-1 min-h-[200px]">
          <RadioList
            options={visibleTemplates.map((item) => ({ value: item.id, label: item.title, detail: item.detail }))}
            value={template}
            onChange={setTemplate}
          />
          {visibleTemplates.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-[#4f5963]">Template tidak ditemukan.</p>
          ) : null}
        </div>
        <Button className="mt-5 w-full" disabled={!template} loading={sending} onClick={sendTemplate}>
          {sending ? "Mengirim…" : "Kirim"}
        </Button>
      </Sheet>

      <ResultDialog
        open={sent}
        tone="success"
        title="Pengiriman Berhasil"
        message="Pesan Follow-up Anda berhasil terkirim ke nomor WhatsApp leads."
        onClose={() => setSent(false)}
      />
      <ResultDialog
        open={checkout === "confirm"}
        tone="warning"
        title="Selesaikan Aktivitas?"
        message="Pastikan aktivitas kunjungan Anda telah selesai."
        onClose={() => setCheckout(null)}
      >
        <Button loading={checkingOut} onClick={confirmCheckout}>
          {checkingOut ? "Memproses…" : "Check Out"}
        </Button>
        <Button variant="link" disabled={checkingOut} onClick={() => setCheckout(null)}>
          Batalkan
        </Button>
      </ResultDialog>
      <ResultDialog
        open={checkout === "done"}
        tone="success"
        title="Check Out Berhasil"
        message="Aktivitas kunjungan berhasil diselesaikan."
        onClose={() => setCheckout(null)}
      />
    </div>
  );
}

function ProspectCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  // Hot is only reachable after a simulation has been made.
  const heat = HEAT_META[lead.simulation || lead.heat !== "hot" ? lead.heat : "warm"];
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-enter rounded-[8px] border border-[#e2e8f0] text-left transition active:bg-[#f8fafc]"
    >
      <span className="flex items-center justify-between gap-2 border-b border-[#f1f1f1] px-3 py-2">
        {lead.simulation ? (
          <span className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[var(--brand-ink)]">
            <Checks size={14} aria-hidden="true" />
            Sudah Simulasi
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[#384047]">
            <Scales size={14} aria-hidden="true" />
            Belum Simulasi
          </span>
        )}
        <StatusChip tone={heat.tone}>{heat.label}</StatusChip>
      </span>
      <span className="flex items-center gap-3 px-3 py-3">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium leading-[1.4] text-[#020618]">
            {lead.name}
          </span>
          <span className="block text-[14px] leading-[1.4] text-[#384047]">{maskPhone(lead.phone)}</span>
        </span>
        <CaretRight size={18} className="flex-none" aria-hidden="true" />
      </span>
    </button>
  );
}

function LeadHeader({ lead }: { lead: Lead }) {
  const heat = HEAT_META[lead.heat];
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
        <User size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] leading-[1.4] text-[#4f5963]">{lead.name}</span>
        <span className="block text-[16px] font-semibold leading-[1.4] text-[#16191c]">{maskPhone(lead.phone)}</span>
      </span>
      <StatusChip tone={heat.tone}>{heat.label}</StatusChip>
    </div>
  );
}

function Estimate({ items }: { items: Collateral[] }) {
  const { low, high } = estimateCollateral(items);
  return (
    <div className="rounded-[8px] bg-[var(--brand-soft)] px-4 py-4 text-center">
      <p className="text-[13px] leading-[1.4] text-[#4f5963]">Estimasi Nilai Pinjaman</p>
      <p className="mt-1 text-[16px] font-semibold leading-[1.4] text-[var(--brand-ink)]">
        {rupiah(low)} - {rupiah(high)}
      </p>
    </div>
  );
}

function CollateralList({ items }: { items: Collateral[] }) {
  return (
    <ul className="rounded-[8px] border border-[#dfe4ea] px-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-2 border-b border-[#f1f1f1] py-3 last:border-b-0">
          {item.type === "emas" ? (
            <Coins size={18} className="flex-none text-[#4f5963]" aria-hidden="true" />
          ) : (
            <DeviceMobile size={18} className="flex-none text-[#4f5963]" aria-hidden="true" />
          )}
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.4] text-[#16191c]">
            {item.item}
          </span>
          <span className="flex flex-none items-center gap-1.5 text-[12px] leading-[1.4] text-[#4f5963]">
            {collateralDetail(item).map((part, index) => (
              <span key={part} className="flex items-center gap-1.5">
                {index > 0 ? <span className="h-1 w-1 rounded-full bg-[#90a1b9]" aria-hidden="true" /> : null}
                {part}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function LeadSummary({ lead, footer }: { lead: Lead; footer: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <LeadHeader lead={lead} />
      {lead.simulation ? (
        <>
          <Estimate items={lead.simulation} />
          <CollateralList items={lead.simulation} />
        </>
      ) : null}
      <div className="mt-1">{footer}</div>
    </div>
  );
}

/* ---------------------------------- Leads ---------------------------------- */

export function LeadAddScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const valid = name.trim().length >= 3;
  return (
    <form
      className="flex min-h-full flex-col bg-white pt-status"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!valid) return;
        setLoading(true);
        await wait(600);
        onSubmit(name.trim().replace(/\s+/g, " "));
      }}
    >
      <AppBar onBack={onBack} />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-4">
        <PageIntro title="Tambah Leads Baru" description="Masukkan nama leads untuk melanjutkan proses." />
        <TextField
          label="Nama Lengkap"
          placeholder="Masukkan Nama Leads"
          value={name}
          autoComplete="name"
          maxLength={60}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3">
        <Button type="submit" className="w-full" disabled={!valid} loading={loading}>
          {loading ? "Menyiapkan…" : "Verifikasi Leads"}
        </Button>
      </div>
    </form>
  );
}

export function LeadVerifyScreen({
  name,
  registered,
  onCancel,
  onRegistered,
  onVerified,
}: {
  name: string;
  registered: boolean;
  onCancel: () => void;
  onRegistered: () => void;
  onVerified: (next: "simulate" | "activity") => void;
}) {
  const [checking, setChecking] = useState(false);
  const [state, setState] = useState<"cancel" | "registered" | "verified" | null>(null);
  const leadId = useMemo(() => `#ID${Math.floor(1_000_000 + Math.random() * 8_999_999)}`, []);
  const message = `Sales-300#Cabang-100${leadId.replace("#", "#")}Message`;

  async function check() {
    setChecking(true);
    await wait(1400);
    setChecking(false);
    setState(registered ? "registered" : "verified");
  }

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={() => setState("cancel")} close />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-4">
        <PageIntro
          title="Verifikasi Nomor WhatsApp"
          description="Scan kode QR atau kirim pesan secara manual sesuai format untuk verifikasi."
        />
        <section className="qr-card flex flex-col items-center rounded-[8px] px-6 py-6 text-center">
          <h2 className="text-[16px] font-semibold leading-[1.4] text-[#16191c]">Scan Kode QR</h2>
          <div className="mt-3 rounded-[12px] bg-white p-3 shadow-[0_6px_20px_-12px_rgba(18,43,92,0.4)]">
            <img src="/activity/qr-code.png" alt={`Kode QR verifikasi ${name}`} className="h-[140px] w-[140px]" />
          </div>
          <p className="mt-3 text-[12px] leading-[1.4] text-[#4f5963]">{leadId}</p>
          <p className="text-[14px] font-semibold leading-[1.4] text-[#16191c]">{name}</p>
        </section>
        <section>
          <h2 className="text-[14px] font-medium leading-[1.4] text-[#16191c]">Manual via Chat WhatsApp</h2>
          <div className="mt-2 rounded-[8px] border border-[#dfe4ea] p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
                <ChatCircleText size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] leading-[1.4] text-[#4f5963]">Nomor Tujuan</span>
                <span className="block text-[16px] font-semibold leading-[1.4] text-[#16191c]">081277629902</span>
              </span>
            </div>
            <div className="mt-3 w-full rounded-[8px] bg-[var(--brand-soft)] px-3 py-2.5">
              <span className="block text-[12px] leading-[1.4] text-[#4f5963]">Format Pesan</span>
              <span className="mt-0.5 block break-all text-[16px] leading-[1.4] text-[var(--brand-ink)]">{message}</span>
            </div>
          </div>
        </section>
      </div>
      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4">
        <Button className="w-full" loading={checking} onClick={check}>
          {checking ? "Mengecek Status…" : "Cek Status"}
        </Button>
      </div>

      <ResultDialog
        open={state === "cancel"}
        tone="warning"
        title="Batalkan Verifikasi?"
        message="Data nama leads akan tetap tersimpan meskipun proses dibatalkan."
        onClose={() => setState(null)}
      >
        <Button onClick={onCancel}>Ya, Batalkan</Button>
        <Button variant="link" onClick={() => setState(null)}>
          Lanjutkan Verifikasi
        </Button>
      </ResultDialog>
      <ResultDialog
        open={state === "registered"}
        tone="warning"
        title="Nomor Sudah Terdaftar"
        message="Nomor WhatsApp sudah terdaftar sebagai Nasabah/SO lain, proses penambahan leads tidak dapat dilanjutkan."
      >
        <Button onClick={onRegistered}>Selesai</Button>
      </ResultDialog>
      <ResultDialog
        open={state === "verified"}
        tone="success"
        title="Verifikasi Berhasil"
        message="Data leads telah disimpan. Lanjutkan ke simulasi gadai untuk proses follow-up."
      >
        <Button onClick={() => onVerified("simulate")}>Lanjut Simulasi Gadai</Button>
        <Button variant="link" onClick={() => onVerified("activity")}>
          Kembali ke Activity
        </Button>
      </ResultDialog>
    </div>
  );
}

/* -------------------------------- Simulation -------------------------------- */

const MAX_COLLATERAL = 3;

type CollateralSheetView = "form" | "item" | "karat" | "category" | "product";

function CollateralSheet({
  open,
  type,
  onClose,
  onAdd,
}: {
  open: boolean;
  type: CollateralType;
  onClose: () => void;
  onAdd: (item: Collateral) => void;
}) {
  const [view, setView] = useState<CollateralSheetView>("form");
  const [item, setItem] = useState("");
  const [karat, setKarat] = useState<number | null>(null);
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("");
  const [pick, setPick] = useState<string | number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setView("form");
    setItem("");
    setKarat(null);
    setWeight("");
    setCategory("");
  }, [open]);

  const lockedKarat = item === "LM Antam";
  const weightValue = Number(weight.replace(",", "."));
  const ready =
    type === "emas" ? Boolean(item && karat && weightValue > 0 && weightValue <= 1000) : Boolean(category && item);

  function openPicker(next: CollateralSheetView, current: string | number | null) {
    setPick(current);
    setQuery("");
    setView(next);
  }

  function choose() {
    if (view === "item" && typeof pick === "string") {
      setItem(pick);
      if (pick === "LM Antam") setKarat(24);
    }
    if (view === "karat" && typeof pick === "number") setKarat(pick);
    if (view === "category" && typeof pick === "string") {
      if (pick !== category) setItem("");
      setCategory(pick);
    }
    if (view === "product" && typeof pick === "string") setItem(pick);
    setView("form");
  }

  const needle = query.trim().toLowerCase();
  const pickerOptions: { value: string | number; label: string }[] =
    view === "item"
      ? GOLD_ITEMS.map((value) => ({ value, label: value }))
      : view === "karat"
        ? GOLD_KARATS.map((entry) => ({ value: entry.value, label: entry.label }))
        : view === "category"
          ? ELECTRONIC_CATEGORIES.filter((value) => value.toLowerCase().includes(needle)).map((value) => ({
              value,
              label: value,
            }))
          : (ELECTRONIC_ITEMS[category] ?? [])
              .filter((entry) => entry.name.toLowerCase().includes(needle))
              .map((entry) => ({ value: entry.name, label: entry.name }));
  const titles: Record<CollateralSheetView, string> = {
    form: "Tambah Jaminan",
    item: "Barang Jaminan",
    karat: "Kadar Emas (Karat)",
    category: "Barang Jaminan",
    product: "Nama Barang",
  };
  const searchable = view === "category" || view === "product";

  return (
    <Sheet open={open} onClose={onClose} label={titles[view]}>
      <div key={view} className="screen-enter-fast">
        <div className="flex items-center gap-2">
          {view !== "form" ? (
            <button
              type="button"
              onClick={() => setView("form")}
              className="-ml-2 grid h-8 w-8 place-items-center rounded-full text-[#16191c] hover:bg-[#f1f3f5]"
              aria-label="Kembali ke Tambah Jaminan"
            >
              <CaretRight size={16} className="rotate-180" />
            </button>
          ) : null}
          <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">{titles[view]}</h2>
        </div>
        {view === "form" ? (
          <div className="mt-4 flex flex-col gap-4">
            {type === "emas" ? (
              <>
                <SelectField
                  label="Barang Jaminan"
                  placeholder="Pilih Barang Jaminan"
                  value={item}
                  onClick={() => openPicker("item", item || null)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    label="Kadar Emas (Karat)"
                    placeholder="Pilih Kadar"
                    value={karat ? String(karat) : ""}
                    disabled={lockedKarat}
                    onClick={() => openPicker("karat", karat)}
                  />
                  <TextField
                    label="Berat Emas (Gram)"
                    placeholder="Berat"
                    inputMode="decimal"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value.replace(/[^0-9.,]/g, "").slice(0, 6))}
                  />
                </div>
              </>
            ) : (
              <>
                <SelectField
                  label="Barang Jaminan"
                  placeholder="Pilih Barang Jaminan"
                  value={category}
                  onClick={() => openPicker("category", category || null)}
                />
                <SelectField
                  label="Nama Barang"
                  placeholder="Pilih Nama Barang"
                  value={item}
                  disabled={!category}
                  onClick={() => openPicker("product", item || null)}
                />
              </>
            )}
            <Button
              className="mt-2 w-full"
              disabled={!ready}
              onClick={() =>
                onAdd(
                  type === "emas"
                    ? { id: uid("c"), type, item, karat: karat ?? 24, weight: weightValue }
                    : { id: uid("c"), type, item, category },
                )
              }
            >
              Selanjutnya
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            {searchable ? (
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder={view === "category" ? "Cari Barang Jaminan" : "Cari Merek atau Seri"}
              />
            ) : null}
            {pickerOptions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f1f3f5] text-[#71808e]">
                  <PackageX className="h-7 w-7" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[16px] font-semibold leading-[1.4] text-[#16191c]">Barang Tidak Ditemukan</p>
                <p className="mt-1 max-w-[270px] text-[12px] leading-[1.4] text-[#4f5963]">
                  Nama barang yang Anda cari tidak ada dalam sistem, periksa kata kunci dan coba lagi.
                </p>
              </div>
            ) : (
              <RadioList options={pickerOptions} value={pick} onChange={setPick} />
            )}
            <Button className="mt-5 w-full" disabled={pick === null || pickerOptions.length === 0} onClick={choose}>
              Pilih
            </Button>
          </div>
        )}
      </div>
    </Sheet>
  );
}

type ElectronicPicker = "category" | "product" | null;

export function SimulationScreen({
  lead,
  onBack,
  onSent,
  onNotice,
}: {
  /** null for the quick simulation from the home page (no lead to send an offer to). */
  lead: Lead | null;
  onBack: () => void;
  onSent: (items: Collateral[]) => void;
  onNotice: (message: string) => void;
}) {
  const [type, setType] = useState<CollateralType>("emas");
  const [items, setItems] = useState<Collateral[]>([]);
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [picker, setPicker] = useState<ElectronicPicker>(null);
  const [pick, setPick] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  useAutoClose(sent, () => onSent(result));

  const result: Collateral[] =
    type === "emas" ? items : product ? [{ id: "elektronik", type, item: product, category }] : [];

  function changeType(next: CollateralType) {
    if (next === type) return;
    if (items.length || category) onNotice("Detail jaminan direset karena jenis barang berubah.");
    setType(next);
    setItems([]);
    setCategory("");
    setProduct("");
  }

  function openPicker(next: Exclude<ElectronicPicker, null>) {
    setPick(next === "category" ? category || null : product || null);
    setQuery("");
    setPicker(next);
  }

  async function calculate() {
    setCalculating(true);
    await wait(1000);
    setCalculating(false);
    setResultOpen(true);
  }

  async function sendOffer() {
    setSending(true);
    await wait(900);
    setSending(false);
    setResultOpen(false);
    setSent(true);
  }

  const needle = query.trim().toLowerCase();
  const pickerOptions =
    picker === "category"
      ? ELECTRONIC_CATEGORIES.filter((value) => value.toLowerCase().includes(needle))
      : (ELECTRONIC_ITEMS[category] ?? [])
          .map((entry) => entry.name)
          .filter((value) => value.toLowerCase().includes(needle));

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-4">
        <PageIntro
          title="Simulasi Gadai"
          description="Masukkan detail barang jaminan untuk melihat estimasi nilai pinjaman."
        />
        <div className="flex flex-col gap-4">
          <div className="flex gap-3" role="radiogroup" aria-label="Jenis barang jaminan">
            <RadioCard checked={type === "emas"} label="Emas" onClick={() => changeType("emas")} />
            <RadioCard checked={type === "elektronik"} label="Elektronik" onClick={() => changeType("elektronik")} />
          </div>
          {type === "emas" ? (
            <div>
              <h2 className="mb-3 text-[16px] font-medium leading-[1.4] text-[#16191c]">Detail Jaminan</h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="card-enter flex items-center gap-3 rounded-[8px] bg-[var(--brand-soft)] p-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.4] text-[#020618]">
                      {item.item}
                    </span>
                    <span className="flex flex-none items-center gap-1.5 text-[12px] leading-[1.4] text-[#45556c]">
                      {collateralDetail(item).map((part, index) => (
                        <span key={part} className="flex items-center gap-1.5">
                          {index > 0 ? (
                            <span className="h-1 w-1 rounded-full bg-[#90a1b9]" aria-hidden="true" />
                          ) : null}
                          {part}
                        </span>
                      ))}
                    </span>
                    <button
                      type="button"
                      onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                      className="-m-1.5 grid h-8 w-8 flex-none place-items-center rounded-full text-[#16191c] transition hover:bg-white hover:text-[#d73926]"
                      aria-label={`Hapus ${item.item}`}
                    >
                      <Trash size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setAdding(true)}
                disabled={items.length >= MAX_COLLATERAL}
                className={cn(
                  "flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-dashed border-[var(--brand)] text-[14px] font-medium text-[var(--brand-ink)] transition active:scale-[0.99] disabled:border-[#c6ccd1] disabled:text-[#9aa5b1]",
                  items.length > 0 && "mt-3",
                )}
              >
                <Plus size={16} aria-hidden="true" />
                Tambah Jaminan ({items.length}/{MAX_COLLATERAL})
              </button>
            </div>
          ) : (
            <>
              <SelectField
                label="Barang Jaminan"
                placeholder="Pilih Barang Jaminan"
                value={category}
                onClick={() => openPicker("category")}
              />
              <SelectField
                label="Nama Barang"
                placeholder="Pilih Nama Barang"
                value={product}
                disabled={!category}
                onClick={() => openPicker("product")}
              />
            </>
          )}
        </div>
        {type === "elektronik" ? <Disclaimer /> : null}
      </div>
      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4">
        {type === "emas" ? (
          <div className="mb-4">
            <Disclaimer />
          </div>
        ) : null}
        <Button className="w-full" disabled={result.length === 0} loading={calculating} onClick={calculate}>
          {calculating ? "Menghitung…" : "Hitung"}
        </Button>
      </div>

      <CollateralSheet
        open={adding}
        type="emas"
        onClose={() => setAdding(false)}
        onAdd={(item) => {
          setItems((current) => [...current, item]);
          setAdding(false);
        }}
      />

      <Sheet
        open={picker !== null}
        onClose={() => setPicker(null)}
        label={picker === "product" ? "Nama Barang" : "Barang Jaminan"}
      >
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">
          {picker === "product" ? "Nama Barang" : "Barang Jaminan"}
        </h2>
        <div className="mt-3">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={picker === "product" ? "Cari Merek atau Seri" : "Cari Barang Jaminan"}
          />
        </div>
        {pickerOptions.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f1f3f5] text-[#71808e]">
              <PackageX className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[16px] font-semibold leading-[1.4] text-[#16191c]">Barang Tidak Ditemukan</p>
            <p className="mt-1 max-w-[270px] text-[12px] leading-[1.4] text-[#4f5963]">
              Nama barang yang Anda cari tidak ada dalam sistem, periksa kata kunci dan coba lagi.
            </p>
          </div>
        ) : (
          <RadioList options={pickerOptions.map((value) => ({ value, label: value }))} value={pick} onChange={setPick} />
        )}
        <Button
          className="mt-5 w-full"
          disabled={pick === null || pickerOptions.length === 0}
          onClick={() => {
            if (pick === null) return;
            if (picker === "category") {
              if (pick !== category) setProduct("");
              setCategory(pick);
            } else setProduct(pick);
            setPicker(null);
          }}
        >
          Pilih
        </Button>
      </Sheet>

      <Sheet open={resultOpen} onClose={() => setResultOpen(false)} label="Hasil simulasi">
        {lead ? (
          <LeadSummary
            lead={{ ...lead, simulation: result }}
            footer={
              <div className="flex flex-col gap-3">
                <Button className="w-full" loading={sending} onClick={sendOffer}>
                  {sending ? "Mengirim…" : "Kirim Penawaran"}
                </Button>
                <Button variant="link" disabled={sending} onClick={() => setResultOpen(false)}>
                  Kembali ke Simulasi
                </Button>
              </div>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            <Estimate items={result} />
            <CollateralList items={result} />
            <Button className="mt-1 w-full" onClick={() => setResultOpen(false)}>
              Kembali
            </Button>
          </div>
        )}
      </Sheet>

      <ResultDialog
        open={sent}
        tone="success"
        title="Penawaran Berhasil Dikirim"
        message="Penawaran berhasil dikirim ke nomor leads."
        onClose={() => onSent(result)}
      />
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="text-center text-[12px] leading-[1.4] text-[#65737f]">
      Hasil perkiraan nilai dapat berbeda dengan perhitungan di cabang sesuai dengan ketentuan yang berlaku.
    </p>
  );
}
