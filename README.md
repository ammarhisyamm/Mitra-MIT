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

Prototype tampil sebagai web app mobile selebar 393px (tanpa frame ponsel). Login demo: `081288429901` (atau NIK `240812`) dengan kata sandi `Mitra@2026`; kode OTP lupa kata sandi `123456`.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, dan lucide-react.

## Acuan desain

[MIT Design System](https://mit-ds-git-design-syst-bc82ea-ammarhisyam151-gmailcoms-projects.vercel.app/)
