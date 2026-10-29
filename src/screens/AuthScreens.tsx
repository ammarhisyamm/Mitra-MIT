import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CheckCircle, Circle, Eye, EyeSlash, Info, WarningCircle } from "@phosphor-icons/react";
import { MitraMark } from "@/components/primitives";
import { AppBar, Button, FieldLabel, ResultDialog, TextField } from "@/components/mobile";
import { cn } from "@/lib/cn";
import { DEMO_ACCOUNT } from "@/lib/demo";


const digits = (value: string) => value.replace(/\D/g, "");

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function maskPhone(phone: string) {
  const value = `62${digits(phone).replace(/^0/, "")}`;
  return `${value.slice(0, 3)}${"*".repeat(Math.max(0, value.length - 5))}${value.slice(-2)}`;
}

function AlertBox({ children }: { children: string }) {
  return (
    <div
      role="alert"
      className="card-enter flex items-start gap-2 rounded-[8px] border border-[#f5c2bb] bg-[#fdf1ef] px-3 py-2.5 text-[13px] leading-[1.4] text-[#b42318]"
    >
      <WarningCircle size={18} weight="fill" className="mt-px flex-none" aria-hidden="true" />
      {children}
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  error,
  autoComplete,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  invalid?: boolean;
}) {
  const [show, setShow] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="mfield pr-11"
          value={value}
          autoComplete={autoComplete}
          placeholder="Masukkan kata sandi"
          data-invalid={error || invalid ? "true" : undefined}
          aria-invalid={error || invalid ? true : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={show}
          className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-[#4f5963] transition active:bg-[#f1f3f5]"
        >
          {show ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error ? <p className="mt-1 text-[12px] leading-[1.4] text-[#d73926]">{error}</p> : null}
    </div>
  );
}

function Footer() {
  return (
    <p className="pb-safe pt-6 text-center text-[13px] leading-5 text-[#45556c]">V1. Mitra powered by MIT</p>
  );
}

function StickyAction({ children }: { children: ReactNode }) {
  return <div className="pb-safe sticky bottom-0 mt-auto bg-white px-6 pt-4">{children}</div>;
}

function LockIllustration() {
  return (
    <svg viewBox="0 0 160 96" className="mx-auto h-[96px] w-[160px]" aria-hidden="true">
      <defs>
        <linearGradient id="lock-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6edfb" />
          <stop offset="1" stopColor="#f5f8fe" />
        </linearGradient>
        <linearGradient id="lock-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3fa6c9" />
          <stop offset="1" stopColor="#1f7aa1" />
        </linearGradient>
        <linearGradient id="lock-shackle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7cc8e2" />
          <stop offset="1" stopColor="#3b9ec4" />
        </linearGradient>
      </defs>
      <rect x="6" y="22" width="148" height="70" rx="8" fill="url(#lock-card)" />
      <path
        d="M0 96c6-10 18-12 26-6 6-8 20-8 26 0h56c6-8 20-8 26 0 8-6 20-4 26 6Z"
        fill="#fff"
        opacity="0.95"
      />
      <path
        d="M58 44V30a22 22 0 0 1 44 0v14"
        fill="none"
        stroke="url(#lock-shackle)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M62 30a18 18 0 0 1 14-17" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <rect x="44" y="40" width="72" height="54" rx="7" fill="url(#lock-body)" />
      <path d="M50 46h22l-14 42h-8Z" fill="#fff" opacity="0.14" />
      <circle cx="80" cy="62" r="7" fill="#155f80" />
      <path d="M76.5 64h7l1.8 13h-10.6Z" fill="#155f80" />
    </svg>
  );
}

/* ---------------------------------- Login ---------------------------------- */

export function LoginScreen({
  onLoggedIn,
  onForgot,
  accountPassword,
  initialId = "",
}: {
  onLoggedIn: (target: "change" | "home") => void;
  onForgot: () => void;
  accountPassword: string;
  initialId?: string;
}) {
  const [userId, setUserId] = useState(initialId);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [askChange, setAskChange] = useState(false);
  const ready = userId.trim().length > 0 && password.length > 0;

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!ready || loading) return;
    setLoading(true);
    setFailed(false);
    await wait(900);
    setLoading(false);
    const id = digits(userId);
    const known = id === DEMO_ACCOUNT.nik || id === DEMO_ACCOUNT.phone;
    if (!known || password !== accountPassword) {
      setFailed(true);
      return;
    }
    setAskChange(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <form onSubmit={submit} className="flex flex-1 flex-col justify-center px-6 py-10" noValidate>
        <div className="auth-logo flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <MitraMark size={46} />
            <span className="text-[36px] font-extrabold italic leading-none tracking-[0.02em] text-[#151b2b]">
              MITRA
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-5 text-[#45556c]">MIT Relationship &amp; Activity Tracker</p>
        </div>

        <h1 className="sr-only">Masuk ke MITRA</h1>

        <div className="mt-10 flex flex-col gap-4">
          {failed ? <AlertBox>Nomor atau kata sandi salah, silahkan coba lagi.</AlertBox> : null}
          <TextField
            label="NIK / Nomor HP"
            inputMode="numeric"
            autoComplete="username"
            placeholder="Masukkan NIK atau nomor HP"
            value={userId}
            data-invalid={failed ? "true" : undefined}
            onChange={(event) => {
              setUserId(event.target.value);
              setFailed(false);
            }}
          />
          <div>
            <PasswordInput
              label="Kata Sandi"
              value={password}
              autoComplete="current-password"
              invalid={failed}
              onChange={(value) => {
                setPassword(value);
                setFailed(false);
              }}
            />
            <button
              type="button"
              onClick={onForgot}
              className="mt-2 text-[13px] font-medium leading-5 text-[#16191c] underline underline-offset-2 transition active:text-[#2852a3]"
            >
              Lupa Kata Sandi?
            </button>
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={!ready} loading={loading}>
          Masuk
        </Button>

        <button
          type="button"
          onClick={() => {
            setUserId(DEMO_ACCOUNT.phone);
            setPassword(accountPassword);
            setFailed(false);
          }}
          className="mt-6 flex items-start gap-2.5 rounded-[8px] border border-dashed border-[#bcd0f5] bg-[#f0f5fe] px-3 py-2.5 text-left transition active:bg-[#e3ecfd]"
        >
          <Info size={18} weight="fill" className="mt-px flex-none text-[#2852a3]" aria-hidden="true" />
          <span className="text-[12px] leading-[1.5] text-[#2852a3]">
            <span className="font-semibold">Akun demo</span> · {DEMO_ACCOUNT.phone} (atau NIK {DEMO_ACCOUNT.nik}) /{" "}
            {accountPassword}
            <span className="block text-[#45556c]">Ketuk untuk isi otomatis</span>
          </span>
        </button>
      </form>

      <Footer />

      <ResultDialog
        open={askChange}
        tone="success"
        title="Ubah Kata Sandi?"
        message="Demi menjaga keamanan transaksi Anda. Segera ubah password Anda terlebih dahulu."
      >
        <Button className="w-full" onClick={() => onLoggedIn("change")}>
          Ubah Sekarang
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onLoggedIn("home")}>
          Nanti Saja
        </Button>
      </ResultDialog>
    </div>
  );
}

