import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  Check,
  ChevronRight,
  LockKeyhole,
  LogOut,
  ScanFace,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  BrandLockup,
  InlineAlert,
  PinDemoHint,
  PinInput,
  PrimaryButton,
  StepHeader,
} from "@/components/primitives";
import { DEMO, UNITS, getUnit, type BusinessUnit, type Mode, type UnitDefinition } from "@/lib/demo";

function PageFooter() {
  return (
    <p className="pt-8 text-center text-[13px] leading-5 text-[#6b7280]">
      V1. Mitra powered by MIT
    </p>
  );
}

function UnitGlyph({ unit, size = 40 }: { unit: UnitDefinition; size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full text-[11px] font-bold tracking-wide"
      style={{
        width: size,
        height: size,
        background: unit.soft,
        color: unit.ink,
      }}
      aria-hidden="true"
    >
      {unit.short}
    </span>
  );
}

function Initials({ size = 40 }: { size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full bg-[#f3f6fb] text-[12px] font-semibold text-[#2852a3]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {DEMO.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function VerifyChoiceScreen({
  mode,
  sessionActive,
  onFace,
  onPin,
  onLogout,
}: {
  mode: Mode;
  sessionActive: boolean;
  onFace: () => void;
  onPin: () => void;
  onLogout: () => void;
}) {
  const resumed = mode === "returning" && sessionActive;
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <div className="flex items-center gap-3">
        <Initials size={42} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium leading-5 text-[#151b2b]">
            {DEMO.name}
          </p>
          <p className="truncate text-[12px] leading-[18px] text-[#6b7280]">
            {DEMO.role} · NIP {DEMO.nip}
          </p>
        </div>
      </div>

      <h1 className="mt-8 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
        Verifikasi identitas
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        {resumed
          ? "Sesi 30 hari Anda masih aktif di perangkat ini. Pilih cara verifikasi untuk melanjutkan."
          : "Akun Anda dilindungi wajah dan PIN. Pilih salah satu cara untuk melanjutkan."}
      </p>

      <div className="mt-8 border-y border-[#e5e7eb]">
        <button
          type="button"
          onClick={onFace}
          className="flex w-full items-center gap-3 border-b border-[#e5e7eb] py-4 text-left"
        >
          <ScanFace className="h-5 w-5 flex-none text-[#2852a3]" strokeWidth={1.7} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium leading-6 text-[#151b2b]">
              Verifikasi wajah
            </p>
            <p className="text-[12px] leading-[18px] text-[#6b7280]">
              Cocokkan wajah dengan foto terdaftar.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 flex-none text-[#9ca3af]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onPin}
          className="flex w-full items-center gap-3 py-4 text-left"
        >
          <LockKeyhole className="h-5 w-5 flex-none text-[#2852a3]" strokeWidth={1.7} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium leading-6 text-[#151b2b]">Gunakan PIN</p>
            <p className="text-[12px] leading-[18px] text-[#6b7280]">
              Masukkan 6 angka PIN akun Anda.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 flex-none text-[#9ca3af]" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[12px] leading-[18px] text-[#6b7280]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {resumed
          ? "Verifikasi hanya diperlukan sekali per perangkat dalam 30 hari."
          : "Verifikasi melindungi data dan aktivitas penjualan Anda."}
      </p>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 flex items-center gap-1.5 text-[13px] leading-5 text-[#6b7280]"
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        Bukan Anda? Keluar
      </button>

      <div className="flex-1" />
      <PageFooter />
    </div>
  );
}

export function VerifyPinScreen({
  onSuccess,
  onBack,
  onUseFace,
  onForgotPin,
}: {
  onSuccess: () => void;
  onBack: () => void;
  onUseFace: () => void;
  onForgotPin: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function verify() {
    if (pin.length < 6) {
      setError("Masukkan 6 angka PIN.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (pin !== DEMO.pin) {
        setPin("");
        setError("PIN tidak sesuai. Periksa kembali.");
        return;
      }
      onSuccess();
    }, 800);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-12">
      <StepHeader step={1} total={2} title="Verifikasi PIN" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Masukkan 6 angka PIN untuk melanjutkan ke akun Anda.
      </p>

      <div className="mt-9">
        <PinInput
          value={pin}
          onChange={(value) => {
            setPin(value);
            setError("");
          }}
          label="PIN"
          invalid={Boolean(error)}
          autoFocus
          onComplete={verify}
        />
        <PinDemoHint />
      </div>

      {error ? <InlineAlert className="mt-5">{error}</InlineAlert> : null}

      <PrimaryButton
        type="button"
        className="mt-8"
        onClick={verify}
        disabled={pin.length < 6}
        loading={loading}
        loadingLabel="Memverifikasi PIN…"
      >
        Verifikasi PIN
      </PrimaryButton>

      <button
        type="button"
        onClick={onUseFace}
        className="mx-auto mt-5 text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Gunakan verifikasi wajah
      </button>
      <button
        type="button"
        onClick={onForgotPin}
        className="mx-auto mt-3 text-[13px] leading-5 text-[#6b7280] underline underline-offset-2"
      >
        Lupa PIN? Masuk dengan kata sandi
      </button>

      <div className="flex-1" />
      <PageFooter />
    </div>
  );
}

export function SuccessScreen({
  returning,
  unit,
  onContinue,
}: {
  returning: boolean;
  unit: UnitDefinition;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-16">
      <div className="flex flex-1 flex-col items-center pb-6 text-center">
        <BrandLockup compact />
        <span className="mt-9 grid h-16 w-16 place-items-center rounded-full bg-[#eaf7f0] text-[#24663f]">
          <Check className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
          {returning ? `Selamat datang kembali, ${DEMO.firstName}` : "Akun Anda siap"}
        </h1>
        <p className="mx-auto mt-2 max-w-[290px] text-[14px] leading-6 text-[#6b7280]">
          {returning
            ? "Identitas Anda terverifikasi. Sesi aman aktif di perangkat ini."
            : "Wajah dan PIN sudah terdaftar. Mulai sekarang, masuk ke MITRA lebih cepat."}
        </p>

        <div className="mt-7 w-full border-y border-[#e5e7eb] py-4 text-left">
          <div className="flex items-center gap-3">
            <Initials />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium leading-5 text-[#151b2b]">
                {DEMO.name}
              </p>
              <p className="truncate text-[12px] leading-[18px] text-[#6b7280]">
                {DEMO.role} · NIP {DEMO.nip}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[12px] leading-[18px]">
            <span className="text-[#6b7280]">Metode masuk</span>
            <span className="font-medium text-[#151b2b]">Wajah + PIN</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] leading-[18px]">
            <span className="text-[#6b7280]">Unit kerja</span>
            <span className="flex items-center gap-1.5 font-medium text-[#151b2b]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: unit.color }}
                aria-hidden="true"
              />
              {unit.short}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[12px] leading-[18px] text-[#6b7280]">
          {returning
            ? "Anda tidak perlu memverifikasi ulang di perangkat ini selama 30 hari."
            : "Lain kali, cukup verifikasi wajah atau masukkan PIN."}
        </p>

        <PrimaryButton type="button" className="mt-6" onClick={onContinue}>
          {returning ? "Lanjut ke beranda" : "Lanjut ke unit kerja"}
        </PrimaryButton>
      </div>
      <PageFooter />
    </div>
  );
}

export function UnitScreen({
  unit,
  returning,
  onSelect,
  onContinue,
  onHelp,
}: {
  unit: BusinessUnit;
  returning: boolean;
  onSelect: (unit: BusinessUnit) => void;
  onContinue: () => void;
  onHelp: () => void;
}) {
  const selected = getUnit(unit);
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-12">
      <StepHeader
        step={3}
        total={3}
        title={returning ? "Unit kerja Anda" : "Periksa unit kerja"}
      />
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
        Akses Anda terhubung ke satu unit. Unit menentukan tampilan dan data yang bisa Anda
        akses.
      </p>

      <div className="mt-7 flex items-center gap-3 border-y border-[#e5e7eb] py-4">
        <UnitGlyph unit={selected} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-medium leading-6 text-[#151b2b]">
              {selected.name}
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
              style={{ background: selected.soft, color: selected.ink }}
            >
              Terdeteksi
            </span>
          </div>
          <p className="text-[12px] leading-[18px] text-[#6b7280]">{selected.description}</p>
        </div>
      </div>

      <p className="mt-6 text-[12px] leading-[18px] text-[#6b7280]">Ganti unit</p>
      <div className="mt-2 border-b border-[#e5e7eb]">
        {UNITS.filter((item) => item.id !== unit).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="flex w-full items-center gap-3 border-t border-[#e5e7eb] py-4 text-left first:border-t-0"
          >
            <UnitGlyph unit={item} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium leading-5 text-[#151b2b]">{item.name}</p>
              <p className="mt-0.5 text-[12px] leading-[18px] text-[#6b7280]">
                {item.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 flex-none text-[#9ca3af]" aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className="mt-4 text-[12px] leading-[18px] text-[#6b7280]">
        Unit yang salah?{" "}
        <button
          type="button"
          onClick={onHelp}
          className="text-[#151b2b] underline underline-offset-2"
        >
          Hubungi admin unit
        </button>
        .
      </p>

      <PrimaryButton type="button" className="mt-7" onClick={onContinue}>
        Masuk ke {selected.short}
      </PrimaryButton>
      <div className="flex-1" />
      <PageFooter />
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

export function UnitHomeScreen({
  unit,
  onLogout,
}: {
  unit: BusinessUnit;
  onLogout: () => void;
}) {
  const selected = getUnit(unit);
  const stats = [
    { icon: CalendarCheck, value: "3", label: "Kunjungan" },
    { icon: Users, value: "12", label: "Leads baru" },
    { icon: TrendingUp, value: "68%", label: "Target" },
  ];
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UnitGlyph unit={selected} size={38} />
          <div>
            <p className="text-[13px] font-semibold leading-5 text-[#151b2b]">
              {selected.short} MITRA
            </p>
            <p className="text-[11px] leading-4 text-[#6b7280]">Beranda unit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-full text-[#151b2b] transition hover:bg-[#f3f4f6]"
            aria-label="Notifikasi"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f9a11f]" />
          </button>
          <Initials size={36} />
        </div>
      </div>

      <p className="mt-9 text-[13px] leading-5 text-[#6b7280]">{greeting()},</p>
      <h1 className="mt-0.5 text-[24px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
        {DEMO.name}
      </h1>
      <p className="mt-1 text-[12px] leading-[18px] text-[#6b7280]">
        {DEMO.role} · NIP {DEMO.nip}
      </p>

      <div className="mt-7 grid grid-cols-3 border-y border-[#e5e7eb] py-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={index > 0 ? "border-l border-[#e5e7eb] text-center" : "text-center"}
          >
            <item.icon className="mx-auto h-4 w-4 text-[#6b7280]" aria-hidden="true" />
            <p className="mt-1.5 text-[18px] font-semibold leading-6 text-[#151b2b]">
              {item.value}
            </p>
            <p className="text-[11px] leading-4 text-[#6b7280]">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-4 text-[#9ca3af]">Data contoh</p>

      <p className="mt-7 text-[12px] leading-[18px] text-[#6b7280]">Akses cepat</p>
      <div className="mt-2 border-b border-[#e5e7eb]">
        {[
          { icon: Users, label: "Leads" },
          { icon: CalendarCheck, label: "Aktivitas" },
          { icon: TrendingUp, label: "Target" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 border-t border-[#e5e7eb] py-4 text-left first:border-t-0"
          >
            <item.icon className="h-[18px] w-[18px] text-[#151b2b]" aria-hidden="true" />
            <span className="flex-1 text-[14px] leading-5 text-[#151b2b]">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-[#9ca3af]" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[12px] leading-[18px] text-[#6b7280]">
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          Sesi aktif · berakhir 30 hari setelah login
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#24663f]">
          Aktif
        </span>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-7 flex items-center gap-1.5 text-[13px] leading-5 text-[#6b7280]"
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        Keluar dan ulangi prototype
      </button>

      <div className="flex-1" />
      <PageFooter />
    </div>
  );
}
