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
  | "force-change";

export const DEMO = {
  name: "Rani Prameswari",
  firstName: "Rani",
  role: "Sales Officer",
  nip: "240812",
  email: "rani.prameswari@mitra.co.id",
  maskedEmail: "r•••@mitra.co.id",
  phone: "0812 •••• 8842",
  pin: "731904",
  otp: "123456",
  password: "mitra2026",
};

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
    "face-review": "Periksa foto",
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
  };
  return labels[screen];
}
