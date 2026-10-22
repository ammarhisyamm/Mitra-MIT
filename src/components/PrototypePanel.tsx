import { Check, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DEMO, UNITS, type BusinessUnit, type Mode, type Scenario, type Screen } from "@/lib/demo";
import { cn } from "@/lib/cn";

const firstGroups = [
  { label: "Masuk", screens: ["login"] },
  {
    label: "Verifikasi wajah",
    screens: ["face-intro", "face-camera", "face-review", "face-check", "face-failed"],
  },
  { label: "Buat PIN", screens: ["pin-create"] },
  { label: "Akun siap", screens: ["success"] },
  { label: "Unit kerja", screens: ["unit"] },
  { label: "Beranda unit", screens: ["home"] },
  {
    label: "Aktivitas",
    screens: [
      "activity",
      "activity-type",
      "activity-schedule",
      "activity-created",
      "activity-checkin",
      "activity-leads",
      "activity-checkout",
      "activity-done",
    ],
  },
] as const;

const returningGroups = [
  { label: "Masuk dan sesi", screens: ["login", "verify-choice"] },
  {
    label: "Verifikasi identitas",
    screens: ["verify-pin", "face-intro", "face-camera", "face-review", "face-check", "face-failed"],
  },
  { label: "Beranda unit", screens: ["success", "unit", "home"] },
  {
    label: "Aktivitas",
    screens: [
      "activity",
      "activity-type",
      "activity-schedule",
      "activity-created",
      "activity-checkin",
      "activity-leads",
      "activity-checkout",
      "activity-done",
    ],
  },
] as const;

const jumpScreens: { value: Screen; label: string; mode?: Mode }[] = [
  { value: "login", label: "Masuk" },
  { value: "verify-choice", label: "Pilih verifikasi", mode: "returning" },
  { value: "verify-pin", label: "Verifikasi PIN", mode: "returning" },
  { value: "face-intro", label: "Pengantar verifikasi wajah" },
  { value: "face-camera", label: "Ambil foto wajah" },
  { value: "face-review", label: "Periksa foto" },
  { value: "pin-create", label: "Buat PIN" },
  { value: "success", label: "Akun siap" },
  { value: "unit", label: "Unit kerja" },
  { value: "home", label: "Beranda unit" },
  { value: "activity", label: "Daftar aktivitas" },
  { value: "activity-type", label: "Buat aktivitas" },
  { value: "activity-schedule", label: "Detail aktivitas" },
  { value: "activity-created", label: "Aktivitas dibuat" },
  { value: "activity-checkin", label: "Check-in" },
  { value: "activity-leads", label: "Input leads" },
  { value: "activity-checkout", label: "Checkout" },
  { value: "activity-done", label: "Aktivitas selesai" },
  { value: "forgot", label: "Lupa kata sandi" },
  { value: "forgot-otp", label: "Kode verifikasi" },
  { value: "forgot-reset", label: "Kata sandi baru" },
  { value: "forgot-done", label: "Kata sandi diperbarui" },
  { value: "force-change", label: "Ganti kata sandi default" },
  { value: "face-failed", label: "Verifikasi wajah gagal" },
];

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#344054]">{title}</p>
        <p className="mt-0.5 text-[10.5px] leading-snug text-[#7c8ba3]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className="switch"
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#7c8ba3]">
      {children}
    </p>
  );
}

