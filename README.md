# NetRecon — Network Reconnaissance Dashboard

A full-stack network reconnaissance web application built around a multithreaded
TCP port scanner. What started as a command-line Python tool has been rebuilt into
a Flask REST API + React dashboard, styled after SOC/security-operations tools
like Splunk, Wazuh, and CrowdStrike Falcon.

The original CLI scanner's core logic — socket connect scanning, banner grabbing,
service lookup, CSV/JSON export — is preserved and reused; it now runs behind an
API instead of argparse, with live progress reporting and a browser-based UI.

![status](https://img.shields.io/badge/status-active-00C853) ![python](https://img.shields.io/badge/python-3.10%2B-38BDF8) ![license](https://img.shields.io/badge/license-MIT-FACC15)

---

## Features

- **Live scan dashboard** — target, port range, and thread-count controls, with a
  progress bar and radar-style loading indicator while a scan runs.
- **Results table** — port, status, service, category, and grabbed banner for
  every port, color-coded open (green) / closed (red).
- **Statistics cards** — open ports, ports scanned, scan time, and current target
  at a glance.
- **Charts** — open vs. closed ports, services distribution, and port category
  breakdown, rendered with Recharts.
- **Session history** — every scan run in the session is kept in memory and can
  be revisited from the Scanner or Reports pages.
- **Reports & exports** — download any completed scan as CSV or JSON.
- **Logs viewer** — tails `scanner.log` in-browser with a manual refresh.
- **Dark / light theme toggle**, responsive layout, keyboard-focus states, and
  reduced-motion support.

## Screenshots

> _Add screenshots of the running app here before publishing — e.g._
> `screenshots/dashboard.png`, `screenshots/scanner.png`, `screenshots/reports.png`.

## Architecture

```
Browser (React/Vite)
   │  fetch /api/*
   ▼
Flask REST API (app.py)
   │  spawns background thread per scan
   ▼
ScanJob (scanner_core.py)
   │  ThreadPoolExecutor → socket.connect_ex per port
   ├─ banner.py     → grabs service banners
   ├─ utils.py      → target validation, service/category lookup
   ├─ exporter.py   → writes results/scan_<job_id>.csv / .json
   └─ logger.py     → rotating scanner.log
```

The frontend polls `GET /api/scan/<job_id>` roughly every 800ms while a scan is
`running`, and stops once the job reaches `completed` or `error`.

### API Endpoints

| Method | Endpoint                        | Description                          |
|--------|----------------------------------|---------------------------------------|
| GET    | `/api/health`                    | Liveness check                        |
| POST   | `/api/scan`                      | Start a scan `{ target, ports, threads }` |
| GET    | `/api/scan/<job_id>`             | Poll status / final results           |
| GET    | `/api/history`                   | List all jobs run this session        |
| GET    | `/api/logs`                      | Tail of `scanner.log`                 |
| GET    | `/api/download/csv/<job_id>`     | Download CSV for a completed job      |
| GET    | `/api/download/json/<job_id>`    | Download JSON for a completed job      |

## Project Structure

```
network-recon-dashboard/
├── backend/
│   ├── app.py              # Flask API + routes
│   ├── scanner_core.py     # ScanJob engine (refactored from original scanner.py)
│   ├── banner.py           # Banner grabbing
│   ├── exporter.py         # CSV / JSON export
│   ├── logger.py           # Rotating file logger
│   ├── utils.py            # Target validation, service/category lookup
│   ├── requirements.txt
│   └── results/            # Generated CSV/JSON exports (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # Sidebar, Navbar, ScanForm, ResultsTable, ChartsPanel, ...
│   │   ├── pages/           # Dashboard, Scanner, Reports, Logs, About
│   │   ├── hooks/           # useScan (start + poll a scan job)
│   │   ├── services/        # api.js (axios client)
│   │   └── styles/           # theme.css (design tokens), global.css
│   ├── vite.config.js       # dev proxy: /api -> http://localhost:5000
│   └── package.json
├── LICENSE
└── README.md
```

## Installation

### Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                 # runs on http://localhost:5000
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev                   # runs on http://localhost:5173
```

In development, Vite proxies `/api/*` requests to `http://localhost:5000` (see
`vite.config.js`), so no extra CORS configuration is needed locally. For a
production deployment, set `VITE_API_BASE_URL` (see `frontend/.env.example`) to
your deployed backend's URL and run `npm run build`.

## Usage

1. Start the backend, then the frontend, as above.
2. Open `http://localhost:5173`.
3. On the **Scanner** page, enter a target (IP or hostname), a port range
   (e.g. `20-1024`), and a thread count, then click **Start Scan**.
4. Watch the progress bar and live results table populate as ports are checked.
5. Visit **Reports** to download the finished scan as CSV or JSON, or **Logs**
   to review the raw scan log.

## Future Improvements

- WebSocket-based progress updates instead of polling
- UDP scanning and OS fingerprinting
- Persistent storage (SQLite/Postgres) instead of in-memory job storage
- Authentication for multi-user deployments
- Scheduled/recurring scans

## Disclaimer

This tool is intended for **educational purposes and authorized security
testing only**. Only scan systems you own or have explicit written permission
to test. Scanning networks or hosts without authorization may violate the
Computer Fraud and Abuse Act (or equivalent laws in your jurisdiction) and is
not condoned by this project.

## License

MIT — see [LICENSE](LICENSE).
