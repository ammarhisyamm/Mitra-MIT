import { useEffect, useRef, useState } from "react";
import { Button, Sheet } from "@/components/mobile";
import { MONTHS, todayIso } from "@/lib/activity";

const ROW = 36;

type WheelItem = { value: number; label: string; disabled: boolean };

function parse(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { y: year, m: month - 1, d: day };
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysIn(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

/** One scroll-snapping column. Disabled rows can be seen but never selected. */
function WheelColumn({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: WheelItem[];
  value: number;
  onChange: (value: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idle = useRef(0);
  const index = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const target = index * ROW;
    if (Math.abs(node.scrollTop - target) > 1) node.scrollTo({ top: target, behavior: "smooth" });
  }, [index]);

  useEffect(() => () => window.clearTimeout(idle.current), []);

  function settle() {
    const node = ref.current;
    if (!node) return;
    const at = Math.min(items.length - 1, Math.max(0, Math.round(node.scrollTop / ROW)));
    let pick = at;
    if (items[at].disabled) {
      const next = items.findIndex((item, position) => position > at && !item.disabled);
      const previous = items.map((item) => !item.disabled).lastIndexOf(true);
      pick = next >= 0 ? next : previous;
    }
    if (pick < 0) return;
    if (items[pick].value !== value) onChange(items[pick].value);
    else node.scrollTo({ top: pick * ROW, behavior: "smooth" });
  }

  return (
    <div
      ref={ref}
      className="wheel-col no-scrollbar"
      role="listbox"
      aria-label={label}
      onScroll={() => {
        window.clearTimeout(idle.current);
        idle.current = window.setTimeout(settle, 120);
      }}
    >
      <div style={{ height: ROW * 2 }} aria-hidden="true" />
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="option"
          aria-selected={item.value === value}
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          onClick={() => onChange(item.value)}
          className="wheel-item"
        >
          {item.label}
        </button>
      ))}
      <div style={{ height: ROW * 2 }} aria-hidden="true" />
    </div>
  );
}

/**
 * "Tanggal Pelaksanaan" wheel picker. Dates before today are shown greyed out
 * and cannot be chosen; scrolling onto one snaps forward to the first valid day.
 */
export function DateWheelSheet({
  open,
  value,
  onClose,
  onApply,
}: {
  open: boolean;
  value: string;
  onClose: () => void;
  onApply: (iso: string) => void;
}) {
  const min = parse(todayIso());
  const [draft, setDraft] = useState(() => parse(value || todayIso()));

  useEffect(() => {
    if (open) setDraft(parse(value && value >= todayIso() ? value : todayIso()));
  }, [open, value]);

  // Keep the draft valid: clamp the day to the month length and never before today.
  function update(patch: Partial<typeof draft>) {
    setDraft((current) => {
      const next = { ...current, ...patch };
      next.d = Math.min(next.d, daysIn(next.y, next.m));
      if (toIso(next.y, next.m, next.d) < toIso(min.y, min.m, min.d)) {
        if (next.y < min.y) next.y = min.y;
        if (next.y === min.y && next.m < min.m) next.m = min.m;
        if (next.y === min.y && next.m === min.m && next.d < min.d) next.d = min.d;
      }
      return next;
    });
  }

  const days: WheelItem[] = Array.from({ length: daysIn(draft.y, draft.m) }, (_, index) => {
    const day = index + 1;
    return {
      value: day,
      label: String(day).padStart(2, "0"),
      disabled: draft.y === min.y && draft.m === min.m && day < min.d,
    };
  });
  const months: WheelItem[] = MONTHS.map((name, index) => ({
    value: index,
    label: name,
    disabled: draft.y === min.y && index < min.m,
  }));
  const years: WheelItem[] = Array.from({ length: 4 }, (_, index) => ({
    value: min.y + index,
    label: String(min.y + index),
    disabled: false,
  }));

  return (
    <Sheet open={open} onClose={onClose} label="Tanggal Pelaksanaan">
      <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">Tanggal Pelaksanaan</h2>
      <p className="mt-1 text-[12px] leading-[1.4] text-[#65737f]">Hanya hari ini dan tanggal setelahnya.</p>
      <div className="wheel mt-3">
        <div className="wheel-highlight" aria-hidden="true" />
        <div className="relative grid grid-cols-[64px_1fr_72px] gap-2 px-3">
          <WheelColumn label="Tanggal" items={days} value={draft.d} onChange={(d) => update({ d })} />
          <WheelColumn label="Bulan" items={months} value={draft.m} onChange={(m) => update({ m })} />
          <WheelColumn label="Tahun" items={years} value={draft.y} onChange={(y) => update({ y })} />
        </div>
      </div>
      <Button className="mt-5 w-full" onClick={() => onApply(toIso(draft.y, draft.m, draft.d))}>
        Terapkan
      </Button>
    </Sheet>
  );
}
