import { useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  RINGKASAN_SO, SO_LIST, detailFor, planTotals, rupiah, sumDetail,
  type Metric, type SoPlan,
} from "./data";

function Shell({
  title, subtitle, width = 820, onClose, children, footer,
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
        className="flex max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-12px_rgba(16,24,40,0.25)]"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h2 className="m-0 text-[20px] leading-7 font-semibold text-[#1f2937]">{title}</h2>
            {subtitle && <p className="m-0 mt-1 text-[14px] leading-5 text-[#6b7280]">{subtitle}</p>}
          </div>
          <button aria-label="Tutup" onClick={onClose} className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#6b7280] hover:bg-[#f3f4f6]">
            <X size={20} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6">{children}</div>
        {footer && <div className="border-t border-[#e5e7eb] bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f0f5fe] text-[16px] font-semibold text-[#2852a3]">
      {name.charAt(0)}
    </span>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="text-[13px] leading-5 text-[#6b7280]">{label}</div>
      <div className="mt-1 text-[18px] leading-7 font-semibold text-[#1f2937]">{value}</div>
      {sub && <div className="mt-0.5 text-[12px] leading-4 text-[#6b7280]">{sub}</div>}
    </div>
  );
}

const STAT_ROW = "flex divide-x divide-[#e5e7eb] [&>div]:px-4 [&>div:first-child]:pl-0 [&>div:last-child]:pr-0";

export function RingkasanModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell title="Detail Ringkasan Target" width={676} onClose={onClose}>
      {RINGKASAN_SO.map((s, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-[#e5e7eb] p-4">
          <div className="flex items-center gap-3">
            <Avatar name={s.name} />
            <span className="text-[16px] font-semibold text-[#1f2937]">{s.name}</span>
          </div>
          <div className={`${STAT_ROW} rounded-lg border border-[#e5e7eb] p-3`}>
            <Stat label="Leads Diperoleh" value={String(s.leads)} />
            <Stat label="Booking Diperoleh" value={String(s.booking)} />
            <Stat label="Transaksi Diperoleh" value={rupiah(s.nominal)} />
          </div>
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
      <div className={`${STAT_ROW} rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4`}>
        <Stat label="Leads Diperoleh" value={fmt(sum.leads)} sub={`Total Target ${tgt(sum.leads)}`} />
        <Stat label="Booking Diperoleh" value={fmt(sum.booking)} sub={`Total Target ${tgt(sum.booking)}`} />
        <Stat label="Transaksi Diperoleh" value={fmt(sum.nominal, true)} sub={`Total Target ${tgt(sum.nominal, true)}`} />
      </div>
      <h3 className="m-0 mt-2 text-[16px] font-semibold text-[#1f2937]">Daftar Sales Officer</h3>
      {list.map((s, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-[#e5e7eb] p-4">
          <div className="flex items-center gap-3">
            <Avatar name={s.name} />
            <span className="text-[16px] font-semibold text-[#1f2937]">{s.name}</span>
          </div>
          <div className={`${STAT_ROW} rounded-lg border border-[#e5e7eb] p-3`}>
            <Stat label="Leads Diperoleh" value={fmt(s.leads)} sub={`Target: ${tgt(s.leads)}`} />
            <Stat label="Booking Diperoleh" value={fmt(s.booking)} sub={`Target: ${tgt(s.booking)}`} />
            <Stat label="Transaksi Diperoleh" value={fmt(s.nominal, true)} sub={`Target: ${tgt(s.nominal, true)}`} />
          </div>
        </div>
      ))}
    </Shell>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition-colors ${on ? "bg-[#2852a3]" : "bg-[#d1d5db]"}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Field({
  label, value, disabled, prefix, onChange,
}: { label: string; value: number; disabled: boolean; prefix?: string; onChange: (n: number) => void }) {
  const shown = prefix ? (value ? value.toLocaleString("id-ID") : "0") : String(value);
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-[13px] leading-5 font-medium text-[#374151]">{label}</span>
      <span className={`flex h-11 items-center gap-2 rounded-lg border px-3 ${disabled ? "border-[#e5e7eb] bg-[#f3f4f6] text-[#9ca3af]" : "border-[#d1d5db] bg-white text-[#1f2937] focus-within:border-[#2852a3]"}`}>
        {prefix && <span className="text-[14px] text-[#6b7280]">{prefix}</span>}
        <input
          inputMode="numeric" disabled={disabled} value={shown}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="w-full min-w-0 border-0 bg-transparent p-0 text-[14px] outline-none disabled:cursor-not-allowed"
        />
      </span>
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
          className="h-11 w-full cursor-pointer rounded-lg border-0 bg-[#2852a3] text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#a9bde3]"
        >
          Simpan
        </button>
      }
    >
      <div className={`${STAT_ROW} rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4`}>
        <Stat label="Total Target Leads" value={String(t.leads)} />
        <Stat label="Total Target Booking" value={String(t.booking)} />
        <Stat label="Total Target Transaksi" value={rupiah(t.nominal)} />
      </div>
      {plan.map((p) => {
        const so = SO_LIST.find((s) => s.id === p.id)!;
        return (
          <div key={p.id} className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] p-4">
            <div className="flex items-center gap-3">
              <Avatar name={so.name} />
              <span className="flex-1 text-[16px] font-semibold text-[#1f2937]">{so.name}</span>
              <Toggle on={p.on} onChange={(v) => patch(p.id, { on: v })} />
            </div>
            <div className="flex gap-3">
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
