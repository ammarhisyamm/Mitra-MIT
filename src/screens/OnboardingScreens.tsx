import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CameraOff,
  Check,
  Glasses,
  LockKeyhole,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  Sun,
  UserRound,
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

function PageFooter() {
  return (
    <p className="pt-8 text-center text-[13px] leading-5 text-[#6b7280]">
      V1. Mitra powered by MIT
    </p>
  );
}

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
        <p className="mt-2 max-w-[260px] text-[12px] leading-[18px] text-[#9ca3af]">
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
}: {
  onStart: () => void;
  onBack: () => void;
  allowPin: boolean;
  onUsePin: () => void;
  onHelp: () => void;
}) {
  const tips = [
    { icon: Sun, title: "Cahaya cukup", detail: "Hadap ke arah cahaya, hindari cahaya di belakang." },
    { icon: Glasses, title: "Wajah terlihat jelas", detail: "Lepas masker, topi, dan kacamata gelap." },
    { icon: ScanFace, title: "Posisi kamera", detail: "Sejajarkan wajah di dalam bingkai." },
  ];
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-24 pt-12">
      <StepHeader step={1} total={3} title="Verifikasi wajah" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Kami mencocokkan wajah Anda dengan foto yang terdaftar.
      </p>

      <div className="mt-8 flex flex-col items-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-[#f3f6fb] text-[#2852a3]">
          <ScanFace className="h-11 w-11" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="mt-4 text-center text-[13px] leading-5 text-[#4b5563]">
          Sekali verifikasi, akses berikutnya lebih cepat.
        </p>
      </div>

      <ul className="mt-9 space-y-4">
        {tips.map((tip) => (
          <li key={tip.title} className="flex items-start gap-3">
            <tip.icon className="mt-0.5 h-[18px] w-[18px] flex-none text-[#151b2b]" aria-hidden="true" />
            <div>
              <p className="text-[14px] font-medium leading-5 text-[#151b2b]">{tip.title}</p>
              <p className="mt-0.5 text-[12px] leading-[18px] text-[#6b7280]">
                {tip.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-7 flex items-start gap-2 text-[12px] leading-[18px] text-[#6b7280]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Foto hanya dipakai untuk verifikasi dan tidak ditampilkan ke pengguna lain.
      </p>

      <PrimaryButton type="button" className="mt-7" onClick={onStart}>
        Mulai verifikasi wajah
      </PrimaryButton>
      {allowPin ? (
        <button
          type="button"
          onClick={onUsePin}
          className="mx-auto mt-5 text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
        >
          Gunakan PIN
        </button>
      ) : (
        <button
          type="button"
          onClick={onHelp}
          className="mx-auto mt-5 text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
        >
          Wajah tidak bisa diverifikasi?
        </button>
      )}
    </div>
  );
}

type CameraState = "demo" | "starting" | "live" | "denied";

export function FaceCameraScreen({
  onCaptured,
  onBack,
}: {
  onCaptured: (image: string | null) => void;
  onBack: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timers = useRef<number[]>([]);
  const [camera, setCamera] = useState<CameraState>("demo");
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

  async function startCamera() {
    setCamera("starting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
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
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          image = canvas.toDataURL("image/jpeg", 0.86);
        }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      onCaptured(image);
    }, 380);
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
      }, offset * 750);
      timers.current.push(timer);
    });
  }

  return (
    <div className="min-h-full bg-white px-6 pb-8 pt-12">
      <StepHeader step={1} total={3} title="Ambil foto wajah" onBack={onBack} />
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-[12px] leading-relaxed text-[#667085]">
          Posisikan wajah di dalam bingkai.
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            camera === "live"
              ? "bg-[#ecfdf3] text-[#067647]"
              : "bg-[#eef2f8] text-[#5b6b85]",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              camera === "live" ? "bg-[#0e9f6e]" : "bg-[#98a2b3]",
            )}
          />
          {camera === "live" ? "Kamera aktif" : "Mode demo"}
        </span>
      </div>

      <div className="camera-stage mt-4 h-[352px]">
        {camera === "live" ? (
          <video ref={videoRef} playsInline muted aria-label="Pratinjau kamera depan" />
        ) : (
          <>
            <div className="camera-grain" />
            <div className="camera-silhouette">
              <div className="avatar-demo" />
            </div>
          </>
        )}
        <div className="face-oval" aria-hidden="true" />
        {camera === "live" ? <div className="scan-line" aria-hidden="true" /> : null}

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          <UserRound className="h-3 w-3" aria-hidden="true" />
          Kamera depan
        </div>

        <div className="absolute bottom-3 left-0 right-0 px-3">
          <div className="rounded-[12px] bg-black/30 px-3 py-2 text-center text-[10.5px] font-medium text-white/85 backdrop-blur">
            {camera === "starting"
              ? "Menyiapkan kamera…"
              : camera === "denied"
                ? "Kamera tidak dapat diakses. Menggunakan mode demo."
                : camera === "live"
                  ? "Wajah terdeteksi. Tahan posisi Anda."
                  : "Mode demo aktif. Tekan ambil foto untuk melanjutkan."}
          </div>
        </div>

        {countdown !== null ? (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#081020]/55 backdrop-blur-[2px]">
            <div className="grid h-24 w-24 place-items-center rounded-full border border-white/25 bg-white/10 text-[44px] font-extrabold text-white">
              {countdown}
            </div>
          </div>
        ) : null}
        {flash ? <div className="absolute inset-0 z-30 bg-white" /> : null}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#7c8ba3]">
        <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
        Foto tidak disimpan di galeri perangkat.
      </p>

      {camera === "denied" ? (
        <InlineAlert className="mt-3">
          Kamera tidak dapat diakses. Periksa izin kamera di pengaturan perangkat, lalu coba
          lagi.
        </InlineAlert>
      ) : null}

      <PrimaryButton
        type="button"
        className="mt-5"
        onClick={beginCapture}
        icon={<Camera className="h-4 w-4" aria-hidden="true" />}
      >
        Ambil foto
      </PrimaryButton>
      <button
        type="button"
        onClick={() => (camera === "live" ? stopCamera() : void startCamera())}
        className="secondary-button mt-2.5 w-full"
        disabled={camera === "starting"}
      >
        {camera === "live" ? (
          <CameraOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Camera className="h-4 w-4" aria-hidden="true" />
        )}
        {camera === "starting"
          ? "Mengaktifkan kamera…"
          : camera === "live"
            ? "Matikan kamera"
            : "Aktifkan kamera asli"}
      </button>
    </div>
  );
}