/* ----------------------------- Forgot: phone ------------------------------- */

export function ForgotScreen({
  onBack,
  onSent,
}: {
  onBack: () => void;
  onSent: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!phone.trim() || loading) return;
    setLoading(true);
    await wait(800);
    setLoading(false);
    if (digits(phone) !== DEMO_ACCOUNT.phone) {
      setError("Nomor tidak terdaftar");
      return;
    }
    onSent(digits(phone));
  }

  return (
    <form onSubmit={submit} className="flex min-h-full flex-col bg-white pt-status" noValidate>
      <AppBar onBack={onBack} />
      <div className="px-6 pt-4">
        <LockIllustration />
        <h1 className="mt-8 text-[24px] font-semibold leading-[1.2] text-[#16191c]">Atur Ulang Kata Sandi</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          Masukkan nomor handphone terdaftar. Kami akan mengirim kode verifikasi ke kontak yang terdaftar.
        </p>
        <div className="mt-5">
          <TextField
            label="Nomor Handphone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Contoh: 081234567890"
            value={phone}
            error={error}
            onChange={(event) => {
              setPhone(event.target.value);
              setError("");
            }}
          />
          {!error ? (
            <p className="mt-2 text-[12px] leading-[1.4] text-[#65737f]">
              Nomor demo: <span className="font-medium text-[#2852a3]">{DEMO_ACCOUNT.phone}</span>
            </p>
          ) : null}
        </div>
      </div>
      <StickyAction>
        <Button type="submit" className="w-full" disabled={!phone.trim()} loading={loading}>
          Kirim Kode Verifikasi
        </Button>
      </StickyAction>
    </form>
  );
}

