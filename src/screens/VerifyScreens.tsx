import { useEffect, useState } from "react";
import {
  Backspace,
  Check,
  CheckCircle,
  Eyeglasses,
  Lightbulb,
  LockKey,
  ScanSmiley,
  SmileyBlank,
} from "@phosphor-icons/react";
import { AppBar, Button } from "@/components/mobile";
import { cn } from "@/lib/cn";
import { BUSINESS_UNITS, type BusinessUnit } from "@/lib/demo";

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/* ------------------------------ Face artwork ------------------------------- */

// Points used for the "detected landmarks" overlay, in the face SVG's coordinates.
const LANDMARKS: [number, number][] = [
  [84, 116], [98, 112], [112, 116], // left brow
  [128, 116], [142, 112], [156, 116], // right brow
  [88, 132], [98, 129], [108, 132], // left eye
  [132, 132], [142, 129], [152, 132], // right eye
  [120, 140], [120, 152], [112, 160], [128, 160], // nose
  [104, 174], [120, 180], [136, 174], // mouth
  [68, 136], [72, 164], [84, 188], [102, 200], [120, 204], [138, 200], [156, 188], [168, 164], [172, 136], // jaw
];

const MESH: [number, number][] = [
  [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [9, 10], [10, 11],
  [8, 12], [9, 12], [12, 13], [13, 14], [13, 15], [14, 16], [15, 18], [16, 17], [17, 18],
  [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 27],
  [16, 21], [18, 25], [6, 19], [11, 27], [17, 23],
];

function FaceArt({ scanning, detected }: { scanning: boolean; detected: boolean }) {
  return (
    <svg viewBox="0 0 240 300" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="face-oval">
          <ellipse cx="120" cy="148" rx="82" ry="108" />
        </clipPath>
        <linearGradient id="scan-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
          <stop offset="0.85" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="room" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#4a5568" />
          <stop offset="1" stopColor="#1a202c" />
        </radialGradient>
      </defs>
      <rect width="240" height="300" fill="url(#room)" />
      <g className={scanning ? undefined : "face-idle"}>
        <path d="M18 300c8-58 54-82 102-82s94 24 102 82Z" fill="#33415c" />
        <path d="M96 218c6 14 42 14 48 0l-4-26h-40Z" fill="#dca07c" />
        <ellipse cx="66" cy="140" rx="9" ry="15" fill="#e6b08e" />
        <ellipse cx="174" cy="140" rx="9" ry="15" fill="#e6b08e" />
        <ellipse cx="120" cy="140" rx="54" ry="68" fill="#f1c4a3" />
        <path
          d="M64 132c-6-56 28-84 60-82 36 2 60 30 52 84-4-24-22-40-54-40-30 0-50 14-58 38Z"
          fill="#2b2320"
        />
        <path d="M86 117q12-7 24 0M130 117q12-7 24 0" stroke="#2b2320" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="98" cy="132" rx="5" ry="5.5" fill="#2b2320" />
        <ellipse cx="142" cy="132" rx="5" ry="5.5" fill="#2b2320" />
        <path d="M120 138q-5 14 1 20" stroke="#c98d6c" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M104 173q16 11 32 0" stroke="#b0614a" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* oval guide */}
      <ellipse
        cx="120"
        cy="148"
        rx="82"
        ry="108"
        fill="none"
        stroke={scanning ? "var(--brand)" : "#ffffff"}
        strokeWidth={scanning ? 3 : 2}
        strokeDasharray={scanning ? undefined : "6 6"}
        className={scanning ? "face-oval-active" : undefined}
      />

      {scanning ? (
        <g clipPath="url(#face-oval)">
          <rect x="30" y="-60" width="180" height="60" fill="url(#scan-beam)" className="face-scan-beam" />
          <g className="face-mesh">
            {MESH.map(([a, b], index) => (
              <line
                key={index}
                x1={LANDMARKS[a][0]}
                y1={LANDMARKS[a][1]}
                x2={LANDMARKS[b][0]}
                y2={LANDMARKS[b][1]}
                stroke="#ffffff"
                strokeOpacity="0.55"
                strokeWidth="0.8"
              />
            ))}
          </g>
          {LANDMARKS.map(([x, y], index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2.2"
              fill="#ffffff"
              className="face-dot"
              style={{ animationDelay: `${300 + index * 40}ms` }}
            />
          ))}
        </g>
      ) : null}

      {detected ? (
        <g stroke="#22c55e" strokeWidth="4" strokeLinecap="round" fill="none" className="face-brackets">
          <path d="M58 64v-16h16M166 48h16v16M182 232v16h-16M74 248h-16v-16" />
        </g>
      ) : null}
    </svg>
  );
}

/* ------------------------------- Face intro -------------------------------- */

export function FaceIntroScreen({
  enroll,
  onStart,
  onBack,
  onUsePin,
}: {
  enroll: boolean;
  onStart: () => void;
  onBack: () => void;
  onUsePin?: () => void;
}) {
  const tips = [
    { icon: Lightbulb, text: "Pastikan cahaya cukup dan wajah tidak membelakangi lampu." },
    { icon: Eyeglasses, text: "Lepaskan kacamata, masker, atau topi." },
    { icon: SmileyBlank, text: "Posisikan wajah lurus ke kamera di dalam bingkai." },
  ];
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="px-6 pt-2">
        <div className="mx-auto grid h-[120px] w-[120px] place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
          <ScanSmiley size={64} weight="duotone" />
        </div>
        <h1 className="mt-6 text-[24px] font-semibold leading-[1.2] text-[#16191c]">
          {enroll ? "Daftarkan Wajah Anda" : "Verifikasi Wajah"}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          {enroll
            ? "Foto wajah digunakan untuk memastikan hanya Anda yang dapat masuk ke akun MITRA."
            : "Ambil foto wajah untuk melanjutkan sesi Anda."}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {tips.map((tip) => (
            <li key={tip.text} className="flex items-start gap-3 rounded-[8px] border border-[#e2e8f0] p-3">
              <tip.icon size={20} className="mt-px flex-none text-[var(--brand-ink)]" aria-hidden="true" />
              <span className="text-[13px] leading-[1.4] text-[#4f5963]">{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pb-safe sticky bottom-0 mt-auto flex flex-col gap-2 bg-white px-6 pt-4">
        <Button className="w-full" onClick={onStart}>
          Ambil Foto Wajah
        </Button>
        {onUsePin ? (
          <Button variant="link" className="w-full" onClick={onUsePin}>
            Gunakan PIN
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------- Face camera ------------------------------- */

const SCAN_STEPS = ["Mendeteksi wajah…", "Memindai titik wajah…", "Wajah terdeteksi"];

export function FaceCameraScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<"live" | "flash" | "scan">("live");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "scan") return;
    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 2000),
      window.setTimeout(onDone, 2900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [phase, onDone]);

  function capture() {
    setPhase("flash");
    window.setTimeout(() => setPhase("scan"), 200);
  }

  const scanning = phase === "scan";
  const detected = scanning && step === 2;

  return (
    <div className="relative flex h-full min-h-full flex-col bg-[#0f1115] pt-status text-white">
      <div className="flex items-center justify-between pr-4">
        <AppBar onBack={onBack} close tone="dark" />
        <h1 className="text-[16px] font-semibold leading-[1.4]">Foto Wajah</h1>
        <span className="w-10" />
      </div>

      <div className="relative mx-4 mt-2 flex-1 overflow-hidden rounded-[20px]">
        <div className="absolute inset-0">
          <FaceArt scanning={scanning} detected={detected} />
        </div>
        {phase === "flash" ? <div className="camera-flash absolute inset-0 bg-white" /> : null}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 pb-8 pt-5">
        <p
          className={cn(
            "flex min-h-9 items-center gap-2 rounded-full px-4 text-[14px] font-medium leading-[1.4] transition-colors",
            detected ? "bg-[#22c55e]/15 text-[#4ade80]" : "bg-white/10 text-white",
          )}
          aria-live="polite"
        >
          {detected ? <CheckCircle size={18} weight="fill" aria-hidden="true" /> : null}
          {scanning ? SCAN_STEPS[step] : "Posisikan wajah di dalam bingkai"}
        </p>
        {scanning ? (
          <div className="h-[72px]" />
        ) : (
          <button
            type="button"
            onClick={capture}
            disabled={phase !== "live"}
            aria-label="Ambil foto wajah"
            className="grid h-[72px] w-[72px] place-items-center rounded-full border-4 border-white/80 transition active:scale-95"
          >
            <span className="h-[56px] w-[56px] rounded-full bg-white" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Face verifying ----------------------------- */

export function FaceVerifyingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-white px-8 text-center">
      <span className="tick-spinner" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <i key={index} style={{ transform: `rotate(${index * 45}deg)`, animationDelay: `${index * 0.1 - 0.8}s` }} />
        ))}
      </span>
      <h1 className="mt-8 text-[28px] font-semibold leading-[1.2] text-[#16191c]">Memverifikasi Wajah</h1>
      <p className="mt-3 text-[15px] leading-[1.45] text-[#4f5963]">
        Jangan tutup halaman ini. Proses biasanya kurang dari 5 detik.
      </p>
    </div>
  );
}

/* ---------------------------------- PIN ------------------------------------ */

function PinDots({ length, error }: { length: number; error: boolean }) {
  return (
    <div className={cn("flex justify-center gap-4", error && "otp-shake")} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-4 w-4 rounded-full border-2 transition",
            error
              ? "border-[#d73926] bg-[#d73926]"
              : index < length
                ? "scale-110 border-[var(--brand)] bg-[var(--brand)]"
                : "border-[#cbd5e1]",
          )}
        />
      ))}
    </div>
  );
}

