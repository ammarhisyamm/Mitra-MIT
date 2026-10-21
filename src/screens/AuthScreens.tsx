import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Clock3,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  BrandLockup,
  Field,
  InlineAlert,
  PasswordField,
  PasswordRules,
  PinInput,
  PrimaryButton,
} from "@/components/primitives";
import { DEMO } from "@/lib/demo";

function SecondaryHeader({
  title,
  eyebrow,
  onBack,
  children,
}: {
  title: string;
  eyebrow: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#f5f7fb] pb-8">
      <div className="relative overflow-hidden rounded-b-[30px] bg-[linear-gradient(150deg,#2f5fb8_0%,#2852a3_45%,#1b3a78_100%)] px-5 pb-12 pt-14 text-white">
        <div className="pointer-events-none absolute -right-16 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-6 top-16 h-32 w-32 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-2xl bg-[#f9a11f]/10" />
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Kembali"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <BrandLockup onDark compact />
        </div>
        <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
          {eyebrow}
        </p>
        <h1 className="relative mt-1.5 text-[24px] font-extrabold leading-tight tracking-[-0.02em]">
          {title}
        </h1>
      </div>
      <div className="relative -mt-6 px-3">
        <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_20px_50px_-30px_rgba(18,43,92,0.4)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LoginScreen({
  onSuccess,
  onForgot,
  forceFail,
}: {
  onSuccess: () => void;
  onForgot: () => void;
  forceFail: boolean;
}) {
  const [nip, setNip] = useState(DEMO.nip);
  const [password, setPassword] = useState(DEMO.password);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<{ nip?: string; password?: string }>({});

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (loading) return;
    const next: typeof errors = {};
    if (!nip.trim()) next.nip = "Masukkan NIP atau email.";
    else if (!nip.includes("@") && !/^\d{4,}$/.test(nip.trim()))
      next.nip = "Masukkan NIP 4–12 angka atau alamat email.";
    if (!password) next.password = "Masukkan kata sandi.";
    else if (password.length < 6) next.password = "Kata sandi minimal 6 karakter.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (forceFail) {
        setFormError("NIP atau kata sandi tidak sesuai. Periksa kembali.");
        return;
      }
      onSuccess();
    }, 950);
  }

  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <div className="auth-hero relative px-5 pb-16 pt-14">
        <div className="hero-orbit -right-20 top-10 h-56 w-56" />
        <div className="hero-orbit -right-8 top-32 h-32 w-32" />
        <div className="relative z-10 flex items-center justify-between">
          <BrandLockup onDark />
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80 backdrop-blur">
            Mitra
          </span>
        </div>
        <div className="relative z-10 mt-9">
          <h1 className="text-[29px] font-extrabold leading-[1.14] tracking-[-0.025em]">
            Masuk ke MITRA
          </h1>
          <p className="mt-2 max-w-[270px] text-[13px] leading-relaxed text-white/70">
            Satu akun untuk semua unit kerja Anda.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="trust-chip">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Wajah + PIN
            </span>
            <span className="trust-chip">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              Sesi 30 hari
            </span>
          </div>
        </div>
      </div>

      <div className="sheet px-5 pb-8 pt-6">
        <form onSubmit={submit} noValidate>
          <div>
            <Field
              label="NIP atau email"
              value={nip}
              onChange={(event) => {
                setNip(event.target.value);
                setErrors((current) => ({ ...current, nip: undefined }));
                setFormError("");
              }}
              hint="Gunakan NIP atau email terdaftar."
              error={errors.nip}
              icon={<UserRound className="h-[18px] w-[18px]" aria-hidden="true" />}
              inputMode="email"
              autoComplete="username"
              placeholder="Contoh: 240812"
            />
          </div>
          <div className="mt-4">
            <PasswordField
              label="Kata sandi"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrors((current) => ({ ...current, password: undefined }));
                setFormError("");
              }}
              error={errors.password}
              autoComplete="current-password"
              onEnter={() => submit()}
              labelAction={
                <button
                  type="button"
                  onClick={onForgot}
                  className="text-[11.5px] font-semibold text-[#2852a3] hover:underline"
                >
                  Lupa kata sandi?
                </button>
              }
            />
          </div>

          <div className="mt-4 flex items-start justify-between gap-3 rounded-[14px] border border-[#e8edf5] bg-[#fafbfe] px-3.5 py-3">
            <div>
              <p className="text-[12px] font-semibold text-[#344054]">
                Ingat perangkat ini selama 30 hari
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[#7c8ba3]">
                Anda tidak perlu memverifikasi ulang di perangkat ini.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={remember}
              aria-label="Ingat perangkat ini selama 30 hari"
              className="switch mt-0.5"
              onClick={() => setRemember((current) => !current)}
            />
          </div>

          {formError ? (
            <InlineAlert className="mt-4">{formError}</InlineAlert>
          ) : null}

          <PrimaryButton
            type="submit"
            className="mt-5"
            loading={loading}
            loadingLabel="Memeriksa akun…"
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Masuk
          </PrimaryButton>
        </form>

        <div className="mt-5 flex items-start gap-2.5 rounded-[13px] bg-[#f5f8fe] px-3.5 py-3">
          <KeyRound className="mt-0.5 h-4 w-4 flex-none text-[#2852a3]" aria-hidden="true" />
          <p className="text-[11.5px] leading-relaxed text-[#5b6b85]">
            Akses hanya untuk mitra terdaftar. Butuh bantuan?{" "}
            <button type="button" className="font-semibold text-[#2852a3] hover:underline">
              Hubungi admin unit
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotScreen({
  onBack,
  onSent,
}: {
  onBack: () => void;
  onSent: (identifier: string) => void;
}) {
  const [identifier, setIdentifier] = useState(DEMO.nip);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!identifier.trim()) {
      setError("Masukkan NIP atau email.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      window.setTimeout(() => onSent(identifier), 700);
    }, 800);
  }

  return (
    <SecondaryHeader
      eyebrow="Pemulihan akun"
      title="Atur ulang kata sandi"
      onBack={onBack}
    >
      <p className="text-[12.5px] leading-relaxed text-[#5b6b85]">
        Masukkan NIP atau email terdaftar. Kami akan mengirim kode verifikasi ke kontak
        yang terdaftar.
      </p>
      <form onSubmit={submit} className="mt-5" noValidate>
        <Field
          label="NIP atau email"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setError("");
          }}
          error={error}
          icon={<UserRound className="h-[18px] w-[18px]" aria-hidden="true" />}
          autoComplete="username"
          placeholder="Contoh: 240812"
        />
        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-[#f8fafc] px-3 py-2.5">
          <Mail className="mt-0.5 h-4 w-4 flex-none text-[#7c8ba3]" aria-hidden="true" />
          <p className="text-[11px] leading-relaxed text-[#7c8ba3]">
            Demi keamanan, kami tidak menampilkan apakah sebuah akun terdaftar.
          </p>
        </div>
        {sent ? (
          <div className="mt-4 rounded-[13px] border border-[#bfe6d6] bg-[#f0fdf7] px-3.5 py-3 text-[12px] font-medium text-[#067647]">
            Kode verifikasi dikirim ke kontak terdaftar.
          </div>
        ) : null}
        <PrimaryButton
          type="submit"
          className="mt-5"
          loading={loading}
          loadingLabel="Mengirim kode…"
          icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        >
          Kirim kode verifikasi
        </PrimaryButton>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="ghost-button mx-auto mt-3 block text-[12px]"
      >
        Kembali masuk
      </button>
    </SecondaryHeader>
  );
}

