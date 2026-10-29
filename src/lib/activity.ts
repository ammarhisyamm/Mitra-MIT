export type ActivityArea = "inside" | "outside";
export type ActivityStatus = "upcoming" | "ongoing" | "ended";
export type LeadHeat = "warm" | "hot" | "cold";
export type CollateralType = "emas" | "elektronik";

export type Collateral = {
  id: string;
  type: CollateralType;
  item: string;
  karat?: number;
  weight?: number;
  category?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  prospect: boolean;
  heat: LeadHeat;
  simulation: Collateral[] | null;
};

export type Activity = {
  id: string;
  kind: string;
  area: ActivityArea;
  name: string;
  locationName: string;
  locationAddress: string;
  date: string;
  start: string;
  end: string;
  checkinTime: string | null;
  checkoutTime: string | null;
  leads: Lead[];
};

export type ActivityForm = {
  kind: string;
  area: ActivityArea | null;
  name: string;
  locationName: string;
  locationAddress: string;
  date: string;
  start: string;
  end: string;
};

export type Place = { name: string; address: string };

export const ACTIVITY_KINDS = [
  "Canvassing",
  "Kunjungan Mitra",
  "Sosialisasi",
  "Open Booth",
  "Event",
  "Lainnya",
];

export const FILTER_KINDS = ["Canvassing", "Kunjungan Mitra", "Open Booth", "Event", "Lainnya"];

export const PLACES: Place[] = [
  {
    name: "Balai Desa Kelurahan Pilumpanua",
    address: "Jalan Boulevard Raya, RT 13/RW 014, Klp Gading Timur, Kelapa Gading, Kota Jakarta Utara",
  },
  {
    name: "Koperasi Desa Smart Tower",
    address: "Jl Gading Ruko Kirana 3 Barat, Wajo, Sulawesi Selatan",
  },
  {
    name: "Perumahan Gading Kirana",
    address: "Jl. Gading Kirana Timur, Kelapa Gading Barat, Kota Jakarta Utara",
  },
  {
    name: "Pasar Pagi Kelapa Gading",
    address: "Jl. Boulevard Bar. Raya, Kelapa Gading Barat, Kota Jakarta Utara",
  },
];

export const CURRENT_PLACE: Place = {
  name: "Lokasi Saat Ini",
  address: "Jl. Boulevard Raya No. 8, Kelapa Gading Timur, Kota Jakarta Utara",
};

export const MAP_PLACE: Place = {
  name: "Titik Pilihan di Peta",
  address: "Jakarta Outer Ring Rd E, Cakung Barat, Kota Jakarta Timur",
};

export const GOLD_ITEMS = ["LM Antam", "LM Non Antam", "Gelang", "Kalung", "Cincin"];
export const GOLD_KARATS = [
  { value: 24, label: "24 Karat (99.9%)", purity: 0.999 },
  { value: 22, label: "22 Karat (91.6%)", purity: 0.916 },
  { value: 18, label: "18 Karat (75%)", purity: 0.75 },
  { value: 14, label: "14 Karat (58.3%)", purity: 0.583 },
];
export const ELECTRONIC_CATEGORIES = ["Handphone", "Laptop", "TV", "Kamera"];
export const ELECTRONIC_ITEMS: Record<string, { name: string; price: number }[]> = {
  Handphone: [
    { name: "Samsung S23 12/256 5G", price: 7_200_000 },
    { name: "Samsung S23 8/128 5G", price: 6_100_000 },
    { name: "Apple iPhone 14 Pro", price: 9_800_000 },
    { name: "Xiaomi 11 12/512", price: 3_900_000 },
  ],
  Laptop: [
    { name: "MacBook Air M2 8/256", price: 11_500_000 },
    { name: "ASUS Vivobook 14", price: 5_200_000 },
    { name: "Lenovo ThinkPad E14", price: 7_900_000 },
  ],
  TV: [
    { name: "Samsung Crystal UHD 50\"", price: 4_800_000 },
    { name: "LG NanoCell 55\"", price: 6_300_000 },
  ],
  Kamera: [
    { name: "Sony A6400 Body", price: 9_200_000 },
    { name: "Canon EOS M50 Mark II", price: 7_600_000 },
    { name: "Fujifilm X-T30 II", price: 10_400_000 },
  ],
};

export const MESSAGE_TEMPLATES = {
  simulated: [
    {
      id: "hasil",
      title: "Konfirmasi Hasil Simulasi",
      detail: "Menanyakan kesesuaian estimasi pinjaman dengan kebutuhan leads.",
    },
    {
      id: "konsultasi",
      title: "Konsultasi Pinjaman",
      detail: "Menawarkan bantuan dan informasi lebih lanjut terkait proses gadai.",
    },
    {
      id: "booking",
      title: "Follow-up Melanjutkan Booking",
      detail: "Mengajak leads melanjutkan ke proses booking.",
    },
  ],
  fresh: [
    {
      id: "ajakan",
      title: "Follow-up Ajakan Simulasi",
      detail: "Mengajak leads mencoba simulasi untuk mengetahui estimasi nilai pinjaman.",
    },
    {
      id: "layanan",
      title: "Penawaran Layanan",
      detail: "Memperkenalkan layanan gadai dan mengajak leads mencoba simulasi pinjaman.",
    },
    {
      id: "minat",
      title: "Konfirmasi Minat Leads",
      detail: "Menanyakan kembali minat leads untuk melanjutkan proses gadai.",
    },
  ],
};