function Keypad({ onDigit, onDelete, disabled }: { onDigit: (digit: string) => void; onDelete: () => void; disabled?: boolean }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (disabled) return;
      if (/^\d$/.test(event.key)) onDigit(event.key);
      else if (event.key === "Backspace") onDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDigit, onDelete, disabled]);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return (
    <div className="grid grid-cols-3 gap-y-2 px-6">
      {keys.map((key, index) =>
        key === "" ? (
          <span key={index} />
        ) : (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => (key === "del" ? onDelete() : onDigit(key))}
            aria-label={key === "del" ? "Hapus" : key}
            className="mx-auto grid h-16 w-20 place-items-center rounded-full text-[26px] font-medium text-[#16191c] transition active:bg-[var(--brand-soft)]"
          >
            {key === "del" ? <Backspace size={26} /> : key}
          </button>
        ),
      )}
    </div>
  );
}

function usePinEntry(onComplete: (pin: string) => void) {
  const [pin, setPin] = useState("");
  const add = (digit: string) => {
    if (pin.length >= 6) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 6) window.setTimeout(() => onComplete(next), 160);
  };
  const remove = () => setPin(pin.slice(0, -1));
  return { pin, setPin, add, remove };
}

export function PinCreateScreen({ onBack, onDone }: { onBack: () => void; onDone: (pin: string) => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const entry = usePinEntry((pin) => {
    if (!first) {
      setFirst(pin);
      entry.setPin("");
      return;
    }
    if (pin !== first) {
      setError(true);
      window.setTimeout(() => {
        setError(false);
        entry.setPin("");
      }, 700);
      return;
    }
    onDone(pin);
  });
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={first ? () => (setFirst(null), entry.setPin("")) : onBack} />
      <div className="px-6 pt-2 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
          <LockKey size={28} weight="duotone" />
        </span>
        <h1 className="mt-4 text-[24px] font-semibold leading-[1.2] text-[#16191c]">
          {first ? "Konfirmasi PIN" : "Buat PIN"}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          {first
            ? "Masukkan ulang 6 digit PIN yang sama."
            : "PIN 6 digit dipakai sebagai cadangan jika verifikasi wajah tidak bisa dilakukan."}
        </p>
        <div className="mt-8">
          <PinDots length={entry.pin.length} error={error} />
        </div>
        <p className="mt-4 min-h-5 text-[13px] leading-5 text-[#d73926]" aria-live="polite">
          {error ? "PIN tidak sama, silakan ulangi." : ""}
        </p>
      </div>
      <div className="pb-safe mt-auto pt-4">
        <Keypad onDigit={entry.add} onDelete={entry.remove} disabled={error} />
      </div>
    </div>
  );
}

