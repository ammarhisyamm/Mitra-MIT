import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  Check,
  Glasses,
  LockKeyhole,
  RotateCcw,
  ScanFace,
  Sun,
  SwitchCamera,
  X,
} from "lucide-react";
import {
  InlineAlert,
  MitraLogo,
  PinInput,
  PrimaryButton,
  StepHeader,
} from "@/components/primitives";
import { DEMO, type Mode } from "@/lib/demo";
import { cn } from "@/lib/cn";

export function SplashScreen({
  mode,
  sessionActive,
}: {
  mode: Mode;
  sessionActive: boolean;
}) {
  const resumed = mode === "returning" && sessionActive;
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-16">
      <div className="flex flex-1 flex-col items-center justify-center pb-12 text-center">
        <MitraLogo poweredBy />
        <div className="mt-12 flex items-center gap-2.5 text-[13px] leading-5 text-[#6b7280]">
          <span className="spinner spinner-dark" aria-hidden="true" />
          <span>{resumed ? "Memulihkan sesi aman Anda…" : "Memeriksa sesi…"}</span>
        </div>
        <p className="mt-2 max-w-[260px] text-[12px] leading-[18px] text-[#6b7280]">
          {resumed
            ? "Sesi 30 hari masih aktif di perangkat ini."
            : "Menyiapkan akses aman untuk Anda."}
        </p>
      </div>
      <p className="text-center text-[13px] leading-5 text-[#6b7280]">
        V1. Mitra powered by MIT
      </p>
    </div>
  );
}

