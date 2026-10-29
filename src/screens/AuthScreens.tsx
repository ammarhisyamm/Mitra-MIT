import { useEffect, useState, type FormEvent } from "react";
import { Check, ChevronLeft, LogOut } from "lucide-react";
import {
  Field,
  InlineAlert,
  MitraLogo,
  PasswordField,
  PasswordRules,
  PinInput,
  PrimaryButton,
} from "@/components/primitives";
import { DEMO } from "@/lib/demo";

function PageFooter() {
  return (
    <p className="pt-8 text-center text-[13px] leading-5 text-[#6b7280]">
      V1. Mitra powered by MIT
    </p>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full text-[#151b2b] transition hover:bg-[#f3f4f6]"
      aria-label="Kembali"
    >
      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function PageHeader({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack?: () => void;
}) {
  return (
    <div>
      {onBack ? <BackButton onClick={onBack} /> : <div className="h-11" />}
      <h1 className="mt-7 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
        {title}
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">{description}</p>
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
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<{ nip?: string; password?: string }>({});

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (loading) return;
    const next: typeof errors = {};
    if (!nip.trim()) next.nip = "Masukkan NIP atau nomor telepon.";
    else if (!/^\+?[\d\s-]{4,20}$/.test(nip.trim()))
      next.nip = "Masukkan NIP atau nomor telepon yang valid.";
    if (!password) next.password = "Masukkan kata sandi.";
    else if (password.length < 6) next.password = "Kata sandi minimal 6 karakter.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (forceFail) {
        setFormError("NIP/nomor telepon atau kata sandi tidak sesuai. Periksa kembali.");
        return;
      }
      onSuccess();
    }, 950);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <div className="flex flex-1 flex-col justify-center pb-6">
        <MitraLogo tagline className="pt-6" />

        <form onSubmit={submit} className="mt-10" noValidate>
          <Field
            label="NIP / Nomor telepon"
            value={nip}
            onChange={(event) => {
              setNip(event.target.value);
              setErrors((current) => ({ ...current, nip: undefined }));
              setFormError("");
            }}
            error={errors.nip}
            inputMode="tel"
            autoComplete="username"
            placeholder="Masukkan NIP / Nomor telepon"
          />
          <div className="mt-5">
            <PasswordField
              label="Kata Sandi"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrors((current) => ({ ...current, password: undefined }));
                setFormError("");
              }}
              error={errors.password}
              autoComplete="current-password"
              onEnter={() => submit()}
              placeholder="Masukkan Kata Sandi"
            />
          </div>
          <button
            type="button"
            onClick={onForgot}
            className="mt-0 inline-flex min-h-11 items-center text-left text-[13px] leading-5 text-[#151b2b] underline decoration-[#151b2b] underline-offset-2"
          >
            Lupa Kata Sandi?
          </button>

          {formError ? <InlineAlert className="mt-5">{formError}</InlineAlert> : null}

          <PrimaryButton
            type="submit"
            className="mt-8"
            loading={loading}
            loadingLabel="Memeriksa akun…"
          >
            Masuk
          </PrimaryButton>
        </form>
      </div>

      <PageFooter />
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
      setError("Masukkan NIP atau nomor telepon.");
      return;
    }
    if (!/^\+?[\d\s-]{4,20}$/.test(identifier.trim())) {
      setError("Masukkan NIP atau nomor telepon yang valid.");
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
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <PageHeader
        title="Lupa Kata Sandi"
        description="Masukkan NIP atau nomor telepon terdaftar. Kode verifikasi dikirim lewat SMS."
        onBack={onBack}
      />

      <form onSubmit={submit} className="mt-8" noValidate>
        <Field
          label="NIP / Nomor telepon"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setError("");
          }}
          error={error}
          inputMode="tel"
          autoComplete="username"
          placeholder="Masukkan NIP / Nomor telepon"
        />
        <p className="mt-3 text-[12px] leading-[18px] text-[#6b7280]">
          Demi keamanan, kami tidak menampilkan apakah akun terdaftar.
        </p>
        {sent ? (
          <p className="mt-5 text-[13px] leading-5 text-[#24663f]">
            Kode verifikasi dikirim melalui SMS ke nomor terdaftar.
          </p>
        ) : null}
        <PrimaryButton
          type="submit"
          className="mt-7"
          loading={loading}
          loadingLabel="Mengirim kode…"
        >
          Kirim kode verifikasi
        </PrimaryButton>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Kembali masuk
      </button>
      <div className="flex-1" />
      <PageFooter />
    </div>
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
  const [focusRequest, setFocusRequest] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  function verify(value = code) {
    if (value.length < 6) {
      setError("Masukkan 6 angka kode verifikasi.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (value !== DEMO.otp) {
        setCode("");
        setError("Kode verifikasi tidak sesuai. Periksa kembali.");
        setFocusRequest((current) => current + 1);
        return;
      }
      onVerified();
    }, 800);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <PageHeader
        title="Masukkan Kode Verifikasi"
        description={`Kode 6 angka dikirim melalui SMS ke ${DEMO.maskedPhone}.`}
        onBack={onBack}
      />

      <div className="mt-8">
        <PinInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setError("");
          }}
          label="Kode verifikasi"
          invalid={Boolean(error)}
          autoFocus
          autoComplete="one-time-code"
          errorId="otp-error"
          focusRequest={focusRequest}
          onComplete={verify}
        />
        <p className="mt-4 text-center text-[12px] leading-[18px] text-[#6b7280]">
          Kode demo <span className="font-semibold text-[#151b2b]">123456</span>
        </p>
      </div>

      {error ? (
        <InlineAlert id="otp-error" className="mt-5">
          {error}
        </InlineAlert>
      ) : null}

      <PrimaryButton
        type="button"
        className="mt-7"
        onClick={() => verify()}
        loading={loading}
        loadingLabel="Memeriksa kode…"
      >
        Verifikasi kode
      </PrimaryButton>

      <div className="mt-5 text-center text-[13px] leading-5 text-[#6b7280]">
        {seconds > 0 ? (
          <>
            Kirim ulang kode dalam{" "}
            <span className="font-medium tabular-nums text-[#151b2b]">
              00:{String(seconds).padStart(2, "0")}
            </span>
          </>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-11 items-center font-medium text-[#151b2b] underline underline-offset-2"
            onClick={() => {
              setSeconds(30);
              setCode("");
              setError("");
              setFocusRequest((current) => current + 1);
            }}
          >
            Kirim ulang kode
          </button>
        )}
      </div>
      <div className="flex-1" />
      <PageFooter />
    </div>
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
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <PageHeader
        title={forceChange ? "Ganti Kata Sandi Default" : "Buat Kata Sandi Baru"}
        description="Gunakan kata sandi yang kuat dan belum pernah dipakai di MITRA."
        onBack={forceChange ? undefined : onBack}
      />

      {defaultPassword ? (
        <div className="mt-6 border-l-2 border-[#f9a11f] bg-[#fffaf0] px-3.5 py-3 text-[12px] leading-[18px] text-[#8a4b08]">
          Kata sandi akun ini baru direset oleh admin. Buat kata sandi pribadi sebelum
          melanjutkan.
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-7" noValidate>
        <PasswordField
          label="Kata Sandi Baru"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          error={errors.password}
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
        />
        <div className="mt-5">
          <PasswordField
            label="Ulangi Kata Sandi Baru"
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
          className="mt-7"
          loading={loading}
          loadingLabel="Menyimpan…"
        >
          {forceChange ? "Simpan dan lanjutkan" : "Simpan kata sandi"}
        </PrimaryButton>
      </form>
      <div className="flex-1" />
      {forceChange ? <ForceChangeHeader onLogout={onBack} /> : <PageFooter />}
    </div>
  );
}

export function ForgotDoneScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-16">
      <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#eaf7f0] text-[#24663f]">
          <Check className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <h1 className="mt-7 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          Kata Sandi Diperbarui
        </h1>
        <p className="mt-2 max-w-[290px] text-[14px] leading-6 text-[#667085]">
          Masuk kembali dengan kata sandi baru Anda.
        </p>
        <PrimaryButton type="button" className="mt-8" onClick={onLogin}>
          Kembali masuk
        </PrimaryButton>
      </div>
      <PageFooter />
    </div>
  );
}

export function ForceChangeHeader({ onLogout }: { onLogout: () => void }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mx-auto flex min-h-11 items-center gap-1.5 text-[13px] leading-5 text-[#667085]"
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        Keluar dari akun
      </button>
    );
  }
  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] p-3 text-center">
      <p className="text-[12px] leading-[18px] text-[#151b2b]">
        Keluar sekarang? Anda harus masuk lagi untuk membuat kata sandi baru.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="min-h-11 flex-1 rounded-[8px] border border-[#dfe4ea] bg-white text-[13px] font-medium text-[#151b2b]"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="min-h-11 flex-1 rounded-[8px] bg-[#2852a3] text-[13px] font-medium text-white"
        >
          Ya, keluar
        </button>
      </div>
    </div>
  );
}