/* ------------------------------- Forgot: OTP ------------------------------- */

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpScreen({
  phone,
  onBack,
  onVerified,
  onNotice,
}: {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
  onNotice: (message: string) => void;
}) {
  const [code, setCode] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const value = code.join("");

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    // Runs after the app's heading focus so the keyboard opens on the first box.
    const timer = window.setTimeout(() => inputs.current[0]?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, []);

  async function verify(entered: string) {
    if (entered.length < OTP_LENGTH || loading) return;
    setLoading(true);
    await wait(700);
    setLoading(false);
    if (entered !== DEMO_ACCOUNT.otp) {
      setError(true);
      return;
    }
    onVerified();
  }

  function fill(start: number, chars: string) {
    // After a wrong code, the next keystroke starts a fresh attempt.
    const next = error ? Array<string>(OTP_LENGTH).fill("") : [...code];
    let index = error ? 0 : start;
    for (const char of chars) {
      if (index >= OTP_LENGTH) break;
      next[index] = char;
      index += 1;
    }
    setCode(next);
    setError(false);
    inputs.current[Math.min(index, OTP_LENGTH - 1)]?.focus();
    if (next.every(Boolean)) void verify(next.join(""));
  }

  function onKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (/^\d$/.test(event.key)) {
      // Handle digits here so retyping the same digit still advances.
      event.preventDefault();
      fill(index, event.key);
    } else if (event.key === "Backspace" && !code[index] && index > 0) {
      const next = [...code];
      next[index - 1] = "";
      setCode(next);
      inputs.current[index - 1]?.focus();
      event.preventDefault();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function onPaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = digits(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    fill(index, pasted);
  }

  return (
    <div className="flex min-h-full flex-col bg-white pt-status">
      <AppBar onBack={onBack} />
      <div className="px-6 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">Masukkan Kode Verifikasi</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          Kode 6 angka dikirim ke <span className="font-medium text-[#16191c]">{maskPhone(phone)}</span>
        </p>

        {error ? (
          <div className="mt-5">
            <AlertBox>Kode verifikasi tidak sesuai. Periksa kembali.</AlertBox>
          </div>
        ) : null}

        <div className={cn("mt-6 flex justify-between gap-2", error && "otp-shake")} role="group" aria-label="Kode verifikasi">
          {code.map((char, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              value={char}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              data-invalid={error ? "true" : undefined}
              data-filled={char ? "true" : undefined}
              className="otp-box"
              onFocus={(event) => event.target.select()}
              onKeyDown={(event) => onKey(index, event)}
              onPaste={(event) => onPaste(index, event)}
              onChange={(event) => {
                const entered = digits(event.target.value);
                if (!entered) {
                  const next = [...code];
                  next[index] = "";
                  setCode(next);
                  return;
                }
                fill(index, entered.slice(-1));
              }}
            />
          ))}
        </div>

        <p className="mt-5 text-[13px] leading-[1.5] text-[#4f5963]">
          Jika tidak menerima pesan silakan kirim ulang{" "}
          {seconds > 0 ? (
            <span className="font-medium tabular-nums text-[#16191c]">
              00:{String(seconds).padStart(2, "0")} detik
            </span>
          ) : (
            <button
              type="button"
              className="font-semibold text-[#2852a3] underline underline-offset-2"
              onClick={() => {
                setSeconds(RESEND_SECONDS);
                setCode(Array(OTP_LENGTH).fill(""));
                setError(false);
                inputs.current[0]?.focus();
                onNotice(`Kode verifikasi baru dikirim ke ${maskPhone(phone)}.`);
              }}
            >
              Kirim Ulang
            </button>
          )}
        </p>
        <p className="mt-2 text-[12px] leading-[1.4] text-[#65737f]">
          Kode demo: <span className="font-medium text-[#2852a3]">{DEMO_ACCOUNT.otp}</span>
        </p>
      </div>
      <StickyAction>
        <Button
          className="w-full"
          disabled={value.length < OTP_LENGTH}
          loading={loading}
          onClick={() => void verify(value)}
        >
          Verifikasi
        </Button>
      </StickyAction>
    </div>
  );
}

/* ----------------------------- New password -------------------------------- */

const RULES = [
  { label: "Huruf kapital", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Angka", test: (value: string) => /\d/.test(value) },
  { label: "Huruf kecil", test: (value: string) => /[a-z]/.test(value) },
  { label: "Spesial karakter", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function NewPasswordScreen({
  mode,
  onBack,
  onDone,
}: {
  mode: "reset" | "change";
  onBack: () => void;
  onDone: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  const longEnough = password.length >= 8;
  const strong = longEnough && RULES.every((rule) => rule.test(password));
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = strong && confirm === password;

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    setTouched(true);
    if (!ready || loading) return;
    setLoading(true);
    await wait(900);
    setLoading(false);
    setDone(true);
  }

  return (
    <form onSubmit={submit} className="flex min-h-full flex-col bg-white pt-status" noValidate>
      <AppBar onBack={onBack} />
      <div className="px-6 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">Buat Kata Sandi Baru</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">
          Gunakan kata sandi yang kuat dan belum pernah dipakai di MITRA.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <PasswordInput
              label="Kata Sandi Baru"
              value={password}
              autoComplete="new-password"
              onChange={setPassword}
            />
            <div className="mt-3 rounded-[8px] bg-[#f8fafc] p-3">
              <p className={cn("text-[12px] leading-[1.4]", longEnough ? "text-[#13a06b]" : "text-[#4f5963]")}>
                Password harus berisi minimal 8 karakter dan kombinasi dari:
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                {RULES.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={cn(
                        "flex items-center gap-1.5 text-[12px] leading-[1.4] transition-colors",
                        met ? "text-[#13a06b]" : "text-[#65737f]",
                      )}
                    >
                      {met ? (
                        <CheckCircle size={16} weight="fill" aria-hidden="true" />
                      ) : (
                        <Circle size={16} aria-hidden="true" />
                      )}
                      {rule.label}
                      <span className="sr-only">{met ? "terpenuhi" : "belum terpenuhi"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <PasswordInput
            label="Ulangi Kata Sandi Baru"
            value={confirm}
            autoComplete="new-password"
            onChange={setConfirm}
            error={mismatch || (touched && !confirm) ? "Password tidak sama, silakan cek kembali!" : undefined}
          />
        </div>
      </div>
      <StickyAction>
        <Button type="submit" className="w-full" disabled={!ready} loading={loading}>
          Atur Ulang Kata Sandi
        </Button>
      </StickyAction>

      <ResultDialog
        open={done}
        tone="success"
        title="Kata Sandi Diperbarui"
        message={
          mode === "reset"
            ? "Masuk kembali dengan kata sandi baru Anda."
            : "Kata sandi baru sudah aktif. Gunakan untuk login berikutnya."
        }
      >
        <Button className="w-full" onClick={() => onDone(password)}>
          {mode === "reset" ? "Login Ulang" : "Lanjut ke Aktivitas"}
        </Button>
      </ResultDialog>
    </form>
  );
}
