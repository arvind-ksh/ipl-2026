# TATA IPL 2026

A React dashboard for IPL 2026 — teams, squads, schedule, results, and head-to-head analysis.

## Features

- **Teams** — All 10 franchises with full squads (Batters / All-Rounders / Bowlers)
- **Schedule & Results** — 30 matches with live results for M1–M8, upcoming fixtures
- **H2H Analysis** — Click any match: all-time record, venue record, bat vs chase breakdown
- **Points Table** — Live standings after Match 8

## Deploy to Vercel

### Option 1: Vercel CLI (fastest)

```bash
npm install -g vercel
cd ipl2026
npm install
vercel
```

Follow the prompts — Vercel auto-detects Vite.

### Option 2: GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Vercel auto-detects Vite settings — click **Deploy**

### Option 3: Drag & Drop

```bash
npm install
npm run build
```

Drag the `dist/` folder into [vercel.com/new](https://vercel.com/new).

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the build locally
```

## Tech Stack

- React 18
- Vite 5
- Pure inline styles (no CSS framework needed)
- Zero runtime dependencies beyond React
