@AGENTS.md

# nova_web — Frontend Guide

Konteks ini untuk pekerjaan **frontend (UI/UX)** di `nova_web`. Maintainer frontend: **Teguh** (branch kerja: `teguh`).

> ⚠️ Lihat `AGENTS.md` di atas: ini Next.js 16 dengan breaking changes. **Sebelum menulis kode, baca dulu guide relevan di `node_modules/next/dist/docs/`** (mis. `01-app/`). Jangan andalkan memori Next.js versi lama.

## Domain

Aplikasi pemesanan produk (gaya coffee-shop / retail). Entitas inti ada di `lib/models/` (Sequelize + MySQL):

- `User` ↔ `UserDetail` (1-1), `User` self-ref via `sponsor_id` (struktur sponsor/referral)
- `Product` ↔ `ProductMedia` (1-N), kolom: `sku_product`, `nama_product`, `jenis_product`, `harga`, `stok`, `main_image`
- `Order` ↔ `OrderItem` (1-N), `User` → `Order` (1-N), `Product` → `OrderItem` (1-N)

Frontend mengkonsumsi entitas ini (katalog produk, detail produk, keranjang, order). Penamaan kolom DB **bahasa Indonesia + `underscored`** (`nama_product`, `harga`).

## Stack

| Area | Teknologi |
|------|-----------|
| Framework | Next.js **16.2.9**, App Router, **Turbopack** |
| UI | React **19.2.4** |
| Styling | **Tailwind CSS v4** (config via CSS, bukan `tailwind.config.js`) |
| Bahasa | TypeScript (strict), alias `@/*` → root |
| Data | Sequelize 6 + `mysql2` (MySQL, db default `nova`) |

## Struktur frontend

```
app/
  layout.tsx     # root layout — font (Geist saat ini), <html>/<body>
  page.tsx       # landing (masih boilerplate create-next-app)
  globals.css    # @import "tailwindcss" + @theme inline (token desain)
lib/models/      # Sequelize models (domain) — JANGAN diutak-atik dari sisi UI
public/          # aset statis (svg/img)
docs/DESIGN.MD   # design system (WAJIB dibaca sebelum bikin UI)
```

Komponen baru: buat folder `app/components/` (atau colocate di route segment). Server Component secara default; tambahkan `"use client"` hanya bila perlu interaktivitas/hooks.

## Styling — Tailwind v4

- **Tidak ada `tailwind.config.js`.** Konfigurasi tema ada di `app/globals.css` lewat `@theme inline { ... }` dan CSS variables di `:root`.
- Token desain (warna, font, spacing) didefinisikan di `globals.css` lalu dipakai sebagai utility Tailwind. Tambah token baru di sana, bukan di file config terpisah.
- Saat ini `globals.css` masih default (putih/hitam + Geist). Ini **belum** mencerminkan design system target.

## Design System — baca `docs/DESIGN.MD`

Design system terinspirasi **Starbucks**: kanvas krem hangat + sistem hijau empat-tingkat, tombol full-pill, shadow berlapis lembut. Ringkas yang wajib dipatuhi:

- **Kanvas** krem hangat `#f2f0eb` / `#edebe9` — **bukan** putih murni.
- **Hijau 4-tier** sesuai peran: heading `#006241`, CTA `#00754A`, band/footer `#1E3932`, dekoratif `#2b5148`.
- **Gold `#cba258`** hanya untuk momen Rewards — bukan aksen umum.
- **Tombol** selalu pill `border-radius: 50px`, active `transform: scale(0.95)`, transition `0.2s ease`.
- **Card** putih, radius `12px`, shadow berlapis 2-3 low-alpha (jangan satu shadow tebal).
- **Teks** di permukaan terang pakai `rgba(0,0,0,0.87)`, bukan hitam murni.
- **Tracking ketat** `-0.01em` / `-0.16px` universal.
- **Tanpa gradient** — semua solid color-block.
- **Font**: SoDoSans proprietary → substitusi open-source **Inter** atau **Manrope** (layout saat ini pakai Geist; dokumentasikan bila diganti).

Detail lengkap token, komponen, breakpoint, do/don't ada di `docs/DESIGN.MD` bagian 1–9.

## Workflow

```bash
npm install      # sekali (node_modules tidak di-commit)
npm run dev      # http://localhost:3000 (Turbopack)
npm run build    # production build
npm run lint     # eslint (flat config: eslint.config.mjs)
```

- Kerja frontend di branch `teguh`; commit hanya saat diminta.
- DB butuh MySQL lokal (`nova`) untuk fitur data; UI murni bisa dikerjakan tanpa DB.