export function FaceIntroScreen({
  onStart,
  onBack,
  allowPin,
  onUsePin,
  onHelp,
  enroll,
}: {
  onStart: () => void;
  onBack: () => void;
  allowPin: boolean;
  onUsePin: () => void;
  onHelp: () => void;
  enroll: boolean;
}) {
  const tips = [
    { icon: Sun, title: "Cahaya cukup", detail: "Hadap ke arah cahaya, hindari cahaya di belakang." },
    { icon: Glasses, title: "Wajah terlihat jelas", detail: "Lepas masker, topi, dan kacamata gelap." },
    { icon: ScanFace, title: "Posisi kamera", detail: "Sejajarkan wajah di dalam bingkai." },
  ];
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader
        step={enroll ? 1 : undefined}
        total={enroll ? 3 : undefined}
        title={enroll ? "Daftarkan Wajah" : "Verifikasi Wajah"}
        onBack={onBack}
      />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        {enroll
          ? "Ambil foto wajah untuk digunakan saat masuk ke MITRA."
          : "Kami mencocokkan wajah Anda dengan foto yang terdaftar."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <figure className="overflow-hidden rounded-[12px] border-2 border-[#b7e4cd] bg-[#eaf8f1]">
          <figcaption className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold leading-4 text-[#067647]">
            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            Benar
          </figcaption>
          <div className="h-[120px] overflow-hidden bg-[#d9efe4]">
            <img
              src="/face-demo.jpg"
              alt="Contoh foto wajah yang benar, menghadap kamera dan seluruh wajah terlihat"
              className="h-full w-full object-cover object-[50%_28%]"
            />
          </div>
        </figure>
        <figure className="overflow-hidden rounded-[12px] border-2 border-[#f3b7b5] bg-[#fff1f0]">
          <figcaption className="flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold leading-4 text-[#d92d20]">
            <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            Salah
          </figcaption>
          <div className="h-[120px] overflow-hidden bg-[#f5dedd]">
            <img
              src="/face-demo.jpg"
              alt="Contoh foto wajah yang salah, wajah terpotong dan pencahayaan kurang"
              className="h-full w-full scale-[1.55] object-cover object-[54%_8%] brightness-[.72] saturate-[.8]"
            />
          </div>
        </figure>
      </div>

      <p className="mt-6 text-[14px] font-medium leading-5 text-[#151b2b]">
        Panduan Singkat
      </p>
      <div className="mt-2 rounded-[12px] border border-[#e5e7eb]">
        <ul className="divide-y divide-[#e5e7eb]">
          {tips.map((tip) => (
            <li key={tip.title} className="flex items-start gap-3 px-4 py-3">
              <tip.icon
                className="mt-0.5 h-[18px] w-[18px] flex-none text-[#151b2b]"
                aria-hidden="true"
              />
              <div>
                <p className="text-[14px] font-medium leading-5 text-[#151b2b]">
                  {tip.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-[18px] text-[#6b7280]">
                  {tip.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={onStart}>
        {enroll ? "Mulai Daftar Wajah" : "Mulai Foto Wajah"}
      </PrimaryButton>
      {allowPin ? (
        <button
          type="button"
          onClick={onUsePin}
          className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
        >
          Gunakan PIN
        </button>
      ) : (
        <button
          type="button"
          onClick={onHelp}
          className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
        >
          Wajah tidak bisa diverifikasi?
        </button>
      )}
    </div>
  );
}

type CameraState = "demo" | "starting" | "live" | "denied";
type CameraFacing = "user" | "environment";

export function FaceCameraScreen({
  onCaptured,
  onBack,
  onboarding,
}: {
  onCaptured: (image: string | null) => void;
  onBack: () => void;
  onboarding: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timers = useRef<number[]>([]);
  const [camera, setCamera] = useState<CameraState>("demo");
  const [facing, setFacing] = useState<CameraFacing>("user");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera("demo");
  }

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  async function startCamera(nextFacing: CameraFacing = facing) {
    setCamera("starting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamera("live");
    } catch {
      setCamera("denied");
    }
  }

  function handleCameraControl() {
    if (camera === "live") {
      const next = facing === "user" ? "environment" : "user";
      setFacing(next);
      stopCamera();
      void startCamera(next);
      return;
    }
    void startCamera(facing);
  }

  function captureNow() {
    setFlash(true);
    const timer = window.setTimeout(() => {
      setFlash(false);
      let image: string | null = null;
      const video = videoRef.current;
      if (camera === "live" && video && video.videoWidth > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          if (facing === "user") {
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
          }
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          image = canvas.toDataURL("image/jpeg", 0.86);
        }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      onCaptured(image);
    }, 260);
    timers.current.push(timer);
  }

  function beginCapture() {
    if (countdown !== null) return;
    setCountdown(3);
    [1, 2, 3].forEach((offset) => {
      const timer = window.setTimeout(() => {
        const next = 3 - offset;
        if (next > 0) setCountdown(next);
        else {
          setCountdown(null);
          captureNow();
        }
      }, offset * 1000);
      timers.current.push(timer);
    });
  }

  const statusLabel =
    camera === "live"
      ? "Wajah terdeteksi"
      : camera === "starting"
        ? "Menyiapkan kamera…"
        : camera === "denied"
          ? "Kamera tidak tersedia · coba lagi"
          : "Mode demo · aktifkan kamera";

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0b111b] text-white">
      <div className="absolute inset-0">
        {camera === "live" ? (
          <video
            ref={videoRef}
            playsInline
            muted
            aria-label="Pratinjau kamera depan"
            className="h-full w-full object-cover"
            style={{ transform: facing === "user" ? "scaleX(-1)" : "none" }}
          />
        ) : (
          <img
            src="/face-demo.jpg"
            alt=""
            className="h-full w-full object-cover object-[50%_30%] brightness-[.82]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,10,18,0.8),rgba(5,10,18,0.12)_28%,rgba(5,10,18,0.08)_55%,rgba(5,10,18,0.82))]" />
        <div className="camera-grain" />
      </div>
      <div className="face-guide" aria-hidden="true" />
      {countdown !== null ? (
        <div
          className="absolute inset-0 z-30 grid place-items-center bg-[#081020]/45 backdrop-blur-[2px]"
          role="status"
          aria-live="assertive"
        >
          <div className="text-center">
            <span className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-white/25 bg-white/10 text-[44px] font-extrabold text-white">
              {countdown}
            </span>
            <p className="mt-3 text-[12px] font-medium text-white/75">Tahan posisi</p>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-16">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Tutup kamera"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          {onboarding ? (
            <span className="text-[12px] leading-5 text-white/65">1 / 3</span>
          ) : null}
        </div>

        <h1 className="mt-3 text-[24px] font-semibold leading-8 tracking-[-0.02em]">
          Ambil Foto Wajah
        </h1>
        <p className="mt-1 max-w-[320px] text-[13px] leading-5 text-white/75">
          Pastikan foto dalam pencahayaan baik dan seluruh bagian wajah masuk dalam bingkai.
        </p>

        <div className="relative flex-1" />

        <div className="relative z-10 mt-3">
          <div className="mb-4 flex justify-center">
            {camera === "live" ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38d39f]" aria-hidden="true" />
                {statusLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleCameraControl}
                disabled={camera === "starting" || countdown !== null}
                className="inline-flex min-h-8 items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur transition hover:bg-black/50 disabled:cursor-wait"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    camera === "starting" ? "bg-[#f9a11f]" : "bg-white/60",
                  )}
                  aria-hidden="true"
                />
                {statusLabel}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="h-12 w-12" aria-hidden="true" />
            <button
              type="button"
              onClick={beginCapture}
              disabled={countdown !== null || camera === "starting"}
              className="grid h-[68px] w-[68px] place-items-center rounded-full border-[3px] border-white/90 bg-white/15 transition active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111b]"
              aria-label={countdown !== null ? "Menghitung mundur" : "Ambil foto"}
            >
              <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-white text-[#122b5c]">
                <Camera className="h-6 w-6" strokeWidth={1.9} aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              onClick={handleCameraControl}
              disabled={countdown !== null || camera === "starting"}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition hover:bg-black/50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={camera === "live" ? "Ganti kamera" : "Aktifkan kamera"}
            >
              <SwitchCamera className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-4 text-center text-[11px] leading-4 text-white/60">
            {facing === "user" ? "Kamera depan" : "Kamera belakang"} · Foto tidak disimpan di galeri
          </p>
        </div>
      </div>

      {flash ? <div className="absolute inset-0 z-40 bg-white" /> : null}
    </div>
  );
}

export function FaceProcessingScreen({
  image,
  onDone,
}: {
  image: string | null;
  onDone: () => void;
}) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => doneRef.current(), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0b111b] text-white">
      <div className="absolute inset-0">
        <img
          src={image ?? "/face-demo.jpg"}
          alt=""
          className="h-full w-full scale-105 object-cover object-[50%_30%] opacity-30 blur-[3px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,10,18,0.82),rgba(5,10,18,0.45)_45%,rgba(5,10,18,0.9))]" />
      </div>

      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-16 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="relative h-[236px] w-[186px] overflow-hidden rounded-[48%_48%_44%_44%/38%_38%_62%_62%] border-2 border-white/80 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
          <img
            src={image ?? "/face-demo.jpg"}
            alt=""
            className="h-full w-full object-cover object-[50%_28%]"
          />
          <div className="scan-line" aria-hidden="true" />
        </div>
        <h1 className="mt-7 text-[24px] font-semibold leading-8 tracking-[-0.02em]">
          Menganalisis foto…
        </h1>
        <p className="mt-2 max-w-[280px] text-[13px] leading-5 text-white/70">
          Kami memeriksa kualitas foto sebelum Anda meninjaunya.
        </p>
        <div className="mt-6 h-1 w-[190px] overflow-hidden rounded-full bg-white/20">
          <div className="processing-progress h-full w-full rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

export function FaceReviewScreen({
  image,
  onUse,
  onRetake,
  onBack,
  onboarding,
}: {
  image: string | null;
  onUse: () => void;
  onRetake: () => void;
  onBack: () => void;
  onboarding: boolean;
}) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0b111b] text-white">
      <div className="absolute inset-0">
        <img
          src={image ?? "/face-demo.jpg"}
          alt="Hasil foto wajah"
          className="h-full w-full object-cover object-[50%_30%] brightness-[.9]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,10,18,0.82),rgba(5,10,18,0.12)_30%,rgba(5,10,18,0.1)_52%,rgba(5,10,18,0.88))]" />
      </div>
      <div className="face-guide" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-16">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Tutup tinjau foto"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          {onboarding ? (
            <span className="text-[12px] leading-5 text-white/65">1 / 3</span>
          ) : null}
        </div>

        <h1 className="mt-3 text-[24px] font-semibold leading-8 tracking-[-0.02em]">
          Tinjau Hasil Foto
        </h1>
        <p className="mt-1 max-w-[320px] text-[13px] leading-5 text-white/75">
          Pastikan foto dalam pencahayaan baik dan seluruh bagian wajah masuk dalam bingkai.
        </p>

        <div className="flex-1" />

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-white px-6 text-[14px] font-medium leading-5 text-[#151b2b] transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111b]"
          >
            Ulangi
          </button>
          <PrimaryButton
            type="button"
            onClick={onUse}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b111b]"
          >
            Lanjut
          </PrimaryButton>
        </div>
        <p className="mt-3 text-center text-[11px] leading-4 text-white/60">
          Foto hanya dipakai untuk verifikasi identitas.
        </p>
      </div>
    </div>
  );
}

export function FaceCheckScreen({
  image,
  fail,
  onDone,
  onFail,
}: {
  image: string | null;
  fail: boolean;
  onDone: () => void;
  onFail: () => void;
}) {
  const [stage, setStage] = useState(0);
  const doneRef = useRef(onDone);
  const failRef = useRef(onFail);
  doneRef.current = onDone;
  failRef.current = onFail;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 650),
      window.setTimeout(() => {
        if (fail) {
          setStage(2);
          failRef.current();
        } else {
          setStage(2);
        }
      }, 1650),
      window.setTimeout(() => {
        if (!fail) {
          setStage(3);
          doneRef.current();
        }
      }, 2550),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [fail]);

  const steps = [
    "Memeriksa kualitas foto",
    "Mencocokkan wajah dengan data akun",
    "Menyiapkan akses aman",
  ];

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-16">
      <div className="text-center">
        <h1 className="text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          {fail ? "Verifikasi belum selesai" : "Memverifikasi wajah…"}
        </h1>
        <p className="mx-auto mt-2 max-w-[290px] text-[14px] leading-6 text-[#6b7280]">
          Jangan tutup halaman ini. Proses biasanya kurang dari 5 detik.
        </p>
      </div>

      <div className="relative mx-auto mt-6 h-[268px] w-[210px]">
        <div className="absolute inset-0 overflow-hidden rounded-[46%_46%_42%_42%/40%_40%_60%_60%] border-2 border-white shadow-[0_24px_60px_-30px_rgba(18,43,92,0.6)]">
          <img
            src={image ?? "/face-demo.jpg"}
            alt=""
            className="h-full w-full object-cover object-[50%_28%]"
          />
          {!fail ? <div className="scan-line" /> : null}
          {fail ? <div className="absolute inset-0 bg-[#d92d20]/15" /> : null}
        </div>
        <span
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold shadow",
            fail ? "bg-[#fee4e2] text-[#b42318]" : "bg-white text-[#2852a3]",
          )}
        >
          {fail ? "Wajah belum cocok" : `${DEMO.name}`}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        {steps.map((step, index) => {
          const complete = index < stage;
          const active = index === stage && !fail;
          const failed = fail && index === 1;
          return (
            <div key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full border text-[10px] transition",
                  complete && !failed
                    ? "border-[#bfe6d6] bg-[#ecfdf3] text-[#067647]"
                    : failed
                      ? "border-[#f5c2be] bg-[#fff6f5] text-[#b42318]"
                      : "border-[#dfe5ee] bg-white text-[#667085]",
                )}
              >
                {failed ? (
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                ) : complete ? (
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                ) : active ? (
                  <span className="spinner spinner-dark !h-3 !w-3 !border" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-[12px]",
                  failed
                    ? "font-semibold text-[#b42318]"
                    : complete
                      ? "text-[#475467]"
                      : "text-[#667085]",
                )}
              >
                {failed ? "Wajah belum cocok dengan data akun" : step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FaceFailedScreen({
  allowPin,
  onRetry,
  onUsePin,
  onBack,
  onHelp,
}: {
  allowPin: boolean;
  onRetry: () => void;
  onUsePin: () => void;
  onBack: () => void;
  onHelp: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-16">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#fff1f0] text-[#d92d20]">
          <CameraOff className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          Wajah belum terbaca
        </h1>
        <p className="mx-auto mt-2 max-w-[290px] text-[14px] leading-6 text-[#667085]">
          Cahaya atau posisi wajah membuat foto sulit dicocokkan.
        </p>
      </div>
      <div className="mt-8">
        <p className="text-[14px] font-medium leading-5 text-[#151b2b]">Coba perbaiki ini</p>
        <ul className="mt-3 space-y-2 text-[13px] leading-5 text-[#667085]">
          <li>Hadapkan wajah langsung ke kamera.</li>
          <li>Lepas masker, topi, dan kacamata gelap.</li>
          <li>Hindari posisi dengan cahaya di belakang.</li>
        </ul>
      </div>
      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={onRetry}
        icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
        iconPosition="leading"
      >
        Coba lagi
      </PrimaryButton>
      {allowPin ? (
        <button type="button" onClick={onUsePin} className="secondary-button mt-2.5 w-full">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Gunakan PIN
        </button>
      ) : null}
      <button type="button" onClick={onBack} className="ghost-button mx-auto mt-3 flex">
        Kembali masuk
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={onHelp}
        className="mx-auto inline-flex min-h-11 items-center text-[12px] leading-[18px] text-[#667085] underline underline-offset-2"
      >
        Butuh bantuan? Hubungi Admin Unit
      </button>
    </div>
  );
}

export function PinCreateScreen({
  onComplete,
  onBack,
}: {
  onComplete: (pin: string) => void;
  onBack: () => void;
}) {
  const [stage, setStage] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);

  function weakPin(code: string) {
    if (code === DEMO.nip) return "PIN tidak boleh sama dengan NIP Anda.";
    if (/^(\d)\1{5}$/.test(code)) return "Hindari angka yang sama berulang.";
    if ("0123456789".includes(code) || "9876543210".includes(code))
      return "Hindari urutan angka seperti 123456.";
    return "";
  }

  function next(code = pin) {
    if (code.length < 6) {
      setError("Masukkan 6 angka PIN.");
      return;
    }
    if (stage === "create") {
      const weak = weakPin(code);
      if (weak) {
        setError(weak);
        setPin("");
        setFocusRequest((value) => value + 1);
        return;
      }
      setFirstPin(code);
      setPin("");
      setError("");
      setStage("confirm");
      setFocusRequest((value) => value + 1);
      return;
    }
    if (code !== firstPin) {
      setStage("create");
      setPin("");
      setFirstPin("");
      setError("PIN belum sama. Buat PIN baru dari awal.");
      setFocusRequest((value) => value + 1);
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onComplete(code);
    }, 800);
  }

  function back() {
    if (stage === "confirm") {
      setStage("create");
      setPin("");
      setFirstPin("");
      setError("");
      setFocusRequest((value) => value + 1);
      return;
    }
    onBack();
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader
        step={2}
        total={3}
        title={stage === "create" ? "Buat PIN" : "Ulangi PIN"}
        onBack={back}
      />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        {stage === "create"
          ? "Buat PIN 6 angka untuk masuk tanpa kata sandi di perangkat ini."
          : "Masukkan kembali PIN yang baru Anda buat."}
      </p>

      <div className="mt-7">
        <PinInput
          value={pin}
          onChange={(value) => {
            setPin(value);
            setError("");
          }}
          label={stage === "create" ? "PIN baru" : "Ulangi PIN"}
          invalid={Boolean(error)}
          autoFocus
          autoComplete="new-password"
          errorId="pin-error"
          focusRequest={focusRequest}
          onComplete={next}
        />
        <p className="mt-3 text-center text-[12px] leading-[18px] text-[#667085]">
          {stage === "create"
            ? "Jangan gunakan NIP, tanggal lahir, atau angka berurutan."
            : "Pastikan angka sama dengan PIN yang baru dibuat."}
        </p>
      </div>

      {error ? (
        <InlineAlert id="pin-error" className="mt-4">
          {error}
        </InlineAlert>
      ) : null}

      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={() => next()}
        disabled={pin.length < 6}
        loading={loading}
        loadingLabel="Menyimpan PIN…"
      >
        {stage === "create" ? "Lanjut" : "Buat PIN"}
      </PrimaryButton>

      <div className="flex-1" />
      <p className="mt-6 flex items-start gap-2 text-[12px] leading-[18px] text-[#667085]">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Jangan bagikan PIN kepada siapa pun. MITRA tidak pernah meminta PIN melalui chat
        atau telepon.
      </p>
    </div>
  );
}
