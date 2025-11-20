# GambitAI

Platform prediksi pasar berbasis AI dengan antarmuka modern dan intuitif.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS dengan Teal Color Theme
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Deployment**: Vercel

## Color Theme

Aplikasi ini menggunakan Teal-based Dark Theme:
- Background Primary: `#000D1D`
- Accent Primary: `#26FFF6`
- Background Secondary: `#001A33`
- Text: Light teal variants untuk optimal contrast

## Setup Lokal

```bash
cd gambitai-frontend
pnpm install
pnpm dev
```

## Deployment

Project ini dioptimasi untuk deployment di Vercel. Struktur folder telah disesuaikan untuk clean architecture dan deployment yang efisien.

## Struktur Project

```
/
├── gambitai-frontend/     # Frontend React application
├── supabase/              # Supabase configurations
│   ├── functions/         # Edge functions
│   ├── migrations/        # Database migrations
│   └── tables/            # Table schemas
└── README.md
```

## Environment Variables

Pastikan environment variables berikut sudah dikonfigurasi:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

Developed with MiniMax Agent
