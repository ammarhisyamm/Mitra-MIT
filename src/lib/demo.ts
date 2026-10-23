export type Mode = "first" | "returning";
export type BusinessUnit = "sma" | "gmn" | "gms";
export type Scenario = "normal" | "default-password";

export type Screen =
  | "checking"
  | "login"
  | "verify-choice"
  | "verify-pin"
  | "face-intro"
  | "face-camera"
  | "face-processing"
  | "face-review"
  | "face-check"
  | "face-failed"
  | "pin-create"
  | "success"
  | "unit"
  | "home"
  | "forgot"
  | "forgot-otp"
  | "forgot-reset"
  | "forgot-done"
  | "force-change"
  | "activity"
  | "activity-type"
  | "activity-schedule"
  | "activity-created"
  | "activity-checkin"
  | "activity-leads"
  | "activity-checkout"
  | "activity-done";

export const DEMO = {
  name: "Rani Prameswari",
  firstName: "Rani",
  role: "Sales Officer",
  nip: "240812",
  phone: "0812-8842-9901",
  maskedPhone: "0812\u00A0••••\u00A09901",
  pin: "731904",
  otp: "123456",
  password: "mitra2026",
};

export type ActivityKind = "kunjungan" | "prospek" | "followup";
export type ActivityArea = "inside" | "outside";

export type ActivityDraft = {
  kind: ActivityKind;
  area: ActivityArea;
  name: string;
  location: string;
  time: string;
};

export type ActivityLead = {
  name: string;
  phone: string;
  note: string;
};

export const ACTIVITY_LEADS: ActivityLead[] = [
  { name: "Dewi Lestari", phone: "0812 7788 1020", note: "Tertarik gadai emas" },
  { name: "Bambang Wijaya", phone: "0813 9021 4477", note: "Minta simulasi pembiayaan" },
  { name: "Siti Rahmawati", phone: "0821 3344 8890", note: "Follow-up minggu depan" },
];

export function defaultActivityName(kind: ActivityKind) {
  if (kind === "prospek") return "Pencarian prospek baru";
  if (kind === "followup") return "Follow-up prospek";
  return "Kunjungan mitra binaan";
}

export function defaultActivityTime() {
  const date = new Date(Date.now() + 30 * 60 * 1000);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export type UnitDefinition = {
  id: BusinessUnit;
  short: string;
  name: string;
  description: string;
  color: string;
  soft: string;
  ink: string;
};

export const UNITS: UnitDefinition[] = [
  {
    id: "sma",
    short: "SMA",
    name: "Branding SMA",
    description: "Sales & marketing agent",
    color: "#2852a3",
    soft: "#edf3fd",
    ink: "#1c3d7f",
  },
  {
    id: "gmn",
    short: "GMN",
    name: "GMN",
    description: "Mitra penjualan gadai",
    color: "#0e9f6e",
    soft: "#e9f8f1",
    ink: "#086c4b",
  },
  {
    id: "gms",
    short: "GMS",
    name: "GMS",
    description: "Mitra penjualan syariah",
    color: "#1f8a70",
    soft: "#e8f6f2",
    ink: "#14614f",
  },
];

export function getUnit(id: BusinessUnit) {
  return UNITS.find((unit) => unit.id === id) ?? UNITS[1];
}

export const FACE_SCREENS: Screen[] = [
  "face-intro",
  "face-camera",
  "face-processing",
  "face-review",
  "face-check",
  "face-failed",
];

export const PIN_SCREENS: Screen[] = ["pin-create", "verify-pin"];

export const AUTH_SCREENS: Screen[] = [
  "login",
  "forgot",
  "forgot-otp",
  "forgot-reset",
  "forgot-done",
  "force-change",
  "checking",
];

export function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    checking: "Memeriksa sesi",
    login: "Masuk",
    "verify-choice": "Pilih verifikasi",
    "verify-pin": "Verifikasi PIN",
    "face-intro": "Pengantar wajah",
    "face-camera": "Ambil foto",
    "face-processing": "Menganalisis foto",
    "face-review": "Tinjau foto",
    "face-check": "Memverifikasi wajah",
    "face-failed": "Verifikasi gagal",
    "pin-create": "Buat PIN",
    success: "Akun siap",
    unit: "Unit kerja",
    home: "Beranda unit",
    forgot: "Lupa kata sandi",
    "forgot-otp": "Kode verifikasi",
    "forgot-reset": "Kata sandi baru",
    "forgot-done": "Kata sandi diperbarui",
    "force-change": "Ganti kata sandi default",
    activity: "Aktivitas",
    "activity-type": "Buat aktivitas",
    "activity-schedule": "Detail aktivitas",
    "activity-created": "Aktivitas dibuat",
    "activity-checkin": "Check-in aktivitas",
    "activity-leads": "Input leads",
    "activity-checkout": "Checkout",
    "activity-done": "Aktivitas selesai",
  };
  return labels[screen];
}
