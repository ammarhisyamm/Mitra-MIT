import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowsClockwise,
  Backspace,
  BuildingOffice,
  CaretRight,
  Camera,
  Check,
  DotsNine,
  Eyeglasses,
  ScanSmiley,
  Sun,
  UserFocus,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { AppBar, Button, RadioDot, Sheet } from "@/components/mobile";
import { cn } from "@/lib/cn";
import { BUSINESS_UNITS, type Account, type BusinessUnit } from "@/lib/demo";

const SAMPLE_FACE = "/face/sample-face.jpg";

/* ------------------------- Verifikasi Identitas ---------------------------- */

function ChoiceRow({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[#f1f1f1] py-4 text-left transition active:bg-[#f8fafc]"
    >
      <span className="grid h-9 w-9 flex-none place-items-center text-[#16191c]" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium leading-[1.4] text-black">{title}</span>
        <span className="block text-[13px] leading-[1.4] text-[#384047]">{detail}</span>
      </span>
      <CaretRight size={18} className="flex-none text-[#16191c]" aria-hidden="true" />
    </button>
  );
}

export function VerifyChoiceScreen({
  onBack,
  onFace,
  onPin,
}: {
  onBack: () => void;
  onFace: () => void;
  onPin: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="px-6 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">Verifikasi Identitas</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#384047]">
          Sesi Anda telah berakhir. Pilih salah satu cara untuk masuk kembali.
        </p>
        <div className="mt-5">
          <ChoiceRow
            icon={<UserFocus size={28} />}
            title="Verifikasi Wajah"
            detail="Gunakan pemindaian wajah yang tersimpan"
            onClick={onFace}
          />
          <ChoiceRow
            icon={<DotsNine size={28} weight="bold" />}
            title="Gunakan PIN"
            detail="Masukkan 6 angka PIN akun Anda"
            onClick={onPin}
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Face: guide -------------------------------- */

const FACE_TIPS = [
  { icon: Sun, title: "Cahaya cukup", detail: "Hadap ke arah cahaya, hindari cahaya di belakang." },
  { icon: Eyeglasses, title: "Wajah terlihat jelas", detail: "Lepas masker, topi, dan kacamata gelap." },
  { icon: ScanSmiley, title: "Posisi kamera", detail: "Sejajarkan wajah di dalam bingkai." },
];

export function FaceGuideScreen({
  enroll,
  onBack,
  onStart,
}: {
  enroll: boolean;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="flex-1 px-6 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">
          {enroll ? "Daftarkan Wajah" : "Verifikasi Wajah"}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#384047]">
          {enroll
            ? "Foto wajah ini akan dipakai untuk verifikasi saat Anda masuk berikutnya."
            : "Kami mencocokkan wajah Anda dengan foto yang terdaftar."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <figure className="overflow-hidden rounded-[8px] bg-[#e9f6eb] p-1">
            <figcaption className="flex items-center justify-center gap-1 py-1 text-[14px] font-medium text-[#24663f]">
              <Check size={14} weight="bold" aria-hidden="true" />
              Benar
            </figcaption>
            <img
              src="/face/guide-good.jpg"
              alt="Contoh benar: wajah terang dan menghadap kamera"
              className="aspect-[164/154] w-full rounded-[6px] object-cover"
            />
          </figure>
          <figure className="overflow-hidden rounded-[8px] bg-[#fbd8d4] p-1">
            <figcaption className="flex items-center justify-center gap-1 py-1 text-[14px] font-medium text-[#d73926]">
              <X size={14} weight="bold" aria-hidden="true" />
              Salah
            </figcaption>
            <span className="relative block overflow-hidden rounded-[6px]">
              <img
                src="/face/guide-bad.jpg"
                alt="Contoh salah: wajah gelap dan terlalu dekat"
                className="aspect-[164/154] w-full object-cover"
              />
              <span className="absolute inset-0 bg-black/40" aria-hidden="true" />
            </span>
          </figure>
        </div>
        <h2 className="mt-6 text-[16px] font-medium leading-[1.4] text-[#16191c]">Panduan Singkat</h2>
        <ul className="mt-3 rounded-[8px] border border-[#dfe4ea] px-3">
          {FACE_TIPS.map((tip, index) => (
            <li
              key={tip.title}
              className={cn("flex gap-2 py-3", index < FACE_TIPS.length - 1 && "border-b border-[#f1f1f1]")}
            >
              <tip.icon size={18} className="mt-0.5 flex-none text-[#16191c]" aria-hidden="true" />
              <span>
                <span className="block text-[13px] font-medium leading-[1.4] text-[#16191c]">{tip.title}</span>
                <span className="block text-[11px] leading-[1.4] text-[#65737f]">{tip.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4">
        <Button className="w-full" onClick={onStart}>
          Mulai Foto Wajah
        </Button>
      </div>
    </div>
  );
}

/* ------------------------- Face: camera + review --------------------------- */

type CameraState = "starting" | "live" | "blocked";

export type FaceCapture = { photo: string; dark: boolean };

/** Average brightness (0-255) of the centre of a canvas, used to reject dark selfies. */
function centreBrightness(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return 128;
  const w = Math.round(canvas.width * 0.4);
  const h = Math.round(canvas.height * 0.4);
  const data = ctx.getImageData((canvas.width - w) / 2, (canvas.height - h) / 2, w, h).data;
  let sum = 0;
  let count = 0;
  for (let index = 0; index < data.length; index += 16) {
    sum += 0.3 * data[index] + 0.59 * data[index + 1] + 0.11 * data[index + 2];
    count += 1;
  }
  return count ? sum / count : 128;
}

function FaceOval() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 393 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <mask id="face-oval-mask">
          <rect width="393" height="560" fill="#fff" />
          <ellipse cx="196.5" cy="235" rx="92" ry="122" fill="#000" />
        </mask>
      </defs>
      <rect width="393" height="560" fill="rgb(0 0 0 / 0.35)" mask="url(#face-oval-mask)" />
      <ellipse
        cx="196.5"
        cy="235"
        rx="92"
        ry="122"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeDasharray="10 7"
        className="face-oval-dash"
      />
    </svg>
  );
}

export function FaceCameraScreen({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (capture: FaceCapture) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<CameraState>("starting");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [attempt, setAttempt] = useState(0);
  const [capture, setCapture] = useState<FaceCapture | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (capture) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("blocked");
      return;
    }
    setState("starting");
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false })
      .then((media) => {
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        const video = videoRef.current;
        if (video) {
          video.srcObject = media;
          void video.play().catch(() => undefined);
        }
        setState("live");
      })
      .catch(() => {
        if (!cancelled) setState("blocked");
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facing, attempt, capture]);

  function shoot() {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 320);
    const video = videoRef.current;
    if (state !== "live" || !video || !video.videoWidth) {
      setCapture({ photo: SAMPLE_FACE, dark: false });
      return;
    }
    // Crop the frame the same way object-cover shows it, so the review matches the preview.
    const box = video.getBoundingClientRect();
    const scale = Math.max(box.width / video.videoWidth, box.height / video.videoHeight);
    const sw = box.width / scale;
    const sh = box.height / scale;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(box.width * 2);
    canvas.height = Math.round(box.height * 2);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      video,
      (video.videoWidth - sw) / 2,
      (video.videoHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    setCapture({ photo: canvas.toDataURL("image/jpeg", 0.88), dark: centreBrightness(canvas) < 45 });
  }

  const reviewing = Boolean(capture);

  return (
    <div className="flex h-full min-h-full flex-col bg-black text-white">
      <div className="pt-status bg-black px-5">
        <button
          type="button"
          onClick={onClose}
          className="-ml-2 mt-2 grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
          aria-label="Tutup"
        >
          <X size={24} />
        </button>
        <h1 className="mt-2 text-[24px] font-semibold leading-[1.2]">
          {reviewing ? "Tinjau Hasil Foto" : "Ambil foto Wajah"}
        </h1>
        <p className="mt-2 pb-4 text-[14px] leading-[1.4] text-[#f1f1f1]">
          Pastikan foto dalam pencahayaan baik dan seluruh bagian wajah masuk dalam bingkai.
        </p>
      </div>

      <div className="relative min-h-[360px] flex-1 overflow-hidden bg-[#0b0d10]">
        {capture ? (
          <img src={capture.photo} alt="Hasil foto wajah" className="absolute inset-0 h-full w-full object-cover" />
        ) : state === "blocked" ? (
          <img src={SAMPLE_FACE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              facing === "user" && "-scale-x-100",
              state === "live" ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        <FaceOval />
        {state === "starting" && !capture ? (
          <div className="absolute inset-0 grid place-items-center">
            <p className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px]">
              <span className="spinner" aria-hidden="true" />
              Meminta izin kamera…
            </p>
          </div>
        ) : null}
        {state === "blocked" && !capture ? (
          <div className="absolute inset-x-4 bottom-4 rounded-[8px] bg-black/70 p-3 text-[12px] leading-[1.4] backdrop-blur">
            <p className="font-medium">Kamera tidak dapat diakses</p>
            <p className="mt-0.5 text-white/80">
              Izinkan akses kamera di browser, atau lanjutkan dengan foto contoh untuk demo.
            </p>
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mt-2 font-medium text-[#8ecbff] underline"
            >
              Coba izinkan kamera lagi
            </button>
          </div>
        ) : null}
        {flash ? <div className="camera-flash" aria-hidden="true" /> : null}
      </div>

      <div className="pb-safe bg-[#16191c] px-4 py-6">
        {reviewing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCapture(null)}
              className="h-12 flex-1 rounded-[8px] border border-white text-[14px] font-medium text-white transition active:bg-white/10"
            >
              Ulangi
            </button>
            <Button className="h-12 flex-1" onClick={() => capture && onSubmit(capture)}>
              Kirim
            </Button>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={shoot}
              disabled={state === "starting"}
              className="rounded-full bg-[#e2e5e8] p-2 shadow-[0_4px_8px_rgba(0,0,0,0.04)] transition active:scale-95 disabled:opacity-50"
              aria-label="Ambil foto wajah"
            >
              <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-white text-[#16191c]">
                <Camera size={20} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFacing((value) => (value === "user" ? "environment" : "user"))}
              disabled={state !== "live"}
              className="absolute right-1 grid h-[54px] w-[54px] place-items-center rounded-full bg-[#f1f1f1] text-[#16191c] transition active:scale-95 disabled:opacity-40"
              aria-label="Ganti kamera depan atau belakang"
            >
              <ArrowsClockwise size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- Face: scanning ------------------------------- */

const SCAN_TICKS = 72;
const SCAN_MS = 3600;

export function FaceScanScreen({ photo, onDone }: { photo: string; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let frame = 0;
    let timer = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SCAN_MS);
      // Climbs to 40%, holds briefly, then finishes, so it reads like a real scanner.
      const eased = t < 0.35 ? (t / 0.35) * 0.4 : t < 0.5 ? 0.4 : 0.4 + ((t - 0.5) / 0.5) * 0.6;
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else timer = window.setTimeout(() => done.current(), 700);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  const percent = Math.round(progress * 100);
  const lit = Math.round(progress * SCAN_TICKS);
  const finished = percent >= 100;

  return (
    <div className="face-scan-screen flex min-h-full flex-col items-center px-6 pt-status text-center text-[#16191c]">
      <h1 className="mt-14 text-[22px] font-semibold leading-[1.3]">Pindai Wajah</h1>
      <p className="mt-2 max-w-[280px] text-[14px] leading-[1.4] text-[#16191c]/75">
        Tahan posisi wajah Anda di dalam lingkaran sampai pemindaian selesai.
      </p>
      <div
        className="relative mt-10 h-[300px] w-[300px]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Pemindaian wajah"
      >
        <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {Array.from({ length: SCAN_TICKS }, (_, index) => (
            <line
              key={index}
              x1="150"
              y1="6"
              x2="150"
              y2={index % 6 === 0 ? 24 : 20}
              strokeWidth={3}
              strokeLinecap="round"
              transform={`rotate(${(index * 360) / SCAN_TICKS} 150 150)`}
              className={cn("scan-tick", index < lit && "scan-tick-on")}
            />
          ))}
        </svg>
        <div className="absolute inset-[34px] overflow-hidden rounded-full bg-[var(--brand-soft)] ring-2 ring-[var(--brand-softer)]">
          <img src={photo} alt="Foto wajah yang dipindai" className="h-full w-full object-cover" />
          <span className={cn("scan-grid", finished && "opacity-0")} aria-hidden="true" />
          {!finished ? <span className="scan-band" aria-hidden="true" /> : null}
          {finished ? (
            <span className="absolute inset-0 grid place-items-center bg-white/55">
              <span className="success-burst grid h-16 w-16 place-items-center rounded-full bg-[var(--brand)] text-white">
                <Check size={34} weight="bold" className="text-white" />
              </span>
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-10 text-[16px] font-medium tabular-nums">
        {finished ? "Wajah terdeteksi" : `Completed ${percent}%`}
      </p>
      <p className="mt-2 max-w-[280px] text-[13px] leading-[1.4] text-[#16191c]/65">
        {percent < 40
          ? "Memindai titik wajah…"
          : percent < 100
            ? "Jangan bergerak, sedikit lagi."
            : "Mencocokkan dengan data terdaftar."}
      </p>
    </div>
  );
}

export function FaceVerifyingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-white px-8 text-center">
      <span className="tick-spinner" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <i key={index} style={{ transform: `rotate(${index * 45}deg)`, animationDelay: `${index * 0.1 - 0.8}s` }} />
        ))}
      </span>
      <h1 className="mt-8 text-[24px] font-semibold leading-[1.2] text-[#16191c]">Memverifikasi Wajah</h1>
      <p className="mt-3 text-[14px] leading-[1.4] text-[#384047]">
        Jangan tutup halaman ini. Proses biasanya kurang dari 5 detik.
      </p>
    </div>
  );
}

export function FaceErrorScreen({ onBack, onRetry }: { onBack: () => void; onRetry: () => void }) {
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#fdebe9] text-[#ef402b]">
          <X size={30} weight="bold" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-[24px] font-semibold leading-[1.2] text-[#16191c]">Verifikasi Wajah Gagal</h1>
        <p className="mt-3 text-[14px] leading-[1.4] text-[#384047]">
          Wajah pada foto kurang terlihat jelas, silakan coba lagi dengan pencahayaan yang baik dan wajah terlihat
          jelas.
        </p>
      </div>
      <div className="px-6 pb-6 pt-4">
        <Button className="w-full" onClick={onRetry}>
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------- PIN ------------------------------------ */

function PinBoxes({ value, error }: { value: string; error: boolean }) {
  return (
    <div className={cn("flex gap-1", error && "otp-shake")} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => {
        const active = !error && index === value.length - 1;
        const filled = index < value.length;
        return (
          <span
            key={index}
            className={cn(
              "grid h-[54px] w-[54px] flex-none place-items-center rounded-[8px] border transition-colors",
              error
                ? "border-[#ef402b]"
                : active
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] ring-1 ring-[var(--brand-softer)]"
                  : "border-[#dfe4ea]",
            )}
          >
            {active ? (
              <span className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] text-black">
                {value[index]}
                <span className="pin-caret h-3 w-px bg-[#16191c]" />
              </span>
            ) : filled ? (
              <span className="h-2 w-2 rounded-full bg-black" />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

const KEYS = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
];

/** iOS-style numeric keyboard docked to the bottom of the screen, as in Figma. */
function NumericKeyboard({ onDigit, onDelete }: { onDigit: (digit: string) => void; onDelete: () => void }) {
  const key =
    "flex h-[46px] flex-col items-center justify-center rounded-[5px] bg-white text-[#131324] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition active:bg-[#bfc3ca]";
  return (
    <div
      className="sticky bottom-0 mt-auto bg-[#d1d5db] px-[6px] pb-[calc(env(safe-area-inset-bottom)+30px)] pt-[6px]"
      role="group"
      aria-label="Papan angka"
    >
      <div className="grid grid-cols-3 gap-[6px]">
        {KEYS.map(([digit, letters]) => (
          <button key={digit} type="button" className={key} onClick={() => onDigit(digit)} aria-label={digit}>
            <span className="text-[25px] leading-[1]">{digit}</span>
            <span className="h-[12px] text-[10px] font-semibold leading-[12px] tracking-[2px]">{letters}</span>
          </button>
        ))}
        <span />
        <button type="button" className={key} onClick={() => onDigit("0")} aria-label="0">
          <span className="text-[25px] leading-[1]">0</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="grid h-[46px] place-items-center rounded-[5px] text-[#131324] transition active:bg-[#bfc3ca]"
          aria-label="Hapus angka"
        >
          <Backspace size={24} />
        </button>
      </div>
    </div>
  );
}

/** Six-digit PIN entry: on-screen keys plus the physical keyboard. */
function usePinEntry(onComplete: (pin: string) => void) {
  const [pin, setPin] = useState("");
  const complete = useRef(onComplete);
  complete.current = onComplete;

  const add = useCallback(
    (digit: string) => {
      if (pin.length >= 6) return;
      const next = pin + digit;
      setPin(next);
      if (next.length === 6) window.setTimeout(() => complete.current(next), 180);
    },
    [pin],
  );
  const remove = useCallback(() => setPin((current) => current.slice(0, -1)), []);

  return { pin, setPin, add, remove };
}

function PinError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="flex h-11 items-center gap-2 rounded-[8px] bg-[#fdebe9] px-3 text-[13px] leading-[1.4] text-[#d73926]"
    >
      <WarningCircle size={18} weight="fill" className="flex-none" aria-hidden="true" />
      {children}
    </p>
  );
}

function PinLayout({
  title,
  description,
  pin,
  error,
  footer,
  onBack,
  onDigit,
  onDelete,
}: {
  title: string;
  description: string;
  pin: string;
  error: string;
  footer?: ReactNode;
  onBack: () => void;
  onDigit: (digit: string) => void;
  onDelete: () => void;
}) {
  const handlers = useRef({ onDigit, onDelete });
  handlers.current = { onDigit, onDelete };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) handlers.current.onDigit(event.key);
      else if (event.key === "Backspace") handlers.current.onDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="px-6 pb-6 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">{title}</h1>
        <p className="mt-2 max-w-[305px] text-[14px] leading-[1.4] text-[#384047]">{description}</p>
        <div className="mt-5 flex flex-col gap-2">
          <PinBoxes value={pin} error={Boolean(error)} />
          <span className="sr-only" aria-live="polite">
            {pin.length} dari 6 angka terisi
          </span>
          {error ? <PinError>{error}</PinError> : null}
          {footer}
        </div>
      </div>
      <NumericKeyboard onDigit={onDigit} onDelete={onDelete} />
    </div>
  );
}

const PIN_MISMATCH = "PIN tidak sesuai. Periksa dan coba lagi";

export function PinCreateScreen({ onBack, onDone }: { onBack: () => void; onDone: (pin: string) => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState("");
  const entry = usePinEntry((pin) => {
    if (first === null) {
      setFirst(pin);
      entry.setPin("");
      return;
    }
    if (pin === first) onDone(pin);
    else setError(PIN_MISMATCH);
  });

  return (
    <PinLayout
      key={first === null ? "create" : "confirm"}
      title={first === null ? "Buat PIN Baru" : "Konfirmasi PIN Anda"}
      description={
        first === null
          ? "Masukkan 6 angka PIN untuk melanjutkan ke akun Anda."
          : "Silakan masukkan kembali 6 Digit PIN yang dibuat."
      }
      pin={entry.pin}
      error={error}
      onBack={() => {
        if (first === null) {
          onBack();
          return;
        }
        setFirst(null);
        setError("");
        entry.setPin("");
      }}
      onDigit={(value) => {
        if (error) {
          setError("");
          entry.setPin(value);
        } else entry.add(value);
      }}
      onDelete={() => {
        setError("");
        entry.remove();
      }}
    />
  );
}

export function PinVerifyScreen({
  expectedPin,
  onBack,
  onSuccess,
  onForgot,
}: {
  expectedPin: string;
  onBack: () => void;
  onSuccess: () => void;
  onForgot: () => void;
}) {
  const [error, setError] = useState("");
  const entry = usePinEntry((pin) => {
    if (pin === expectedPin) onSuccess();
    else setError(PIN_MISMATCH);
  });

  return (
    <PinLayout
      title="Masukkan PIN Anda"
      description="Masukkan 6 angka PIN MITRA Anda untuk melanjutkan."
      pin={entry.pin}
      error={error}
      onBack={onBack}
      onDigit={(value) => {
        if (error) {
          setError("");
          entry.setPin(value);
        } else entry.add(value);
      }}
      onDelete={() => {
        setError("");
        entry.remove();
      }}
      footer={
        <div className="flex items-center justify-between">
          <button type="button" onClick={onForgot} className="text-[12px] leading-[1.4] text-[#16191c] underline">
            Lupa PIN?
          </button>
          <span className="text-[12px] text-[#65737f]">
            PIN demo: <span className="font-medium text-[var(--brand-ink)]">{expectedPin}</span>
          </span>
        </div>
      }
    />
  );
}

/* -------------------------------- Welcome ---------------------------------- */

function VerifiedIdArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
      <rect x="27" y="4" width="10" height="9" rx="1.5" fill="#bdbfd6" />
      <rect x="23" y="11" width="18" height="3" rx="1.5" fill="#bdbfd6" />
      <rect x="2" y="13" width="54" height="40" rx="5" fill="#e3e4ee" />
      <rect x="9" y="22" width="15" height="17" rx="2" fill="#bdbfd6" />
      <circle cx="16.5" cy="28" r="3.6" fill="#2d2f86" />
      <path d="M10.5 39c.8-4.6 3.2-6.6 6-6.6s5.2 2 6 6.6z" fill="#2d2f86" />
      <rect x="29" y="23" width="20" height="2.6" rx="1.3" fill="#bdbfd6" />
      <rect x="29" y="29" width="20" height="2.6" rx="1.3" fill="#bdbfd6" />
      <rect x="29" y="35" width="9" height="2.6" rx="1.3" fill="#bdbfd6" />
      <circle cx="49" cy="49" r="13" fill="#34c759" stroke="#fff" strokeWidth="2" />
      <path
        d="M42.5 49.5l4.3 4.2 8.3-8.6"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function shortName(name: string) {
  const [first, second] = name.split(" ");
  return second ? `${first} ${second[0]}` : first;
}

export function BusinessUnitSheet({
  open,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  value: BusinessUnit;
  onChange: (unit: BusinessUnit) => void;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} label="Pilih bisnis unit">
      <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Pilih Bisnis Unit</h2>
      <p className="mt-1 text-[13px] leading-[1.4] text-[#4f5963]">
        Opsi demo: warna utama aplikasi mengikuti branding bisnis unit.
      </p>
      <div className="mt-3" role="radiogroup" aria-label="Bisnis unit">
        {BUSINESS_UNITS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={value === item.id}
            onClick={() => onChange(item.id)}
            className="flex w-full items-center gap-3 border-b border-[#e2e8f0] py-[14px] text-left"
          >
            <RadioDot checked={value === item.id} />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium leading-[1.4] text-[#16191c]">{item.name}</span>
              <span className="block text-[12px] leading-[1.4] text-[#4f5963]">{item.tagline}</span>
            </span>
            <span
              className="h-6 w-6 flex-none rounded-full shadow-[0_0_0_1px_#dfe4ea]"
              style={{ background: item.color }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <Button className="mt-5 w-full" onClick={onClose}>
        Terapkan
      </Button>
    </Sheet>
  );
}

export function WelcomeScreen({
  account,
  unit,
  onPickUnit,
  onBack,
  onContinue,
}: {
  account: Account;
  unit: BusinessUnit;
  onPickUnit: () => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const current = BUSINESS_UNITS.find((item) => item.id === unit) ?? BUSINESS_UNITS[0];
  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="flex flex-1 flex-col justify-center px-6 pb-20">
        <div className="flex flex-col items-center text-center">
          <span className="success-burst rounded-full">
            <VerifiedIdArt />
          </span>
          <h1 className="mt-3 text-[24px] font-semibold leading-[1.2] text-[#16191c]">
            Selamat Datang, {shortName(account.name)}
          </h1>
          <p className="mt-3 max-w-[315px] text-[14px] leading-[1.4] text-[#384047]">
            Identitas Anda terverifikasi. Sesi aman diperpanjang 30 hari di perangkat ini.
          </p>
        </div>
        <div className="mt-4 rounded-[8px] border border-[#f1f1f1] bg-white p-1">
          <div className="flex items-center gap-4 rounded-[8px] bg-[var(--brand-soft)] p-3">
            <span className="relative h-9 w-9 flex-none overflow-hidden rounded-[16px] bg-white" aria-hidden="true">
              <span className="absolute left-[10px] top-[7px] h-4 w-4 rounded-full bg-[var(--brand)]" />
              <span className="absolute -left-[9px] top-[24px] h-[54px] w-[54px] rounded-full bg-[var(--brand)]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium leading-[1.4] text-black">{account.name}</span>
              <span className="block text-[13px] leading-[1.4] text-[#384047]">NIK {account.nik}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onPickUnit}
            className="flex w-full items-center gap-2 rounded-b-[8px] px-[10px] py-[18px] text-left transition active:bg-[#f8fafc]"
            aria-haspopup="dialog"
          >
            <BuildingOffice size={18} className="flex-none text-[#16191c]" aria-hidden="true" />
            <span className="flex-1 text-[13px] font-medium leading-[1.4] text-black">Bisnis Unit</span>
            <span className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[#65737f]">
              <span className="h-2 w-2 rounded-full" style={{ background: current.color }} aria-hidden="true" />
              {current.name}
            </span>
            <CaretRight size={14} className="text-[#65737f]" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-4">
        <Button className="w-full" onClick={onContinue}>
          Lanjut ke Beranda
        </Button>
      </div>
    </div>
  );
}