export function PinVerifyScreen({
  expectedPin,
  onBack,
  onSuccess,
  onUseFace,
}: {
  expectedPin: string;
  onBack: () => void;
  onSuccess: () => void;
  onUseFace: () => void;
}) {
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const entry = usePinEntry(async (pin) => {
    setChecking(true);
    await wait(500);
    setChecking(false);
    if (pin === expectedPin) {
      onSuccess();
      return;
    }
    setAttempts((current) => current + 1);
    setError(true);
    window.setTimeout(() => {
      setError(false);
      entry.setPin("");
    }, 700);
  });
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="px-6 pt-2 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
          <LockKey size={28} weight="duotone" />
        </span>
        <h1 className="mt-4 text-[24px] font-semibold leading-[1.2] text-[#16191c]">Masukkan PIN</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">Masukkan 6 digit PIN akun MITRA Anda.</p>
        <div className="mt-8">
          <PinDots length={entry.pin.length} error={error} />
        </div>
        <p className="mt-4 min-h-5 text-[13px] leading-5 text-[#d73926]" aria-live="polite">
          {error || attempts > 0 ? `PIN salah. Sisa percobaan ${Math.max(0, 3 - attempts)} kali.` : ""}
        </p>
        <p className="text-[12px] leading-[1.4] text-[#65737f]">
          PIN demo: <span className="font-medium text-[var(--brand-ink)]">{expectedPin}</span>
        </p>
        <Button variant="link" className="mt-2" onClick={onUseFace}>
          Gunakan Verifikasi Wajah
        </Button>
      </div>
      <div className="pb-safe mt-auto pt-2">
        <Keypad onDigit={entry.add} onDelete={entry.remove} disabled={error || checking} />
      </div>
    </div>
  );
}