export function OtpScreen({
  onBack,
  onVerified,
}: {
  onBack: () => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  function verify() {
    if (code.length < 6) {
      setError("Masukkan 6 angka kode verifikasi.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (code !== DEMO.otp) {
        setError("Kode verifikasi tidak sesuai. Periksa kembali.");
        return;
      }
      onVerified();
    }, 800);
  }

  return (
    <SecondaryHeader eyebrow="Pemulihan akun" title="Masukkan kode verifikasi" onBack={onBack}>
      <p className="text-[12.5px] leading-relaxed text-[#5b6b85]">
        Kode 6 angka dikirim ke{" "}
        <span className="font-semibold text-[#344054]">{DEMO.maskedEmail}</span>.
      </p>
      <div className="mt-5">
        <PinInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setError("");
          }}
          label="Kode verifikasi"
          invalid={Boolean(error)}
          autoFocus
          onComplete={verify}
        />
        <p className="mt-3 text-center text-[11.5px] text-[#7c8ba3]">
          Kode demo <span className="font-bold text-[#475467]">123456</span>
        </p>
      </div>
      {error ? <InlineAlert className="mt-4">{error}</InlineAlert> : null}
      <PrimaryButton
        type="button"
        className="mt-5"
        onClick={verify}
        loading={loading}
        loadingLabel="Memeriksa kode…"
      >
        Verifikasi kode
      </PrimaryButton>
      <div className="mt-4 text-center text-[11.5px] text-[#7c8ba3]">
        {seconds > 0 ? (
          <>
            Kirim ulang kode dalam{" "}
            <span className="font-semibold tabular-nums text-[#475467]">
              00:{String(seconds).padStart(2, "0")}
            </span>
          </>
        ) : (
          <button
            type="button"
            className="font-semibold text-[#2852a3] hover:underline"
            onClick={() => {
              setSeconds(30);
              setCode("");
              setError("");
            }}
          >
            Kirim ulang kode
          </button>
        )}
      </div>
    </SecondaryHeader>
  );
}

