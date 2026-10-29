export type AccountId = "new" | "returning";

export type Account = {
  id: AccountId;
  label: string;
  name: string;
  nik: string;
  phone: string;
  password: string;
  /** null until the user sets up a PIN on first login. */
  pin: string | null;
  enrolled: boolean;
};

/** Dummy accounts for the prototype. Any other combination fails. */
export const DEMO_ACCOUNTS: Account[] = [
  {
    id: "new",
    label: "Akun baru · login pertama",
    name: "John Doe",
    nik: "240901",
    phone: "081200000001",
    password: "Mitra@2026",
    pin: null,
    enrolled: false,
  },
  {
    id: "returning",
    label: "Akun lama · sesi 30 hari berakhir",
    name: "Rani Prameswari",
    nik: "240812",
    phone: "081288429901",
    password: "Mitra@2026",
    pin: "123456",
    enrolled: true,
  },
];

export const DEMO_OTP = "123456";
export const SESSION_DAYS = 30;

export type BusinessUnit = "mit" | "gmn" | "gms";

/** Brand themes shown to the client. MIT is the default look. */
export const BUSINESS_UNITS: {
  id: BusinessUnit;
  short: string;
  name: string;
  tagline: string;
  color: string;
}[] = [
  {
    id: "mit",
    short: "MIT",
    name: "MIT",
    tagline: "Tema default (biru)",
    color: "#2852a3",
  },
  {
    id: "gmn",
    short: "GMN",
    name: "Gadai Mas Nusantara",
    tagline: "Tema biru muda",
    color: "#27a1d7",
  },
  {
    id: "gms",
    short: "GMS",
    name: "Gadai Mulia Sejahtera",
    tagline: "Tema kuning",
    color: "#f2b705",
  },
];

export type Screen =
  | "checking"
  | "login"
  | "forgot"
  | "forgot-otp"
  | "forgot-reset"
  | "change-password"
  | "verify-choice"
  | "verify-pin"
  | "face-intro"
  | "face-camera"
  | "face-scan"
  | "face-verifying"
  | "face-error"
  | "pin-create"
  | "welcome"
  | "home"
  | "activity"
  | "activity-create"
  | "activity-map"
  | "activity-camera"
  | "activity-detail"
  | "lead-add"
  | "lead-verify"
  | "lead-simulation"
  | "quick-simulation";

export function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    checking: "Memuat",
    login: "Masuk",
    forgot: "Atur Ulang Kata Sandi",
    "forgot-otp": "Kode Verifikasi",
    "forgot-reset": "Buat Kata Sandi Baru",
    "change-password": "Ubah Kata Sandi",
    "verify-choice": "Verifikasi Identitas",
    "verify-pin": "Masukkan PIN",
    "face-intro": "Verifikasi Wajah",
    "face-camera": "Ambil Foto Wajah",
    "face-scan": "Memindai Wajah",
    "face-verifying": "Memverifikasi Wajah",
    "face-error": "Verifikasi Wajah Gagal",
    "pin-create": "Buat PIN Baru",
    welcome: "Selamat Datang",
    home: "Beranda",
    activity: "Aktivitas",
    "activity-create": "Buat Aktivitas",
    "activity-map": "Pilih Lokasi di Peta",
    "activity-camera": "Foto Kegiatan",
    "activity-detail": "Detail Aktivitas",
    "lead-add": "Tambah Leads Baru",
    "lead-verify": "Verifikasi Nomor WhatsApp",
    "lead-simulation": "Simulasi Gadai",
    "quick-simulation": "Simulasi Gadai",
  };
  return labels[screen];
}
