import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  AddressBook,
  ArrowLeft,
  CalendarBlank,
  CaretDown,
  CaretRight,
  Check,
  ClipboardText,
  House,
  MagnifyingGlass,
  Plus,
  SlidersHorizontal,
  User,
  Warning,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

const OVERLAY_ID = "phone-overlay";

function useOverlayRoot() {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRoot(document.getElementById(OVERLAY_ID));
  }, []);
  return root;
}

function usePresence(open: boolean, duration = 240) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration]);
  return { mounted, visible };
}

function useEscape(active: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!active || !onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

export function OverlayRoot() {
  return <div id={OVERLAY_ID} className="phone-overlay" />;
}

export function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const root = useOverlayRoot();
  const { mounted, visible } = usePresence(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);
  useEscape(open, onClose);

  useEffect(() => {
    if (visible) panelRef.current?.focus({ preventScroll: true });
  }, [visible]);

  if (!root || !mounted) return null;
  return createPortal(
    <div className="overlay-layer" data-visible={visible}>
      <button
        type="button"
        className="overlay-scrim"
        aria-label="Tutup"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="sheet-panel"
        style={drag ? { transform: `translateY(${drag}px)`, transition: "none" } : undefined}
      >
        <div
          className="flex justify-center pb-2 pt-3"
          onPointerDown={(event) => {
            startY.current = event.clientY;
            (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (startY.current === null) return;
            setDrag(Math.max(0, event.clientY - startY.current));
          }}
          onPointerUp={() => {
            if (drag > 80) onClose();
            startY.current = null;
            setDrag(0);
          }}
        >
          <span className="h-1 w-8 rounded-full bg-[#dfe4ea]" aria-hidden="true" />
        </div>
        <div className="max-h-[calc(100%-24px)] overflow-y-auto px-6 pb-6">{children}</div>
      </div>
    </div>,
    root,
  );
}

type DialogTone = "success" | "error" | "warning";

export function ResultDialog({
  open,
  tone,
  title,
  message,
  onClose,
  children,
}: {
  open: boolean;
  tone: DialogTone;
  title: string;
  message: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}) {
  const root = useOverlayRoot();
  const { mounted, visible } = usePresence(open);
  useEscape(open, onClose);
  if (!root || !mounted) return null;
  const icon =
    tone === "success" ? (
      <Check size={24} weight="bold" />
    ) : tone === "error" ? (
      <X size={24} weight="bold" />
    ) : (
      <Warning size={24} weight="fill" />
    );
  return createPortal(
    <div className="overlay-layer overlay-center" data-visible={visible}>
      <button
        type="button"
        className="overlay-scrim"
        aria-label="Tutup"
        tabIndex={-1}
        onClick={onClose}
      />
      <div role="alertdialog" aria-modal="true" aria-label={title} className="dialog-panel">
        <span className={cn("dialog-icon", `dialog-icon-${tone}`)} aria-hidden="true">
          {icon}
        </span>
        <h2 className="mt-4 text-[18px] font-semibold leading-[1.3] text-[#16191c]">{title}</h2>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#4f5963]">{message}</p>
        {children ? <div className="mt-5 flex flex-col gap-3">{children}</div> : null}
      </div>
    </div>,
    root,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "link" | "ghost-light";
  size?: "md" | "sm";
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn("mbtn", `mbtn-${variant}`, size === "sm" && "mbtn-sm", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function AppBar({
  onBack,
  close,
  tone = "light",
}: {
  onBack?: () => void;
  close?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex h-12 items-center px-[14px]">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full transition active:scale-95",
            tone === "dark" ? "text-white hover:bg-white/10" : "text-[#16191c] hover:bg-[#f1f3f5]",
          )}
          aria-label={close ? "Tutup" : "Kembali"}
        >
          {close ? <X size={18} /> : <ArrowLeft size={18} />}
        </button>
      ) : null}
    </div>
  );
}

export function PageIntro({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div>
      <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">{title}</h1>
      <p className="mt-2 text-[14px] leading-[1.4] text-[#5a5a66]">{description}</p>
    </div>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-medium leading-[1.4] text-[#16191c]">
      {children}
    </label>
  );
}

export function TextField({
  label,
  trailing,
  className,
  id,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  trailing?: ReactNode;
  error?: string;
}) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="min-w-0">
      {label ? <FieldLabel htmlFor={fieldId}>{label}</FieldLabel> : null}
      <div className="relative">
        <input
          id={fieldId}
          className={cn("mfield", trailing && "pr-10", className)}
          data-invalid={error ? "true" : undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {trailing ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#4f5963]">
            {trailing}
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-[12px] leading-[1.4] text-[#d73926]">{error}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  value,
  placeholder,
  onClick,
  chevron = "down",
  disabled,
  emphasize,
}: {
  label?: string;
  value: string;
  placeholder: string;
  onClick: () => void;
  chevron?: "down" | "right" | "calendar";
  disabled?: boolean;
  emphasize?: boolean;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <button
        id={id}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mfield flex items-center gap-3 text-left"
        aria-haspopup="dialog"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            value ? "text-[#16191c]" : "text-[#65737f]",
            value && emphasize && "text-[13px] font-medium text-[#020618]",
          )}
        >
          {value || placeholder}
        </span>
        {chevron === "down" ? (
          <CaretDown size={16} className="flex-none text-[#4f5963]" />
        ) : chevron === "calendar" ? (
          <CalendarBlank size={16} className="flex-none text-[#4f5963]" />
        ) : (
          <CaretRight size={16} className="flex-none text-[#4f5963]" />
        )}
      </button>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="mfield flex items-center gap-3 focus-within:border-[var(--brand-ink)]">
      <MagnifyingGlass size={16} className="flex-none text-[#16191c]" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#16191c] outline-none placeholder:text-[#65737f]"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="grid h-5 w-5 place-items-center rounded-full bg-[#e2e5e8] text-[#4f5963]"
          aria-label="Hapus pencarian"
        >
          <X size={10} weight="bold" />
        </button>
      ) : null}
    </label>
  );
}