export function ResetPasswordScreen({
  onBack,
  onSaved,
  forceChange = false,
  defaultPassword = false,
}: {
  onBack: () => void;
  onSaved: () => void;
  forceChange?: boolean;
  defaultPassword?: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [loading, setLoading] = useState(false);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const next: typeof errors = {};
    if (password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password))
      next.password = "Gunakan kombinasi huruf dan angka.";
    if (confirmation !== password) next.confirmation = "Konfirmasi belum sama.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onSaved();
    }, 900);
  }

  return (
    <SecondaryHeader
      eyebrow={forceChange ? "Keamanan akun" : "Pemulihan akun"}
      title={forceChange ? "Ganti kata sandi default" : "Buat kata sandi baru"}
      onBack={onBack}
    >
      {defaultPassword ? (
        <div className="mb-4 rounded-[13px] border border-[#f5d9a8] bg-[#fffaf0] px-3.5 py-3 text-[11.5px] leading-relaxed text-[#8a4b08]">
          Kata sandi akun ini baru direset oleh admin. Buat kata sandi pribadi sebelum
          melanjutkan.
        </div>
      ) : null}
      <p className="text-[12.5px] leading-relaxed text-[#5b6b85]">
        Gunakan kata sandi yang kuat dan belum pernah dipakai di MITRA.
      </p>
      <form onSubmit={submit} className="mt-5" noValidate>
        <PasswordField
          label="Kata sandi baru"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          error={errors.password}
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
        />
        <div className="mt-4">
          <PasswordField
            label="Ulangi kata sandi baru"
            value={confirmation}
            onChange={(value) => {
              setConfirmation(value);
              setErrors((current) => ({ ...current, confirmation: undefined }));
            }}
            error={errors.confirmation}
            autoComplete="new-password"
            placeholder="Masukkan ulang kata sandi"
            onEnter={() => submit()}
          />
        </div>
        <PasswordRules password={password} confirmation={confirmation} />
        <PrimaryButton
          type="submit"
          className="mt-5"
          loading={loading}
          loadingLabel="Menyimpan…"
        >
          {forceChange ? "Simpan dan lanjutkan" : "Simpan kata sandi"}
        </PrimaryButton>
      </form>
    </SecondaryHeader>
  );
}

export function ForgotDoneScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-full bg-[#f5f7fb] px-5 pb-8 pt-14">
      <div className="flex justify-center">
        <BrandLockup compact />
      </div>
      <div className="mt-12 text-center">
        <div className="success-ring mx-auto">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
            <path
              className="check-path"
              d="M11 21.5L18 28.5L31 14.5"
              stroke="white"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-7 text-[24px] font-extrabold tracking-[-0.02em] text-[#101a2e]">
          Kata sandi diperbarui
        </h1>
        <p className="mx-auto mt-2 max-w-[270px] text-[12.5px] leading-relaxed text-[#667085]">
          Masuk kembali dengan kata sandi baru Anda. Sesi di perangkat lain tidak berubah.
        </p>
      </div>
      <div className="mt-8 rounded-[16px] border border-[#e8ecf3] bg-white p-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ecfdf3] text-[#067647]">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-[#344054]">Keamanan akun</p>
            <p className="text-[11px] text-[#7c8ba3]">Kata sandi baru aktif.</p>
          </div>
        </div>
      </div>
      <PrimaryButton type="button" className="mt-6" onClick={onLogin}>
        Kembali masuk
      </PrimaryButton>
    </div>
  );
}

export function ForceChangeHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className="ghost-button mx-auto mt-3 block text-[12px] text-[#7c8ba3]"
    >
      <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
      Keluar dari akun
    </button>
  );
}