export function PrototypePanel({
  mode,
  sessionActive,
  scenario,
  forceFaceFail,
  forceLoginFail,
  unit,
  screen,
  onMode,
  onSession,
  onScenario,
  onForceFaceFail,
  onForceLoginFail,
  onUnit,
  onRestart,
  onJump,
  onClose,
}: {
  mode: Mode;
  sessionActive: boolean;
  scenario: Scenario;
  forceFaceFail: boolean;
  forceLoginFail: boolean;
  unit: BusinessUnit;
  screen: Screen;
  onMode: (mode: Mode) => void;
  onSession: (value: boolean) => void;
  onScenario: (value: Scenario) => void;
  onForceFaceFail: (value: boolean) => void;
  onForceLoginFail: (value: boolean) => void;
  onUnit: (unit: BusinessUnit) => void;
  onRestart: () => void;
  onJump: (screen: Screen, mode?: Mode) => void;
  onClose?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const groups = mode === "first" ? firstGroups : returningGroups;
  const isExtra = !groups.some((group) => (group.screens as readonly string[]).includes(screen));
  const activeGroup = groups.findIndex((group) =>
    (group.screens as readonly string[]).includes(screen),
  );
  const currentExtra = jumpScreens.find((item) => item.value === screen);

  async function copyDemo() {
    try {
      await navigator.clipboard.writeText(
        `Akun ${DEMO.nip} · PIN ${DEMO.pin} · OTP ${DEMO.otp}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#eaf1ff] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#1c3d7f]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Prototype v0.1
            </span>
            <span className="rounded-full border border-[#e4e9f1] bg-white px-2 py-0.5 text-[9.5px] font-semibold text-[#7c8ba3]">
              Brand MIT
            </span>
          </div>
          <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-[-0.025em] text-[#101a2e]">
            First login MITRA
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#667085]">
            Verifikasi wajah, pembuatan PIN, pemulihan kata sandi, dan routing unit dalam satu
            alur yang bisa diklik.
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#eef2f8] text-[#475467]"
            aria-label="Tutup panel prototype"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <FieldLabel>Skenario</FieldLabel>
        <div className="segment" role="group" aria-label="Pilih skenario alur">
          <button
            type="button"
            aria-pressed={mode === "first"}
            onClick={() => onMode("first")}
          >
            Pertama kali
          </button>
          <button
            type="button"
            aria-pressed={mode === "returning"}
            onClick={() => onMode("returning")}
          >
            Kembali masuk
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-0">
        {mode === "returning" ? (
          <ToggleRow
            title="Sesi 30 hari masih aktif"
            description="Jika aktif, alur langsung ke beranda. Matikan untuk menguji verifikasi ulang."
            checked={sessionActive}
            onChange={onSession}
          />
        ) : null}
        <ToggleRow
          title="Kata sandi default"
          description="Setelah masuk, pengguna wajib membuat kata sandi baru."
          checked={scenario === "default-password"}
          onChange={(value) => onScenario(value ? "default-password" : "normal")}
        />
        <ToggleRow
          title="Simulasikan login gagal"
          description="Menampilkan error kredensial yang tidak sesuai."
          checked={forceLoginFail}
          onChange={onForceLoginFail}
        />
        <ToggleRow
          title="Simulasikan wajah gagal"
          description="Verifikasi wajah berakhir dengan state gagal."
          checked={forceFaceFail}
          onChange={onForceFaceFail}
        />
      </div>

      <div className="mt-4">
        <FieldLabel>Unit kerja</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {UNITS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onUnit(item.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-[10px] border px-2 py-2 text-[11px] font-bold transition",
                unit === item.id
                  ? "border-[#2852a3] bg-[#f2f7ff] text-[#1c3d7f]"
                  : "border-[#e4e9f1] bg-white text-[#7c8ba3] hover:border-[#c8d4e8]",
              )}
              aria-pressed={unit === item.id}
            >
              <span
                className="h-2 w-2 rounded-[2px]"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.short}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10.5px] text-[#98a2b3]">
          Unit menentukan branding tujuan setelah login.
        </p>
      </div>

      <div className="mt-4">
        <FieldLabel>Lompat ke layar</FieldLabel>
        <select
          className="h-10 w-full rounded-[10px] border border-[#e4e9f1] bg-white px-3 text-[12px] font-medium text-[#344054]"
          value={jumpScreens.some((item) => item.value === screen) ? screen : ""}
          onChange={(event) => {
            const item = jumpScreens.find((entry) => entry.value === event.target.value);
            if (item) onJump(item.value, item.mode);
          }}
        >
          <option value="" disabled>
            Pilih layar…
          </option>
          {jumpScreens.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#e8ecf3] bg-[#fbfcfe] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7c8ba3]">
            Alur saat ini
          </p>
          <span className="rounded-full bg-white px-2 py-0.5 text-[9.5px] font-semibold text-[#5b6b85]">
            {mode === "first" ? "First login" : "Returning"}
          </span>
        </div>
        <div className="flow-list mt-2">
          {groups.map((group, index) => {
            const active = index === activeGroup && !isExtra;
            const done = activeGroup > index || (activeGroup === -1 && false);
            return (
              <div
                key={group.label}
                className="flow-item"
                data-state={active ? "active" : done ? "done" : undefined}
              >
                <span className="flow-dot">
                  {done ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : index + 1}
                </span>
                {group.label}
              </div>
            );
          })}
          {isExtra && currentExtra ? (
            <div className="flow-item" data-state="active">
              <span className="flow-dot">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
              </span>
              {currentExtra.label}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-dashed border-[#d7dfec] bg-white/70 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7c8ba3]">
          Data demo
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#5b6b85]">
          NIP <span className="font-bold text-[#344054]">{DEMO.nip}</span> · PIN{" "}
          <span className="font-bold text-[#344054]">{DEMO.pin}</span> · OTP{" "}
          <span className="font-bold text-[#344054]">{DEMO.otp}</span>
        </p>
        <button
          type="button"
          onClick={copyDemo}
          className="mt-2 text-[10.5px] font-semibold text-[#2852a3] hover:underline"
        >
          {copied ? "Data demo disalin" : "Salin data demo"}
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#122b5c] px-3 text-[12px] font-semibold text-white transition hover:bg-[#0f234d]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Ulangi alur
        </button>
        <a
          href="https://mit-ds-git-design-syst-bc82ea-ammarhisyam151-gmailcoms-projects.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-[12px] border border-[#e4e9f1] bg-white px-3 text-[11.5px] font-semibold text-[#475467] transition hover:bg-[#f8fafc]"
        >
          Guideline
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-[#98a2b3]">
        Copy mengikuti Global UX Writing Guidelines MIT DS (Draft). Semua rekomendasi masih
        berstatus usulan hingga ditinjau.
      </p>
    </aside>
  );
}
