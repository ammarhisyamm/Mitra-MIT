import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  ChevronRight,
  Fingerprint,
  LockKeyhole,
  LogOut,
  ScanFace,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  BrandLockup,
  InlineAlert,
  MitraMark,
  PinDemoHint,
  PinInput,
  PrimaryButton,
  StepHeader,
} from "@/components/primitives";
import { DEMO, UNITS, getUnit, type BusinessUnit, type Mode, type UnitDefinition } from "@/lib/demo";

function UnitGlyph({ unit, size = 44 }: { unit: UnitDefinition; size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-[13px] text-[12px] font-extrabold tracking-wide"
      style={{
        width: size,
        height: size,
        background: unit.soft,
        color: unit.ink,
        border: `1px solid ${unit.color}26`,
      }}
      aria-hidden="true"
    >
      {unit.short}
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
    <div className="min-h-full bg-[#f7f8fb] pb-8">
      <div className="relative overflow-hidden rounded-b-[32px] bg-[linear-gradient(150deg,#2f5fb8_0%,#2852a3_45%,#1b3a78_100%)] px-5 pb-12 pt-14 text-white">
        <div className="pointer-events-none absolute -right-20 -top-10 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 top-24 h-28 w-28 rounded-full border border-white/10" />
        <div className="relative flex items-center justify-between">
          <BrandLockup onDark compact />
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80">
            {DEMO.firstName}
          </span>
        </div>
        <h1 className="relative mt-8 text-[25px] font-extrabold leading-tight tracking-[-0.02em]">
          Verifikasi identitas
        </h1>
        <p className="relative mt-2 max-w-[285px] text-[12.5px] leading-relaxed text-white/70">
          {resumed
            ? "Sesi 30 hari Anda masih aktif di perangkat ini. Pilih cara verifikasi untuk melanjutkan."
            : "Akun Anda dilindungi wajah dan PIN. Pilih salah satu cara untuk melanjutkan."}
        </p>
        {resumed ? (
          <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/85">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Sesi aman aktif
          </span>
        ) : null}
      </div>

      <div className="relative z-10 -mt-6 px-4">
        <button
          type="button"
          onClick={onFace}
          className="group w-full rounded-[22px] border border-[#dfe8f7] bg-white p-4 text-left shadow-[0_16px_44px_-26px_rgba(18,43,92,0.4)] transition active:scale-[0.995]"
        >
          <div className="flex items-center gap-3.5">
            <span className="relative grid h-14 w-14 flex-none place-items-center rounded-[17px] bg-[linear-gradient(150deg,#2f5fb8,#1c3d7f)] text-white">
              <ScanFace className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f9a11f] text-white ring-2 ring-white">
                <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden="true" />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13.5px] font-bold text-[#101a2e]">Verifikasi wajah</p>
                <span className="rounded-full bg-[#eaf1ff] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1c3d7f]">
                  Cepat
                </span>
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#7c8ba3]">
                Cocokkan wajah dengan foto terdaftar.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 flex-none text-[#b0bccd]" aria-hidden="true" />
          </div>
        </button>

        <button
          type="button"
          onClick={onPin}
          className="mt-2.5 flex w-full items-center gap-3.5 rounded-[18px] border border-[#e8ecf3] bg-white p-4 text-left transition active:scale-[0.995]"
        >
          <span className="grid h-11 w-11 flex-none place-items-center rounded-[13px] bg-[#f2f5fa] text-[#5b6b85]">
            <LockKeyhole className="h-[19px] w-[19px]" strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#101a2e]">Gunakan PIN</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#7c8ba3]">
              Masukkan 6 angka PIN akun Anda.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 flex-none text-[#b0bccd]" aria-hidden="true" />
        </button>

        <div className="mt-5 flex items-start gap-2.5 rounded-[13px] bg-white px-3.5 py-3">
          <Fingerprint className="mt-0.5 h-4 w-4 flex-none text-[#2852a3]" aria-hidden="true" />
          <p className="text-[11px] leading-relaxed text-[#7c8ba3]">
            Verifikasi hanya diperlukan sekali per perangkat dalam 30 hari.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="ghost-button mx-auto mt-3 flex text-[11.5px] text-[#7c8ba3]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Bukan Anda? Keluar
        </button>
      </div>
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
    <div className="min-h-full bg-[#f7f8fb] px-5 pb-8 pt-12">
      <StepHeader step={1} total={2} title="Verifikasi PIN" onBack={onBack} />
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#667085]">
        Masukkan 6 angka PIN untuk melanjutkan ke akun Anda.
      </p>
      <div className="mt-8">
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
      {error ? <InlineAlert className="mt-4">{error}</InlineAlert> : null}
      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={verify}
        disabled={pin.length < 6}
        loading={loading}
        loadingLabel="Memverifikasi PIN…"
      >
        Verifikasi PIN
      </PrimaryButton>
      <button type="button" onClick={onUseFace} className="secondary-button mt-2.5 w-full">
        <ScanFace className="h-4 w-4" aria-hidden="true" />
        Gunakan verifikasi wajah
      </button>
      <button
        type="button"
        onClick={onForgotPin}
        className="ghost-button mx-auto mt-3 flex text-[11.5px]"
      >
        Lupa PIN? Masuk dengan kata sandi
      </button>
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
    <div className="min-h-full bg-[#f7f8fb] px-5 pb-8 pt-14">
      <div className="flex justify-center">
        <BrandLockup compact />
      </div>
      <div className="mt-9 text-center">
        <div className="success-ring mx-auto">
          <svg width="44" height="44" viewBox="0 0 42 42" fill="none" aria-hidden="true">
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
          {returning ? `Selamat datang kembali, ${DEMO.firstName}` : "Akun Anda siap"}
        </h1>
        <p className="mx-auto mt-2 max-w-[285px] text-[12.5px] leading-relaxed text-[#667085]">
          {returning
            ? "Identitas Anda terverifikasi. Sesi aman aktif di perangkat ini."
            : "Wajah dan PIN sudah terdaftar. Mulai sekarang, masuk ke MITRA lebih cepat."}
        </p>
      </div>

      <div className="mt-7 overflow-hidden rounded-[18px] border border-[#e8ecf3] bg-white">
        <div className="flex items-center gap-3 border-b border-[#eef1f6] px-4 py-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf1ff] text-[#1c3d7f] text-[12px] font-bold">
            {DEMO.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-[#101a2e]">{DEMO.name}</p>
            <p className="truncate text-[11px] text-[#7c8ba3]">
              {DEMO.role} · NIP {DEMO.nip}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-[#eef1f6]">
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
              Metode masuk
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#344054]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0e9f6e]" aria-hidden="true" />
              Wajah + PIN
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
              Unit kerja
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#344054]">
              <span
                className="h-2 w-2 rounded-[2px]"
                style={{ background: unit.color }}
                aria-hidden="true"
              />
              {unit.short}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-[13px] border border-[#e2eaf8] bg-[#f5f8fe] px-3.5 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 flex-none text-[#2852a3]" aria-hidden="true" />
        <p className="text-[11.5px] leading-relaxed text-[#3d5278]">
          {returning
            ? "Anda tidak perlu memverifikasi ulang di perangkat ini selama 30 hari."
            : "Lain kali, cukup verifikasi wajah atau masukkan PIN. Kata sandi tetap bisa dipakai."}
        </p>
      </div>

      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={onContinue}
        icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
      >
        {returning ? "Lanjut ke beranda" : "Lanjut ke unit kerja"}
      </PrimaryButton>
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
    <div className="min-h-full bg-[#f7f8fb] px-5 pb-8 pt-12">
      <StepHeader
        step={3}
        total={3}
        title={returning ? "Unit kerja Anda" : "Periksa unit kerja"}
      />
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#667085]">
        Akses Anda terhubung ke satu unit. Unit menentukan tampilan dan data yang bisa Anda
        akses.
      </p>

      <div
        className="mt-6 rounded-[22px] p-4"
        style={{ background: selected.soft, border: `1px solid ${selected.color}26` }}
      >
        <div className="flex items-center gap-3">
          <UnitGlyph unit={selected} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-extrabold" style={{ color: selected.ink }}>
                {selected.name}
              </p>
              <span
                className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{ color: selected.ink }}
              >
                Terdeteksi
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] text-[#5b6b85]">{selected.description}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8ba3]">
        Ganti unit
      </p>
      <div className="mt-2 space-y-2">
        {UNITS.filter((item) => item.id !== unit).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="unit-card"
          >
            <UnitGlyph unit={item} />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-bold text-[#101a2e]">{item.name}</p>
              <p className="mt-0.5 text-[11px] text-[#7c8ba3]">{item.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 flex-none text-[#b0bccd]" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-[13px] bg-white px-3.5 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#2852a3]" aria-hidden="true" />
        <p className="text-[11px] leading-relaxed text-[#7c8ba3]">
          Unit yang salah?{" "}
          <button type="button" onClick={onHelp} className="font-semibold text-[#2852a3]">
            Hubungi admin unit
          </button>
          .
        </p>
      </div>

      <PrimaryButton
        type="button"
        className="mt-6"
        onClick={onContinue}
        icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
      >
        Masuk ke {selected.short}
      </PrimaryButton>
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
  return (
    <div className="min-h-full bg-[#f7f8fb] pb-8">
      <div
        className="relative overflow-hidden rounded-b-[30px] px-5 pb-10 pt-14 text-white"
        style={{
          background: `linear-gradient(150deg, ${selected.color} 0%, ${selected.ink} 100%)`,
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-10 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-6 top-28 h-24 w-24 rounded-full border border-white/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-white text-[10px] font-extrabold" style={{ color: selected.ink }}>
              {selected.short}
            </span>
            <div>
              <p className="text-[12px] font-bold leading-tight">{selected.name}</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/55">
                MITRA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-white/12 text-white"
              aria-label="Notifikasi"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f9a11f]" />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[11px] font-bold" style={{ color: selected.ink }}>
              RP
            </span>
          </div>
        </div>
        <p className="relative mt-7 text-[11.5px] font-medium text-white/65">
          {greeting()},
        </p>
        <h1 className="relative mt-0.5 text-[24px] font-extrabold tracking-[-0.02em]">
          {DEMO.firstName} Prameswari
        </h1>
        <p className="relative mt-1 text-[11.5px] text-white/60">
          {DEMO.role} · NIP {DEMO.nip}
        </p>
        <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold text-white/85">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Sesi aman · wajah & PIN aktif
        </div>
      </div>

      <div className="relative z-10 -mt-5 px-4">
        <div className="rounded-[20px] border border-[#e8ecf3] bg-white p-4 shadow-[0_16px_40px_-26px_rgba(18,43,92,0.35)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8ba3]">
              Ringkasan hari ini
            </p>
            <span className="text-[10px] font-medium text-[#98a2b3]">Data contoh</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: CalendarCheck, value: "3", label: "Kunjungan" },
              { icon: Users, value: "12", label: "Leads baru" },
              { icon: TrendingUp, value: "68%", label: "Target" },
            ].map((item) => (
              <div key={item.label} className="rounded-[13px] bg-[#f8fafc] px-2.5 py-3 text-center">
                <item.icon
                  className="mx-auto h-4 w-4"
                  style={{ color: selected.color }}
                  aria-hidden="true"
                />
                <p className="mt-1.5 text-[17px] font-extrabold leading-none text-[#101a2e]">
                  {item.value}
                </p>
                <p className="mt-1 text-[9.5px] font-medium text-[#7c8ba3]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8ba3]">
          Akses cepat
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { icon: Users, label: "Leads" },
            { icon: CalendarCheck, label: "Aktivitas" },
            { icon: Wallet, label: "Target" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="rounded-[15px] border border-[#e8ecf3] bg-white px-2 py-3.5 text-center transition active:scale-[0.98]"
            >
              <item.icon
                className="mx-auto h-[18px] w-[18px]"
                style={{ color: selected.ink }}
                aria-hidden="true"
              />
              <span className="mt-1.5 block text-[10.5px] font-semibold text-[#475467]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[16px] border border-[#e8ecf3] bg-white p-3.5">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-[12px] bg-[#f5f8fe] text-[#2852a3]">
            <LockKeyhole className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-[#344054]">Sesi perangkat ini</p>
            <p className="text-[10.5px] text-[#7c8ba3]">Berakhir 30 hari setelah login.</p>
          </div>
          <span className="rounded-full bg-[#ecfdf3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#067647]">
            Aktif
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#e8ecf3] bg-white py-3 text-[12px] font-semibold text-[#667085] transition hover:bg-[#fafbfe]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Keluar dan ulangi prototype
        </button>
      </div>
    </div>
  );
}

export function PrototypeFinishedNote() {
  return (
    <div className="flex items-center gap-2 px-4 pb-2 text-[10px] text-[#98a2b3]">
      <MitraMark size={14} />
      Alur first login selesai. Gunakan panel Prototype untuk mengulang skenario.
    </div>
  );
}
