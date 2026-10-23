# Mitra-MIT

Prototype alur first login dan operasional aktivitas MITRA: verifikasi wajah, pembuatan PIN, pemulihan kata sandi, routing unit kerja, serta aktivitas dari pembuatan sampai checkout.

## Menjalankan

```bash
bun install
bun run dev
```

Build produksi:

```bash
bun run build
bun run preview
```

## Data demo

- NIP: `240812`
- Nomor telepon: `0812-8842-9901`
- PIN: `731904`
- OTP: `123456`
- Kata sandi: `mitra2026`
- Unit: `GMN` (default), `SMA`, `GMS`
- Foto contoh verifikasi: Unsplash, hanya untuk ilustrasi prototype

Gunakan panel **Prototype** di sisi kanan pada desktop, atau tombol **Prototype** di kanan atas pada mobile untuk mengubah skenario, unit kerja, dan melompat antar layar.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, dan lucide-react.

## Acuan desain

[MIT Design System](https://mit-ds-git-design-syst-bc82ea-ammarhisyam151-gmailcoms-projects.vercel.app/)
