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
  return (
    <span
      className={cn(
        "inline-grid flex-none place-items-center overflow-hidden rounded-full",
        onDark && "ring-1 ring-white/20",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#2852a3" />
        <path
          d="M11.5 35.5V14.8c0-1.2 1.5-1.8 2.3-.8l6.3 8.4c.6.8 1.8.8 2.3 0l6.2-8.4c.8-1 2.4-.4 2.4.8v20.7h-5.4V24.3l-4.5 6.1c-.5.7-1.5.7-2.1 0l-4.4-6v11.1z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

export function BrandLockup({
  onDark = false,
  compact = false,
  size,
}: {
  onDark?: boolean;
  compact?: boolean;
  size?: number;
}) {
  const markSize = size ?? (compact ? 30 : 40);
  return (
    <div className="flex items-center gap-2.5">
      <MitraMark size={markSize} onDark={onDark} />
      <span
        className={cn(
          "font-extrabold italic leading-none tracking-[-0.01em]",
          compact ? "text-[20px]" : "text-[26px]",
          onDark ? "text-white" : "text-[#151b2b]",
        )}
      >
        MITRA
      </span>
    </div>
  );
}

export function MitraLogo({
  tagline = false,
  poweredBy = false,
  className,
}: {
  tagline?: boolean;
  poweredBy?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="flex items-center gap-3">
        <MitraMark size={52} />
        <span className="text-[34px] font-extrabold italic leading-none tracking-[-0.02em] text-[#151b2b]">
          MITRA
        </span>
      </div>
      {tagline ? (
        <p className="mt-2.5 text-[13px] leading-5 text-[#4b5563]">
          MIT Relationship &amp; Activity Tracker
        </p>
      ) : null}
      {poweredBy ? (
        <p className="mt-1 text-[12px] italic leading-5 text-[#4b5563]">Powered by MIT</p>
      ) : null}
    </div>
  );
}

export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "text-white" : "text-[#122b5c]";
  return (
    <div className={cn("status-bar", color, tone === "light" && "status-bar-overlay")} aria-hidden="true">
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
        <label htmlFor={fieldId} className="text-[14px] font-medium leading-5 text-[#151b2b]">
          {label}
        </label>
        {optional ? (
          <span className="text-[12px] font-normal leading-[18px] text-[#667085]">Opsional</span>
        ) : labelAction ? (
          labelAction
        ) : null}
      </div>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={fieldId}
          className={cn("field", icon && "pl-11", trailing && "pr-11", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          data-invalid={error ? "true" : undefined}
          {...props}
        />
        {trailing ? (
          <span className="absolute right-0 top-1/2 -translate-y-1/2">{trailing}</span>
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
        <p id={messageId} className="mt-1 text-[12px] leading-[18px] text-[#667085]">
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
          className="grid h-11 w-11 place-items-center rounded-[8px] text-[#667085] transition hover:bg-[#f3f4f6] hover:text-[#151b2b]"
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
  iconPosition?: "leading" | "trailing";
};

export function PrimaryButton({
  children,
  loading,
  loadingLabel,
  icon,
  iconPosition = "trailing",
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
          {iconPosition === "leading" ? icon ?? null : null}
          {children}
          {iconPosition === "trailing" ? icon ?? null : null}
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
  id,
}: {
  children: ReactNode;
  tone?: "error" | "info";
  className?: string;
  id?: string;
}) {
  if (tone === "info") {
    return (
      <div id={id} className={cn("info-box", className)} role="status">
        {children}
      </div>
    );
  }
  return (
    <div id={id} className={cn("alert-error", className)} role="alert">
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
  step?: number;
  total?: number;
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
            className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full text-[#151b2b] transition hover:bg-[#f3f4f6]"
            aria-label={backLabel}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
        {step && total ? (
          <span className="text-[12px] leading-5 text-[#6b7280]">
            {step} / {total}
          </span>
        ) : null}
      </div>
      <h1 className="mt-6 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
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
  autoComplete = "off",
  revealMs = 0,
  errorId,
  focusRequest = 0,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  autoFocus?: boolean;
  label?: string;
  onComplete?: (value: string) => void;
  autoComplete?: "off" | "one-time-code" | "new-password";
  revealMs?: number;
  errorId?: string;
  focusRequest?: number;
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

  useEffect(() => {
    if (focusRequest > 0) inputs.current[0]?.focus();
  }, [focusRequest]);

  function flashReveal() {
    if (!revealMs) return;
    setReveal(true);
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setReveal(false), revealMs);
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
    if (digits.length === length) onComplete?.(digits);
  }

  return (
    <div className="pin-row" role="group" aria-label={label}>
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
            autoComplete={index === 0 ? autoComplete : "off"}
            aria-label={`${label}, angka ${index + 1}`}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? errorId : undefined}
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
              if (event.key === "Enter" && value.length === length) onComplete?.(value);
            }}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
          />
        );
      })}
    </div>
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
            rule.met ? "text-[#24663f]" : "text-[#667085]",
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
