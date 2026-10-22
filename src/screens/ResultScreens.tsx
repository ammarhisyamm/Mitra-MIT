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
  PinInput,
  PrimaryButton,
  StepHeader,
} from "@/components/primitives";
import { DEMO, getUnit, type BusinessUnit, type UnitDefinition } from "@/lib/demo";

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
      className="grid flex-none place-items-center rounded-full bg-[#f3f6fb] font-semibold text-[#2852a3]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
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
  onFace,
  onPin,
  onLogout,
}: {
  onFace: () => void;
  onPin: () => void;
  onLogout: () => void;
}) {
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
      <p className="mt-2 text-[14px] leading-6 text-[#667085]">
        Akun Anda dilindungi wajah dan PIN. Pilih salah satu cara untuk melanjutkan.
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
          <ChevronRight className="h-4 w-4 flex-none text-[#6b7280]" aria-hidden="true" />
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
          <ChevronRight className="h-4 w-4 flex-none text-[#6b7280]" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[12px] leading-[18px] text-[#667085]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
        Setelah verifikasi, perangkat ini dipercaya selama 30 hari.
      </p>

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-[13px] leading-5 text-[#667085]"
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
  const [focusRequest, setFocusRequest] = useState(0);

  function verify(code = pin) {
    if (code.length < 6) {
      setError("Masukkan 6 angka PIN.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (code !== DEMO.pin) {
        setPin("");
        setError("PIN tidak sesuai. Periksa kembali.");
        setFocusRequest((value) => value + 1);
        return;
      }
      onSuccess();
    }, 800);
  }

  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-12">
      <StepHeader title="Verifikasi PIN" onBack={onBack} />
      <p className="mt-2 text-[14px] leading-6 text-[#667085]">
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
          autoComplete="off"
          errorId="pin-error"
          focusRequest={focusRequest}
          onComplete={verify}
        />
      </div>

      {error ? (
        <InlineAlert id="pin-error" className="mt-5">
          {error}
        </InlineAlert>
      ) : null}

      <PrimaryButton
        type="button"
        className="mt-7"
        onClick={() => verify()}
        disabled={pin.length < 6}
        loading={loading}
        loadingLabel="Memverifikasi PIN…"
      >
        Verifikasi PIN
      </PrimaryButton>

      <button
        type="button"
        onClick={onUseFace}
        className="mx-auto mt-2 inline-flex min-h-11 items-center text-[13px] leading-5 text-[#151b2b] underline underline-offset-2"
      >
        Gunakan verifikasi wajah
      </button>
      <button
        type="button"
        onClick={onForgotPin}
        className="mx-auto inline-flex min-h-11 items-center text-[13px] leading-5 text-[#667085] underline underline-offset-2"
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
  method,
  onContinue,
}: {
  returning: boolean;
  unit: UnitDefinition;
  method: "face" | "pin" | "face-pin";
  onContinue: () => void;
}) {
  const methodLabel =
    method === "face-pin" ? "Wajah + PIN" : method === "pin" ? "PIN" : "Wajah";
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-14">
      <div className="flex flex-1 flex-col">
        <div className="flex justify-center">
          <BrandLockup compact />
        </div>

        <div className="mt-9 text-center">
          <div className="relative mx-auto w-fit">
            <Initials size={72} />
            <span className="absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full bg-[#24663f] text-white ring-[3px] ring-white">
              <Check className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
            </span>
          </div>
          <h1 className="mt-5 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
            {returning ? `Selamat datang kembali, ${DEMO.firstName}` : "Akun Anda siap"}
          </h1>
          <p className="mx-auto mt-2 max-w-[290px] text-[14px] leading-6 text-[#667085]">
            {returning
              ? "Identitas Anda terverifikasi. Sesi aman diperpanjang 30 hari di perangkat ini."
              : "Wajah dan PIN sudah terdaftar. Akses MITRA Anda siap dipakai."}
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[16px] border border-[#e5e7eb]">
          <div className="flex items-center gap-3 px-4 py-4" style={{ background: unit.soft }}>
            <UnitGlyph unit={unit} size={38} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold leading-5" style={{ color: unit.ink }}>
                {unit.name}
              </p>
              <p className="truncate text-[12px] leading-[18px]" style={{ color: unit.ink }}>
                {unit.short} · {unit.description}
              </p>
            </div>
          </div>
          <dl className="divide-y divide-[#e5e7eb] px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[12px] leading-[18px] text-[#667085]">NIP</dt>
              <dd className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
                {DEMO.nip}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[12px] leading-[18px] text-[#667085]">Metode masuk</dt>
              <dd className="text-[13px] font-medium leading-5 text-[#151b2b]">
                {methodLabel}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[12px] leading-[18px] text-[#667085]">Sesi perangkat</dt>
              <dd className="text-[13px] font-medium leading-5 text-[#24663f]">Aktif 30 hari</dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[12px] leading-[18px] text-[#667085]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
          {returning
            ? "Verifikasi ulang hanya diminta setelah sesi berakhir."
            : "Pengaturan PIN bisa diubah dari menu Keamanan setelah masuk."}
        </p>

        <div className="flex-1" />
        <PrimaryButton type="button" className="mt-7" onClick={onContinue}>
          {returning ? "Lanjut ke beranda" : `Mulai di ${unit.short}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

export function UnitScreen({
  unit,
  onContinue,
  onHelp,
}: {
  unit: BusinessUnit;
  onContinue: () => void;
  onHelp: () => void;
}) {
  const selected = getUnit(unit);
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-12">
      <StepHeader step={3} total={3} title="Unit kerja Anda" />
      <p className="mt-2 text-[14px] leading-6 text-[#667085]">
        Unit ini ditetapkan Admin Unit dan menentukan data yang bisa Anda akses.
      </p>

      <div className="mt-7 overflow-hidden rounded-[16px] border border-[#e5e7eb]">
        <div className="px-4 py-5" style={{ background: selected.soft }}>
          <div className="flex items-center gap-3">
            <UnitGlyph unit={selected} size={48} />
            <div className="min-w-0">
              <p
                className="text-[16px] font-semibold leading-6"
                style={{ color: selected.ink }}
              >
                {selected.name}
              </p>
              <p className="text-[12px] leading-[18px]" style={{ color: selected.ink }}>
                {selected.short} · {selected.description}
              </p>
            </div>
          </div>
        </div>
        <dl className="divide-y divide-[#e5e7eb] bg-white px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">Ditetapkan oleh</dt>
            <dd className="flex items-center gap-1.5 text-[13px] font-medium leading-5 text-[#151b2b]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#24663f]" aria-hidden="true" />
              Admin Unit
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">Akses data</dt>
            <dd className="text-[13px] font-medium leading-5 text-[#151b2b]">
              Leads, kunjungan, target
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] leading-[18px] text-[#667085]">NIP</dt>
            <dd className="tabular text-[13px] font-medium leading-5 text-[#151b2b]">
              {DEMO.nip}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 text-[12px] leading-[18px] text-[#667085]">
        Bukan unit Anda?{" "}
        <button
          type="button"
          onClick={onHelp}
          className="inline-flex min-h-11 items-center text-[12px] text-[#2852a3] underline underline-offset-2"
        >
          Ajukan perubahan
        </button>
      </p>

      <div className="flex-1" />
      <PrimaryButton type="button" className="mt-7" onClick={onContinue}>
        Lanjut
      </PrimaryButton>
      <p className="mt-3 text-center text-[12px] leading-[18px] text-[#667085]">
        Perubahan unit diproses oleh Admin Unit, bukan dari perangkat ini.
      </p>
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
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-8 pt-14">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UnitGlyph unit={selected} size={38} />
          <div>
            <p className="text-[13px] font-semibold leading-5 text-[#151b2b]">
              {selected.short} MITRA
            </p>
            <p className="text-[11px] leading-4 text-[#667085]">Beranda unit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full text-[#151b2b] transition hover:bg-[#f3f4f6]"
            aria-label="Notifikasi"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f9a11f]" />
          </button>
          <Initials size={36} />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <p className="text-[13px] leading-5 text-[#667085]">{greeting()},</p>
        <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-medium text-[#667085]">
          Data contoh
        </span>
      </div>
      <h1 className="mt-0.5 text-[24px] font-semibold leading-8 tracking-[-0.02em] text-[#151b2b]">
        {DEMO.name}
      </h1>
      <p className="mt-1 text-[12px] leading-[18px] text-[#667085]">
        {DEMO.role} · NIP {DEMO.nip}
      </p>

      <div className="mt-7 flex items-baseline justify-between">
        <p className="text-[13px] font-medium leading-5 text-[#151b2b]">Kunjungan berikutnya</p>
        <p className="text-[12px] leading-[18px] text-[#667085]">{today}</p>
      </div>

      <div className="mt-2 overflow-hidden rounded-[16px] border border-[#e5e7eb]">
        <div className="px-4 py-4" style={{ background: selected.soft }}>
          <div className="flex items-center justify-between">
            <span
              className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: selected.ink }}
            >
              Berikutnya
            </span>
            <span className="tabular text-[13px] font-semibold" style={{ color: selected.ink }}>
              10.30
            </span>
          </div>
          <p className="mt-2 text-[15px] font-semibold leading-5 text-[#151b2b]">
            Kunjungan mitra binaan
          </p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-[#151b2b]/70">
            Rute {selected.short} · 2,4 km dari lokasi Anda
          </p>
        </div>
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left"
        >
          <span className="text-[13px] font-medium text-[#2852a3]">Lihat detail kunjungan</span>
          <ChevronRight className="h-4 w-4 text-[#667085]" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-6 text-[12px] leading-[18px] text-[#667085]">Minggu ini</p>
      <div className="mt-2 grid grid-cols-3 border-y border-[#e5e7eb] py-4">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={index > 0 ? "border-l border-[#e5e7eb] text-center" : "text-center"}
          >
            <item.icon className="mx-auto h-4 w-4 text-[#667085]" aria-hidden="true" />
            <p className="tabular mt-1.5 text-[18px] font-semibold leading-6 text-[#151b2b]">
              {item.value}
            </p>
            <p className="text-[11px] leading-4 text-[#667085]">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-7 text-[12px] leading-[18px] text-[#667085]">Akses cepat</p>
      <div className="mt-2 border-b border-[#e5e7eb]">
        {[
          { icon: Users, label: "Leads", detail: "12 perlu ditindaklanjuti" },
          { icon: CalendarCheck, label: "Aktivitas", detail: "3 kunjungan hari ini" },
          { icon: TrendingUp, label: "Target", detail: "68% dari target bulan ini" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex min-h-12 w-full items-center gap-3 border-t border-[#e5e7eb] py-3 text-left first:border-t-0"
          >
            <item.icon className="h-[18px] w-[18px] flex-none text-[#151b2b]" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-5 text-[#151b2b]">{item.label}</span>
              <span className="block text-[11px] leading-4 text-[#667085]">{item.detail}</span>
            </span>
            <ChevronRight className="h-4 w-4 flex-none text-[#667085]" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[12px] leading-[18px] text-[#667085]">
          <LockKeyhole className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          Sesi aktif 30 hari di perangkat ini
        </span>
        <span className="flex-none text-[10px] font-semibold uppercase tracking-wide text-[#24663f]">
          Aktif
        </span>
      </div>

      <div className="flex-1" />
      <button
        type="button"
        onClick={onLogout}
        className="mt-7 inline-flex min-h-11 items-center gap-1.5 text-[13px] leading-5 text-[#667085]"
      >
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        Keluar dan ulangi prototype
      </button>
    </div>
  );
}