/* ------------------------------ Verify choice ------------------------------ */

export function VerifyChoiceScreen({
  name,
  sessionResumed,
  onFace,
  onPin,
  onLogout,
}: {
  name: string;
  sessionResumed: boolean;
  onFace: () => void;
  onPin: () => void;
  onLogout: () => void;
}) {
  const options = [
    {
      id: "face",
      icon: ScanSmiley,
      title: "Verifikasi Wajah",
      detail: "Paling cepat, cukup ambil foto wajah.",
      onClick: onFace,
    },
    {
      id: "pin",
      icon: LockKey,
      title: "Masukkan PIN",
      detail: "Gunakan 6 digit PIN yang sudah dibuat.",
      onClick: onPin,
    },
  ];
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <div className="px-6 pt-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[12px] font-medium text-[var(--brand-ink)]">
          {sessionResumed ? "Sesi 30 hari masih aktif" : "Login berhasil"}
        </span>
        <h1 className="mt-4 text-[24px] font-semibold leading-[1.2] text-[#16191c]">
          Halo, {name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          Verifikasi identitas Anda untuk melanjutkan ke MITRA.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={option.onClick}
              className="card-enter flex items-center gap-4 rounded-[12px] border border-[#e2e8f0] p-4 text-left transition active:scale-[0.99] active:bg-[var(--brand-soft)]"
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-ink)]">
                <option.icon size={26} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-[1.4] text-[#16191c]">{option.title}</span>
                <span className="block text-[13px] leading-[1.4] text-[#4f5963]">{option.detail}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="pb-safe mt-auto px-6 pt-4 text-center">
        <Button variant="link" onClick={onLogout}>
          Bukan Anda? Keluar
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------- Success --------------------------------- */

export function SuccessScreen({
  title,
  message,
  onContinue,
}: {
  title: string;
  message: string;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="success-burst grid h-24 w-24 place-items-center rounded-full bg-[#e7f7ef] text-[#13a06b]">
          <Check size={44} weight="bold" />
        </span>
        <h1 className="mt-6 text-[24px] font-semibold leading-[1.2] text-[#16191c]">{title}</h1>
        <p className="mt-2 text-[14px] leading-[1.45] text-[#4f5963]">{message}</p>
      </div>
      <div className="pb-safe px-6 pt-4">
        <Button className="w-full" onClick={onContinue}>
          Lanjut
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------ Business unit ------------------------------ */

export function BusinessUnitScreen({
  value,
  onChange,
  onContinue,
}: {
  value: BusinessUnit | null;
  onChange: (unit: BusinessUnit) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <div className="px-6 pt-10">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">Pilih Unit Bisnis</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          Tampilan aplikasi akan mengikuti branding unit bisnis yang Anda pilih.
        </p>
        <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="Unit bisnis">
          {BUSINESS_UNITS.map((unit) => {
            const selected = value === unit.id;
            return (
              <button
                key={unit.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(unit.id)}
                className={cn(
                  "flex items-center gap-4 rounded-[12px] border p-4 text-left transition active:scale-[0.99]",
                  selected ? "border-2 border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[#e2e8f0]",
                )}
              >
                <span
                  className="grid h-12 w-12 flex-none place-items-center rounded-[10px] text-[13px] font-bold"
                  style={{ background: unit.color, color: unit.id === "gms" ? "#1b1f24" : "#fff" }}
                >
                  {unit.short}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-[1.4] text-[#16191c]">{unit.name}</span>
                  <span className="flex items-center gap-1.5 text-[13px] leading-[1.4] text-[#4f5963]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: unit.color }} />
                    {unit.tagline}
                  </span>
                </span>
                <span
                  className={cn(
                    "grid h-6 w-6 flex-none place-items-center rounded-full border-2 transition",
                    selected ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]" : "border-[#cbd5e1]",
                  )}
                >
                  {selected ? <Check size={14} weight="bold" /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-[8px] bg-[#f8fafc] p-3 text-[12px] leading-[1.5] text-[#4f5963]">
          Pilihan ini untuk kebutuhan demo. Di aplikasi final, unit bisnis ditentukan otomatis dari akun.
        </p>
      </div>
      <div className="pb-safe mt-auto px-6 pt-4">
        <Button className="w-full" disabled={!value} onClick={onContinue}>
          Masuk ke Beranda
        </Button>
      </div>
    </div>
  );
}