const GOLD_PRICE_PER_GRAM = 1_350_000;

export function estimateCollateral(items: Collateral[]) {
  const total = items.reduce((sum, item) => {
    if (item.type === "emas") {
      const purity = GOLD_KARATS.find((karat) => karat.value === item.karat)?.purity ?? 0.75;
      const factor = item.item.startsWith("LM") ? 1 : 0.92;
      return sum + GOLD_PRICE_PER_GRAM * purity * (item.weight ?? 0) * factor;
    }
    const price =
      ELECTRONIC_ITEMS[item.category ?? ""]?.find((entry) => entry.name === item.item)?.price ??
      4_000_000;
    return sum + price * 0.6;
  }, 0);
  const high = Math.round((total * 0.95) / 50_000) * 50_000;
  const low = Math.round((total * 0.85) / 50_000) * 50_000;
  return { low, high };
}

export function rupiah(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

export function collateralDetail(item: Collateral) {
  if (item.type === "emas") return [`${item.karat} Karat`, `${item.weight} Gram`];
  return [item.category ?? "Elektronik"];
}

export function activityStatus(activity: Activity): ActivityStatus {
  if (activity.checkoutTime) return "ended";
  if (activity.checkinTime) return "ongoing";
  return "upcoming";
}

export function areaLabel(area: ActivityArea) {
  return area === "inside" ? "Dalam Area Unit" : "Luar Area Unit";
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `${digits.slice(0, 4)}****${digits.slice(-3)}`;
}

export function todayIso(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function displayDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function clockNow() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyForm(): ActivityForm {
  return {
    kind: "",
    area: null,
    name: "",
    locationName: "",
    locationAddress: "",
    date: "",
    start: "",
    end: "",
  };
}

export function initialActivities(): Activity[] {
  return [
    {
      id: "act-1",
      kind: "Canvassing",
      area: "inside",
      name: "Kunjungan Mitra Koperasi Desa",
      locationName: "Koperasi Desa Smart Tower",
      locationAddress: "Jl Gading Ruko Kirana 3 Barat, Wajo, Sulawesi Selatan",
      date: todayIso(),
      start: "09:00",
      end: "17:00",
      checkinTime: "09:35",
      checkoutTime: null,
      leads: [
        {
          id: "lead-1",
          name: "Siti Aisyah",
          phone: "081277629902",
          prospect: true,
          heat: "warm",
          simulation: null,
        },
        {
          id: "lead-2",
          name: "Yusuf Arif Nugroho",
          phone: "081233418902",
          prospect: true,
          heat: "warm",
          simulation: [
            { id: "c-1", type: "elektronik", item: "Apple iPhone 14 Pro", category: "Handphone" },
          ],
        },
        {
          id: "lead-3",
          name: "Melati Putri Handayani",
          phone: "081277626902",
          prospect: true,
          heat: "hot",
          simulation: [
            { id: "c-2", type: "emas", item: "Kalung", karat: 22, weight: 1 },
            { id: "c-3", type: "emas", item: "LM Antam", karat: 24, weight: 2 },
          ],
        },
        {
          id: "lead-4",
          name: "Rahmat Hidayat",
          phone: "081388120902",
          prospect: true,
          heat: "hot",
          simulation: null,
        },
        {
          id: "lead-5",
          name: "Muhammad Rizky Pratama",
          phone: "081355670902",
          prospect: false,
          heat: "cold",
          simulation: null,
        },
        {
          id: "lead-6",
          name: "Dewi Sartika",
          phone: "081299010902",
          prospect: false,
          heat: "cold",
          simulation: null,
        },
      ],
    },
    {
      id: "act-2",
      kind: "Market Sore/Malam",
      area: "outside",
      name: "Canvassing Perumahan Gading Kirana",
      locationName: "Balai Desa Kelurahan Pilumpanua",
      locationAddress: "Wajo, Sulawesi Selatan",
      date: todayIso(),
      start: "09:00",
      end: "17:00",
      checkinTime: null,
      checkoutTime: null,
      leads: [],
    },
    {
      id: "act-3",
      kind: "Market Sore/Malam",
      area: "outside",
      name: "Open Booth Pasar Pagi Kelapa Gading",
      locationName: "Pasar Pagi Kelapa Gading",
      locationAddress: "Kelapa Gading Barat, Jakarta Utara",
      date: todayIso(-1),
      start: "16:00",
      end: "20:00",
      checkinTime: "16:05",
      checkoutTime: "20:00",
      leads: [
        {
          id: "lead-7",
          name: "Bambang Wijaya",
          phone: "081390214477",
          prospect: true,
          heat: "warm",
          simulation: null,
        },
      ],
    },
  ];
}
