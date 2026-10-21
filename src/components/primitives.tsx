import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  ArrowRight,
  BatteryFull,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Signal,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function MitraMark({
  size = 40,
  onDark = false,
  className,
}: {
  size?: number;
  onDark?: boolean;
  className?: string;
}) {
  if (onDark) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[13px] bg-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)]",
          className,
        )}
        style={{ width: size, height: size, padding: size * 0.16 }}
      >
        <img src="/mit-logo.png" alt="" className="h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <img
      src="/mit-logo.png"
      alt=""
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function BrandLockup({
  onDark = false,
  compact = false,
}: {
  onDark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <MitraMark size={compact ? 32 : 38} onDark={onDark} />
      <div className="leading-none">
        <div
          className={cn(
            "flex items-center gap-1.5 text-[17px] font-extrabold tracking-[0.16em]",
            onDark ? "text-white" : "text-[#122b5c]",
          )}
        >
          MITRA
          <span className="mb-[7px] inline-block h-1.5 w-1.5 rounded-[1px] bg-[#f9a11f]" />
        </div>
        <div
          className={cn(
            "mt-1 text-[8.5px] font-semibold uppercase tracking-[0.13em]",
            onDark ? "text-white/55" : "text-[#7c8ba3]",
          )}
        >
          Mulia Informasi Teknologi
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "text-white" : "text-[#122b5c]";
  return (
    <div className={cn("status-bar", color)} aria-hidden="true">
      <span className="w-12">9.41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" strokeWidth={2.6} />
        <Wifi className="h-3.5 w-3.5" strokeWidth={2.6} />
        <BatteryFull className="h-4 w-4" strokeWidth={2.2} />
      </div>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  optional?: boolean;
  labelAction?: ReactNode;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, icon, trailing, optional, labelAction, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-message`;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className="text-[14px] font-medium leading-5 text-[#16191c]">
          {label}
        </label>
        {optional ? (
          <span className="text-[12px] font-normal leading-[18px] text-[#71808e]">Opsional</span>
        ) : labelAction ? (
          labelAction
        ) : null}
      </div>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71808e]">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={fieldId}
          className={cn("field", icon && "pl-10", trailing && "pr-10", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          data-invalid={error ? "true" : undefined}
          {...props}
        />
        {trailing ? (
          <span className="absolute right-1 top-1/2 -translate-y-1/2">{trailing}</span>
        ) : null}
      </div>
      {error ? (
        <p
          id={messageId}
          className="mt-1 flex items-start gap-1 text-[12px] font-normal leading-[18px] text-[#d73926]"
        >
          <AlertCircle className="mt-[3px] h-3 w-3 flex-none" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1 text-[12px] leading-[18px] text-[#71808e]">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export function PasswordField({
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
  placeholder = "Masukkan kata sandi",
  onEnter,
  labelAction,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  onEnter?: () => void;
  labelAction?: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      label={label}
      labelAction={labelAction}
      type={visible ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={error}
      hint={hint}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onKeyDown={(event) => {
        if (event.key === "Enter" && onEnter) onEnter();
      }}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="grid h-8 w-8 place-items-center rounded-[6px] text-[#71808e] transition hover:bg-[#f1f1f1] hover:text-[#16191c]"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {visible ? (
            <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  icon?: ReactNode;
};

export function PrimaryButton({
  children,
  loading,
  loadingLabel,
  icon,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn("primary-button", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {loadingLabel ?? "Memproses…"}
        </>
      ) : (
        <>
          {children}
          {icon ?? null}
        </>
      )}
    </button>
  );
}

export function ArrowButtonText() {
  return <ArrowRight className="h-4 w-4" aria-hidden="true" />;
}

export function InlineAlert({
  children,
  tone = "error",
  className,
}: {
  children: ReactNode;
  tone?: "error" | "info";
  className?: string;
}) {
  if (tone === "info") {
    return (
      <div className={cn("info-box", className)} role="status">
        {children}
      </div>
    );
  }
  return (
    <div className={cn("alert-error", className)} role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function StepHeader({
  step,
  total,
  title,
  onBack,
  backLabel = "Kembali",
}: {
  step: number;
  total: number;
  title: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-[#475467] transition hover:bg-[#eef2f8]"
            aria-label={backLabel}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <span className="h-10 w-10" />
        )}
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c8ba3]">
          Langkah {step} dari {total}
        </span>
        <span className="h-10 w-10" />
      </div>
      <div className="progress-track mt-3" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <h1 className="mt-6 text-[25px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#101a2e]">
        {title}
      </h1>
    </div>
  );
}

export function PinInput({
  value,
  onChange,
  length = 6,
  invalid = false,
  autoFocus = false,
  label = "PIN",
  onComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  autoFocus?: boolean;
  label?: string;
  onComplete?: () => void;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [reveal, setReveal] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, [autoFocus]);

  function flashReveal() {
    setReveal(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setReveal(false), 900);
  }

  function setDigit(index: number, digit: string) {
    const next = value.padEnd(length, " ").split("");
    next[index] = digit;
    const joined = next.join("").replace(/ /g, "").slice(0, length);
    onChange(joined);
    flashReveal();
    if (digit && index < length - 1) inputs.current[index + 1]?.focus();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!digits) return;
    onChange(digits);
    flashReveal();
    inputs.current[Math.min(digits.length, length - 1)]?.focus();
    if (digits.length === length) onComplete?.();
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label={label}>
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? "";
        return (
          <input
            key={index}
            ref={(node) => {
              inputs.current[index] = node;
            }}
            value={digit}
            type={reveal ? "text" : "password"}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`${label}, angka ${index + 1}`}
            data-filled={digit ? "true" : undefined}
            data-invalid={invalid ? "true" : undefined}
            className="pin-cell"
            maxLength={1}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");
              if (digits.length > 1) {
                const pasted = digits.slice(0, length);
                onChange(pasted);
                flashReveal();
                inputs.current[Math.min(pasted.length, length - 1)]?.focus();
                return;
              }
              setDigit(index, digits);
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                if (digit) {
                  setDigit(index, "");
                } else if (index > 0) {
                  inputs.current[index - 1]?.focus();
                  setDigit(index - 1, "");
                }
              }
              if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
              if (event.key === "ArrowRight" && index < length - 1)
                inputs.current[index + 1]?.focus();
              if (event.key === "Enter" && value.length === length) onComplete?.();
            }}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
          />
        );
      })}
    </div>
  );
}

export function PinDemoHint({ label = "PIN demo" }: { label?: string }) {
  return (
    <p className="mt-3 text-center text-[12px] leading-[18px] text-[#71808e]">
      {label} <span className="font-semibold text-[#16191c]">240812</span>
    </p>
  );
}

export function PasswordRules({
  password,
  confirmation,
}: {
  password: string;
  confirmation: string;
}) {
  const rules = [
    { label: "Minimal 8 karakter", met: password.length >= 8 },
    { label: "Mengandung huruf dan angka", met: /[a-zA-Z]/.test(password) && /\d/.test(password) },
    {
      label: "Konfirmasi sama",
      met: password.length > 0 && confirmation.length > 0 && password === confirmation,
    },
  ];
  return (
    <ul className="mt-3 space-y-1" aria-label="Ketentuan kata sandi">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-1.5 text-[12px] leading-[18px] transition-colors",
            rule.met ? "text-[#24663f]" : "text-[#71808e]",
          )}
        >
          <span
            className={cn(
              "grid h-3 w-3 flex-none place-items-center rounded-full",
              rule.met ? "bg-[#e9f6eb] text-[#24663f]" : "border border-[#9ba6af]",
            )}
            aria-hidden="true"
          >
            {rule.met ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

export function ScreenScroll({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("min-h-full", padded && "px-5", className)}>{children}</div>
  );
}