export function FaceReviewScreen({
  image,
  onUse,
  onRetake,
  onBack,
}: {
  image: string | null;
  onUse: () => void;
  onRetake: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-full bg-white px-6 pb-8 pt-12">
      <StepHeader step={1} total={3} title="Periksa foto Anda" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Pastikan wajah terlihat jelas, tidak buram, dan tidak terpotong.
      </p>
      <div className="relative mt-6 overflow-hidden rounded-[14px] bg-[#18243c]">
        <div className="relative h-[330px]">
          {image ? (
            <img src={image} alt="Hasil foto wajah" className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="camera-grain" />
              <div className="camera-silhouette">
                <div className="avatar-demo" />
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,16,32,0.55),transparent_45%)]" />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10.5px] font-bold text-[#067647]">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              Wajah terdeteksi
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold text-[#344054] backdrop-blur">
              Kualitas foto baik
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-[12px] bg-black/30 px-3 py-2 backdrop-blur">
            <span className="text-[10.5px] font-medium text-white/85">
              {image ? "Foto dari kamera" : "Foto demo"}
            </span>
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-white"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Ambil ulang
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-start gap-2 text-[12px] leading-[18px] text-[#6b7280]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Foto ini hanya dipakai untuk mencocokkan identitas Anda.
      </p>
      <PrimaryButton
        type="button"
        className="mt-5"
        onClick={onUse}
        icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
      >
        Gunakan foto
      </PrimaryButton>
      <button type="button" onClick={onRetake} className="secondary-button mt-2.5 w-full">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Ambil foto ulang
      </button>
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
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="camera-grain" />
              <div className="camera-silhouette">
                <div className="avatar-demo scale-[0.82]" />
              </div>
            </>
          )}
          {!fail ? <div className="scan-line" /> : null}
          {fail ? <div className="absolute inset-0 bg-[#d92d20]/15" /> : null}
        </div>
        <span
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-[10px] font-bold shadow",
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
                      : "border-[#dfe5ee] bg-white text-[#98a2b3]",
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
                      : "text-[#7c8ba3]",
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
}: {
  allowPin: boolean;
  onRetry: () => void;
  onUsePin: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-16">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#fff1f0] text-[#d92d20]">
          <CameraOff className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          Wajah belum cocok
        </h1>
        <p className="mx-auto mt-2 max-w-[290px] text-[14px] leading-6 text-[#6b7280]">
          Pastikan pencahayaan cukup dan wajah tidak tertutup, lalu coba lagi.
        </p>
      </div>
      <div className="mt-8">
        <p className="text-[14px] font-medium leading-5 text-[#151b2b]">Sebelum mencoba lagi</p>
        <ul className="mt-3 space-y-2 text-[13px] leading-5 text-[#6b7280]">
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

  function next() {
    if (pin.length < 6) {
      setError("Masukkan 6 angka PIN.");
      return;
    }
    if (stage === "create") {
      setFirstPin(pin);
      setPin("");
      setError("");
      setStage("confirm");
      return;
    }
    if (pin !== firstPin) {
      setPin("");
      setError("PIN belum sama. Masukkan ulang PIN yang sama.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onComplete(pin);
    }, 800);
  }

  function back() {
    if (stage === "confirm") {
      setStage("create");
      setPin(firstPin);
      setFirstPin("");
      setError("");
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

      <div className="mt-8">
        <PinInput
          value={pin}
          onChange={(value) => {
            setPin(value);
            setError("");
          }}
          label={stage === "create" ? "PIN baru" : "Ulangi PIN"}
          invalid={Boolean(error)}
          autoFocus
          onComplete={next}
        />
        <p className="mt-3 text-center text-[11px] text-[#7c8ba3]">
          {stage === "create" ? "Angka akan disembunyikan setelah diketik." : "Pastikan angka sama."}
        </p>
      </div>

      {error ? <InlineAlert className="mt-4">{error}</InlineAlert> : null}

      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={next}
        disabled={pin.length < 6}
        loading={loading}
        loadingLabel="Menyimpan PIN…"
      >
        {stage === "create" ? "Lanjut" : "Buat PIN"}
      </PrimaryButton>

      <p className="mt-6 flex items-start gap-2 text-[12px] leading-[18px] text-[#6b7280]">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Jangan bagikan PIN kepada siapa pun. MITRA tidak pernah meminta PIN melalui chat
        atau telepon.
      </p>

      <div className="flex-1" />
      <PageFooter />
    </div>
  );
}
