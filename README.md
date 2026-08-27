# SecureX — Security Log Analyzer

Professional SOC-style Security Log Analyzer for a college Project Expo.

## Features
- Login screen with local session authentication
- Dark Glassmorphism SOC interface
- Real-time synthetic log monitoring
- Upload `.log`, `.txt`, or `.csv` files
- Pattern-based security detection
- Severity classification: Normal, Medium, High, Critical
- Dashboard with live charts and KPIs
- View Logs with search and severity filtering
- Alerts investigation page
- IP Analysis
- User Activity
- Printable report / Save as PDF
- CSV and JSON export
- Responsive layout
- LocalStorage session/log persistence
- No external API key required

## Run
```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Login
For demo/expo mode, any non-empty username and password are accepted.

## Build
```bash
npm run build
npm run preview
```

## Project structure
- `src/App.jsx` — authentication, routing, live monitoring state
- `src/styles.css` — complete Glassmorphism SOC UI
- `src/utils/analyzer.js` — log detection engine
- `src/utils/report.js` — CSV, JSON and printable report export
- `src/pages/` — dashboard and monitoring screens
- `public/security.log` — sample demo log