export function FilterButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative grid h-11 w-11 flex-none place-items-center rounded-[8px] border border-[#dfe4ea] bg-white text-[#16191c] transition active:scale-95"
      aria-label="Filter"
      aria-haspopup="dialog"
    >
      <SlidersHorizontal size={20} />
      {active ? (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand)] ring-2 ring-white" />
      ) : null}
    </button>
  );
}

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "grid h-4 w-4 flex-none place-items-center rounded-full border transition",
        checked ? "border-[var(--brand-ink)]" : "border-[#c6ccd1] bg-white",
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full bg-[var(--brand)] transition-transform duration-150",
          checked ? "scale-100" : "scale-0",
        )}
      />
    </span>
  );
}

export function RadioCard({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center gap-2 rounded-[8px] border p-3 text-left text-[14px] leading-[1.4] text-[#16191c] transition",
        "border-[#dfe4ea] bg-white",
      )}
    >
      <RadioDot checked={checked} />
      {label}
    </button>
  );
}

export function RadioList<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; detail?: string }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className="flex w-full items-start gap-2.5 border-b border-[#e2e8f0] py-[14px] text-left"
        >
          <span className={option.detail ? "mt-0.5" : undefined}>
            <RadioDot checked={value === option.value} />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-[14px] leading-[1.4] text-[#16191c]",
                option.detail && "font-medium",
              )}
            >
              {option.label}
            </span>
            {option.detail ? (
              <span className="mt-0.5 block text-[12px] leading-[1.4] text-[#4f5963]">
                {option.detail}
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
}

export function FilterChip({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[13px] leading-[1.4] transition active:scale-95",
        selected
          ? "border-[var(--brand-ink)] bg-[var(--brand-soft)] text-[var(--brand-ink)]"
          : "border-[#dfe4ea] bg-white text-[#16191c]",
      )}
    >
      {label}
    </button>
  );
}

export type ChipTone = "success" | "brand" | "muted" | "warm" | "hot" | "cold";

const CHIP_TONES: Record<ChipTone, string> = {
  success: "border-[#288c50] bg-[#e9f6eb] text-[#288c50]",
  brand: "border-[var(--brand-ink)] bg-[var(--brand-soft)] text-[var(--brand-ink)]",
  muted: "border-[#71808e] bg-[#e2e5e8] text-[#4f5963]",
  warm: "border-[#b58a1b] bg-[#fdf6e3] text-[#9a6f00]",
  hot: "border-[#e5484d] bg-[#feeceb] text-[#d73926]",
  cold: "border-[#71808e] bg-[#e2e5e8] text-[#4f5963]",
};

export function StatusChip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center rounded-full border px-2 py-[3px] text-[11px] leading-[1.4]",
        CHIP_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  image,
  title,
  message,
  action,
}: {
  image?: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      {image ? <img src={image} alt="" className="h-[90px] w-[120px] object-contain" /> : null}
      <h2 className="mt-3 text-[16px] font-semibold leading-[1.4] text-[#16191c]">{title}</h2>
      <p className="mt-1 text-[12px] leading-[1.4] text-[#4f5963]">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function BottomNav({
  active,
  onHome,
  onActivity,
  onProfile,
  onSoon,
}: {
  active: "home" | "activity";
  onHome: () => void;
  onActivity: () => void;
  onProfile?: () => void;
  onSoon: (label: string) => void;
}) {
  const items = [
    { id: "home", label: "Home", icon: House, onClick: onHome },
    { id: "activity", label: "Aktivitas", icon: ClipboardText, onClick: onActivity },
    { id: "contact", label: "Kontak", icon: AddressBook, onClick: () => onSoon("Kontak") },
    { id: "profile", label: "Profile", icon: User, onClick: onProfile ?? (() => onSoon("Profile")) },
  ];
  return (
    <nav className="pb-safe sticky bottom-0 z-10 flex bg-white" aria-label="Navigasi utama">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 p-3 transition active:scale-95",
              current ? "border-t-2 border-[var(--brand-ink)] text-[var(--brand-ink)]" : "border-t border-[#dfe4ea] text-[#65737f]",
            )}
          >
            <item.icon size={24} weight={current ? "fill" : "regular"} />
            <span className={cn("text-[14px] leading-[1.4]", current && "font-medium")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Centered extended floating action button. It is pinned to the phone screen
 * (outside the scrolling content), so it stays put while the list scrolls.
 */
export function Fab({
  label,
  onClick,
  above = "screen",
}: {
  label: string;
  onClick: () => void;
  above?: "nav" | "screen";
}) {
  const root = useOverlayRoot();
  if (!root) return null;
  return createPortal(
    <div className={cn("fab-float", above === "nav" ? "fab-float-nav" : "fab-float-screen")}>
      <button type="button" onClick={onClick} className="fab">
        <Plus size={20} weight="bold" aria-hidden="true" />
        {label}
      </button>
    </div>,
    root,
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto border-t border-[#f1f1f1] bg-white px-6 pb-6 pt-4">
      {children}
    </div>
  );
}
