/** Dummy account for the prototype. Any other combination fails. */
export const DEMO_ACCOUNT = {
  name: "Rani Prameswari",
  nik: "240812",
  phone: "081288429901",
  password: "Mitra@2026",
  otp: "123456",
};

export type Screen =
  | "checking"
  | "login"
  | "forgot"
  | "forgot-otp"
  | "forgot-reset"
  | "change-password"
  | "home"
  | "activity"
  | "activity-create"
  | "activity-map"
  | "activity-camera"
  | "activity-detail"
  | "lead-add"
  | "lead-verify"
  | "lead-simulation";

export function screenLabel(screen: Screen) {
  const labels: Record<Screen, string> = {
    checking: "Memuat",
    login: "Masuk",
    forgot: "Atur Ulang Kata Sandi",
    "forgot-otp": "Kode Verifikasi",
    "forgot-reset": "Buat Kata Sandi Baru",
    "change-password": "Ubah Kata Sandi",
    home: "Beranda",
    activity: "Aktivitas",
    "activity-create": "Buat Aktivitas",
    "activity-map": "Pilih Lokasi di Peta",
    "activity-camera": "Foto Kegiatan",
    "activity-detail": "Detail Aktivitas",
    "lead-add": "Tambah Leads Baru",
    "lead-verify": "Verifikasi Nomor WhatsApp",
    "lead-simulation": "Simulasi Gadai",
  };
  return labels[screen];
}
