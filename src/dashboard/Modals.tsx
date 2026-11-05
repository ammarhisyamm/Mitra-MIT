import { useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  RINGKASAN_SO, SO_LIST, detailFor, planTotals, rupiah, sumDetail,
  type Metric, type SoPlan,
} from "./data";

function Shell({
  title, subtitle, width = 850, onClose, children, footer,
}: {
  title: string; subtitle?: string; width?: number; onClose: () => void;
  children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width }}
        className="flex max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[0_24px_48px_-12px_rgba(16,24,40,0.25)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] px-6 py-4">
          <div>
            <h2 className="m-0 text-[18px] leading-7 font-semibold text-[var(--color-ink)]">{title}</h2>
            {subtitle && <p className="m-0 mt-0.5 text-[14px] leading-5 text-[var(--color-muted)]">{subtitle}</p>}
          </div>
          <button aria-label="Tutup" onClick={onClose} className="grid size-6 shrink-0 cursor-pointer place-items-center border-0 bg-transparent text-[var(--color-ink)]">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 [&>*]:shrink-0">{children}</div>
        {footer && <div className="flex justify-end border-t border-[var(--color-line)] bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

function Avatar() {
  return <img src="/dashboard/avatar.png" alt="" className="size-8 shrink-0 rounded-full" />;
}

type StatItem = { label: string; value: string; sub?: string; subValue?: string };

function Stats({ items, className }: { items: StatItem[]; className: string }) {
  return (
    <div className={`grid grid-cols-3 ${className}`}>
      {items.map((it, i) => (
        <div key={it.label} className={`px-4 ${i === 0 ? "" : "border-l border-[var(--color-line)]"}`}>
          <div className="text-[14px] leading-5 text-[var(--color-muted)]">{it.label}</div>
          <div className="mt-1 text-[20px] leading-7 font-medium text-[var(--color-ink)]">{it.value}</div>
          {it.sub && (
            <div className="mt-1 text-[13px] leading-5 text-[var(--color-muted)]">
              {it.sub}<span className="ml-1.5 text-[14px] font-semibold text-[var(--color-ink)]">{it.subValue}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const SUMMARY = "rounded-xl border border-[var(--color-line)] bg-white py-4 shadow-[0_1px_3px_rgba(16,24,40,0.1)]";
const INNER = "rounded-xl border border-[var(--color-line)] py-3";

export function RingkasanModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell title="Detail Ringkasan Target" width={676} onClose={onClose}>
      {RINGKASAN_SO.map((s, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-[var(--color-line)] p-4">
          <div className="flex items-center gap-3">
            <Avatar />
            <span className="text-[16px] font-medium text-[var(--color-ink)]">{s.name}</span>
          </div>
          <Stats className={INNER} items={[
            { label: "Leads Diperoleh", value: String(s.leads) },
            { label: "Booking Diperoleh", value: String(s.booking) },
            { label: "Transaksi Diperoleh", value: rupiah(s.nominal) },
          ]} />
        </div>
      ))}
    </Shell>
  );
}

const fmt = (m: Metric, money?: boolean) => (money ? rupiah(m.actual) : String(m.actual));
const tgt = (m: Metric, money?: boolean) => (money ? rupiah(m.target) : String(m.target));

export function DetailModal({ dateKey, label, onClose }: { dateKey: string; label: string; onClose: () => void }) {
  const list = useMemo(() => detailFor(dateKey), [dateKey]);
  const sum = sumDetail(list);
  if (dateKey === "2026-11-4") sum.nominal.actual = 10_000_000; // angka ringkasan sesuai desain
  return (
    <Shell
      title={`Detail Target - ${label}`}
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum."
      onClose={onClose}
    >
      <Stats className={SUMMARY} items={[
        { label: "Total Leads Diperoleh", value: fmt(sum.leads), sub: "Total Target:", subValue: tgt(sum.leads) },
        { label: "Total Booking Diperoleh", value: fmt(sum.booking), sub: "Total Target:", subValue: tgt(sum.booking) },
        { label: "Total Transaksi Diperoleh", value: fmt(sum.nominal, true), sub: "Total Target:", subValue: tgt(sum.nominal, true) },
      ]} />
      <h3 className="m-0 text-[18px] leading-7 font-semibold text-[var(--color-ink)]">Daftar Sales Officer</h3>
      {list.map((s, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-[var(--color-line)] p-4">
          <div className="flex items-center gap-3">
            <Avatar />
            <span className="text-[16px] font-medium text-[var(--color-ink)]">{s.name}</span>
          </div>
          <Stats className={INNER} items={[
            { label: "Leads Diperoleh", value: fmt(s.leads), sub: "Target:", subValue: tgt(s.leads) },
            { label: "Booking Diperoleh", value: fmt(s.booking), sub: "Target:", subValue: tgt(s.booking) },
            { label: "Transaksi Diperoleh", value: fmt(s.nominal, true), sub: "Target:", subValue: tgt(s.nominal, true) },
          ]} />
        </div>
      ))}
    </Shell>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition-colors ${on ? "bg-[var(--brand)]" : "bg-[#d1d5db]"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Field({
  label, value, disabled, prefix, onChange,
}: { label: string; value: number; disabled: boolean; prefix?: string; onChange: (n: number) => void }) {
  const shown = prefix ? `${prefix} ${value.toLocaleString("id-ID")}` : String(value);
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[14px] leading-5 font-medium text-[var(--color-ink)]">{label}</span>
      <input
        inputMode="numeric" disabled={disabled} value={shown}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
        className={`h-11 w-full min-w-0 rounded-lg border px-3 text-[16px] outline-none ${disabled ? "cursor-not-allowed border-[var(--color-line)] bg-[#f3f4f6] text-[var(--color-muted)]" : "border-[var(--color-line)] bg-white text-[var(--color-ink)] focus:border-[var(--brand)]"}`}
      />
    </label>
  );
}

export function EditModal({
  label, initial, onSave, onClose,
}: { label: string; initial: SoPlan[]; onSave: (p: SoPlan[]) => void; onClose: () => void }) {
  const [plan, setPlan] = useState<SoPlan[]>(initial);
  const dirty = JSON.stringify(plan) !== JSON.stringify(initial);
  const t = planTotals(plan);
  const patch = (id: string, p: Partial<SoPlan>) => setPlan((cur) => cur.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Shell
      title={`Detail Target - ${label}`}
      subtitle="Atur target leads, booking, dan transaksi untuk setiap sales"
      onClose={onClose}
      footer={
        <button
          disabled={!dirty} onClick={() => onSave(plan)}
          className="h-11 w-[190px] shrink-0 cursor-pointer rounded-lg border-0 bg-[var(--brand)] text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:bg-[var(--brand-disabled)]"
        >
          Simpan
        </button>
      }
    >
      <Stats className={SUMMARY} items={[
        { label: "Total Target Leads", value: String(t.leads) },
        { label: "Total Target Booking", value: String(t.booking) },
        { label: "Total Target Transaksi", value: rupiah(t.nominal) },
      ]} />
      <h3 className="m-0 text-[18px] leading-7 font-semibold text-[var(--color-ink)]">Daftar Sales Officer</h3>
      {plan.map((p) => {
        const so = SO_LIST.find((s) => s.id === p.id)!;
        return (
          <div key={p.id} className="overflow-hidden rounded-xl border border-[var(--color-line)]">
            <div className="flex items-center gap-3 border-b border-[var(--color-line)] p-4">
              <Avatar />
              <span className="flex-1 text-[16px] font-medium text-[var(--color-ink)]">{so.name}</span>
              <Toggle on={p.on} onChange={(v) => patch(p.id, { on: v })} />
            </div>
            <div className="flex gap-3 p-4">
              <Field label="Target leads" value={p.leads} disabled={!p.on} onChange={(n) => patch(p.id, { leads: n })} />
              <Field label="Target Booking" value={p.booking} disabled={!p.on} onChange={(n) => patch(p.id, { booking: n })} />
              <Field label="Target Nominal Transaksi" prefix="Rp" value={p.nominal} disabled={!p.on} onChange={(n) => patch(p.id, { nominal: n })} />
            </div>
          </div>
        );
      })}
    </Shell>
  );
}
