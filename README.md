# Meridian College — Campus Participation Portal (React Full-Stack)

Same portal as the original Flask project, rebuilt as a **React + Node.js + SQLite** full-stack app.

| Layer      | Original              | This project                          |
|------------|-----------------------|---------------------------------------|
| Frontend   | One HTML file + JS    | React 18 + Vite + React Router        |
| Styling    | Tailwind CDN          | Tailwind CSS 3 (same theme/colours)   |
| Backend    | Python Flask          | Node.js + Express                     |
| Database   | SQLite                | SQLite (better-sqlite3), same 5 tables|

## Requirements
- Node.js 20 or newer (22 / 24 LTS recommended) and npm

## Run it (development)

```bash
# 1. open a terminal in this folder, then install everything (root + server + client)
npm run install:all

# 2. start backend (port 5000) and frontend (port 5173) together
npm run dev
```

Open **http://localhost:5173**

Sign in with `CSE001` / `password` (demo mode: any ID and password also works, same as the original).

The SQLite file `server/data/campus_portal.db` is created and seeded automatically on first start.

## Run it (production, one server)

```bash
npm run build     # builds the React app into client/dist
npm run start     # Express serves the API and the built React app
```

Open **http://localhost:5000**

## Run backend / frontend separately

```bash
cd server && npm install && npm run dev     # API on http://localhost:5000
cd client && npm install && npm run dev     # UI  on http://localhost:5173
```

## Reset the database to the demo data

```bash
npm run db:reset
```

## Settings (`server/.env`)

| Variable    | Default | Meaning                                                    |
|-------------|---------|------------------------------------------------------------|
| PORT        | 5000    | API port                                                   |
| DEMO_MODE   | true    | `true`: any login works. `false`: only real DB students    |
| DB_FILE     | —       | Optional custom path for the SQLite file                   |

## Folder structure

```
campus-portal-fullstack/
├── package.json              root scripts (install:all, dev, build, start, db:reset)
├── README.md
├── client/                   React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js        dev proxy: /api -> localhost:5000
│   ├── tailwind.config.js    navy / gold / parchment theme
│   └── src/
│       ├── main.jsx          entry
│       ├── App.jsx           layout + routes
│       ├── api.js            all backend calls
│       ├── index.css         Tailwind + custom animations
│       ├── context/AppContext.jsx    login, theme, toasts, modals
│       ├── components/       Navbar, Toasts, CertModal, ProjectModal, ConfirmModal ...
│       ├── pages/            Home, Login, Dashboard, Participants, Verify, About
│       │   └── dashboard/    ParticipationTab, ProjectsTab, AchievementsTab, CertificatesTab
│       └── utils/helpers.js
└── server/                   Express backend
    ├── .env / .env.example
    ├── data/                 campus_portal.db is created here
    └── src/
        ├── index.js          server entry
        ├── db.js             schema + seed data
        ├── resetDb.js
        └── routes/           auth, stats, events, participation, projects, certificates, participants
```

## API (same endpoints as the Flask version)

| Method | Endpoint                 | Purpose                          |
|--------|--------------------------|----------------------------------|
| POST   | /api/auth/login          | Sign in                          |
| GET    | /api/stats               | Dashboard stat cards             |
| GET    | /api/events              | All events                       |
| POST   | /api/events/register     | Register for an event            |
| GET    | /api/participation       | A student's participation        |
| GET    | /api/projects            | All projects                     |
| POST   | /api/projects            | Submit a project                 |
| GET    | /api/certificates        | A student's certificates         |
| GET    | /api/verify?id=...       | Verify a certificate ID          |
| GET    | /api/participants        | Roster for an event              |

Try a certificate ID on the Verify page: `CERT-CSE001-2026-014`

---

## Deploy: backend on Render + frontend on Netlify

Push the whole project (the folder containing `client` and `server`) to GitHub first.

### A) Backend on Render (SQLite)
1. Render -> **New -> Web Service** -> pick your repo.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment variables:**
   - `NODE_VERSION` = `22`
   - `DEMO_MODE` = `true`
   - `CLIENT_ORIGIN` = your Netlify URL (add after step B, e.g. `https://your-site.netlify.app`)
4. Deploy, then open `https://YOUR-SERVICE.onrender.com/api/health` - it should show `{"ok":true}`.

Free-plan note: Render's free filesystem is temporary, so the SQLite file is recreated with the demo data after every restart or sleep. New registrations/projects are lost then. A paid plan with a persistent disk (`DB_FILE=/var/data/campus_portal.db`) keeps them.
The service also sleeps after 15 minutes idle; the first request afterwards takes about a minute.

### B) Frontend on Netlify
1. Netlify -> **Add new site -> Import from Git** -> pick the same repo.
2. Settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist` (or just `dist` if Netlify shows it relative to the base directory)
3. **Environment variable (before the first deploy):**
   - `VITE_API_URL` = `https://YOUR-SERVICE.onrender.com/api`   (note the `/api` at the end)
4. Deploy. Then put the Netlify URL into Render's `CLIENT_ORIGIN` and redeploy the backend.

If you change `VITE_API_URL` later, trigger a new Netlify deploy (the value is baked in at build time).
