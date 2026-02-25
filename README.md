# Deepak Software Solutions Portal (Client)

React + Vite based frontend for the portal UI.

## Tech stack

- React 18
- React Router DOM
- Vite 5
- Tailwind CSS (PostCSS + Autoprefixer)

## Prerequisites

- Node.js (LTS recommended)
- npm (or your preferred package manager)

## Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
copy env.example .env
```

> On macOS/Linux:
>
> ```bash
> cp env.example .env
> ```

Update values in `.env` as needed.

## Environment variables

These are read by Vite (must start with `VITE_`):

- **`VITE_APP_NAME`**: App display name
- **`VITE_API_URL`**: Backend base URL (example: `http://localhost:4000`)
- **`VITE_DEMO_ADMIN_EMAIL`** (optional): Demo login email
- **`VITE_DEMO_ADMIN_PASSWORD`** (optional): Demo login password

## Run locally

Start dev server:

```bash
npm run dev
```

App will run on:

- `http://localhost:5173`

## API proxy (dev)

During development, requests to **`/api`** are proxied to:

- `http://localhost:4000`

So you can call `/api/...` from the frontend without CORS issues (as long as the backend is running on port 4000).

## Build & preview

Create production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment (Vercel)

This project includes `vercel.json` configured for SPA routing (all paths rewrite to `index.html`).

Recommended Vercel settings:

- **Build command**: `npm run build`
- **Output directory**: `dist`

