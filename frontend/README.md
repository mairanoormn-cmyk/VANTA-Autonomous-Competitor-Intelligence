# frontend — React + Vite SPA

React single-page application for Vanta. Professional dark UI with real-time SSE streaming, multi-page routing, and interactive data visualizations.

---

## 📄 Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Dashboard.jsx     # Main scanner UI
│   │   ├── HowItWorks.jsx    # Architecture walkthrough
│   │   └── About.jsx         # Project info + tech stack
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky responsive navbar
│   │   ├── Footer.jsx        # Footer with nav links
│   │   └── Layout.jsx        # Page wrapper (hides footer on dashboard)
│   ├── assets/
│   │   ├── logo.png          # Vanta logo
│   │   └── hero.png          # Hero image
│   ├── App.jsx               # BrowserRouter + Routes
│   ├── main.jsx              # React DOM entry point
│   └── index.css             # Complete design system
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html
├── package.json
└── vite.config.js
```

---

## 📱 Pages

### `Home.jsx`
Landing page with:
- Hero section with competitor search input
- Stats bar (10,000+ signals, 94% accuracy, 3x pipeline, <30s scan)
- Three-step workflow (Detect → Score → Push)
- Feature cards (6 capabilities)
- CTA block linking to Dashboard

### `Dashboard.jsx`
Main application UI. Two views:

**Landing View** (`view === 'landing'`):
- Competitor search form with example chips
- Weekly Vulnerability Index table (from `/api/competitor-stats`)
- Vulnerability Radar Chart (Recharts RadarChart)

**Scan Workspace** (`view === 'scan'`):
- Top bar: back button, competitor name, new scan input, stats counter
- Progress line animation while scanning
- ROI Panel: Pipeline Generated, Hours Saved, ROI %, High-Intent Leads
- Left panel: Real-time Agent Activity Feed (SSE events)
- Right panel: Intent Signal Cards sorted by score
- Side Drawer: Battle card, outbound email, Push to CRM, Find Contacts

### `HowItWorks.jsx`
Architecture walkthrough with:
- System architecture diagram
- 8-step pipeline explanation
- Technology stack table (9 technologies)

### `About.jsx`
Project information with:
- Problem / Solution cards
- Core values (Speed, Accuracy, Automation)
- Full technology stack table
- Hackathon attribution

---

## 🧩 Key Components

### `Navbar.jsx`
- Sticky with backdrop blur
- Active link highlighting
- "Launch Scanner" CTA button
- Responsive hamburger menu for mobile

### `Footer.jsx`
- Brand column with tagline
- Product links (Dashboard, How It Works, About)
- Technology links (Bright Data, AIML API, HubSpot)
- Hidden on Dashboard page (full-screen app)

### `Layout.jsx`
- Wraps all pages with Navbar + Footer
- Hides Footer when `pathname === '/dashboard'`

---

## 📊 Dashboard Components

### `VulnerabilityRadar`
Recharts `RadarChart` showing 5 vulnerability dimensions:
- Pricing, Support, Features, Hiring, Sentiment
- Data from `/api/competitor-stats`
- Updates when a competitor row is clicked in the table

### `ActivityItem`
Renders SSE event types with color-coded icons:
- `thinking` → purple (agent status)
- `tool_call` → blue (search_web) / amber (scrape_url)
- `search_result` → green (result count + URL)
- `scrape_result` → green (chars scraped or "Scrape failed")
- `signals_ready` → red (signal count)
- `complete` → green (total opportunities)
- `error` → red (error message)

### `Drawer`
Side panel for a selected signal:
- Source signal with raw quote
- Pain point tag
- Battle card generation (calls `/api/battlecard`)
- GTM talking points
- Outbound email textarea (editable)
- Push to CRM button (calls `/api/push-crm`)
- Find Contacts button (calls `/api/enrich`)
- Decision maker contacts list

### `ROIPanel`
Live calculations based on current signals:
- Pipeline = high-intent signals × $45,000 × 23% conversion
- Hours Saved = total signals × 8 hours
- ROI % = pipeline / (hours × $75/hr) × 100

---

## 🎨 Design System (`index.css`)

**Fonts:**
- `Inter` — body text
- `Plus Jakarta Sans` — headings/display
- `JetBrains Mono` — code/monospace elements

**Color tokens:**
```css
--bg-base:        #07090f
--purple-mid:     #7c3aed
--purple-light:   #a78bfa
--text-primary:   #f0f4ff
--text-secondary: #8b9ab8
--text-muted:     #4a5568
```

**Responsive breakpoints:**
- `≤ 900px` — activity panel hidden, drawer goes full-screen
- `≤ 768px` — navbar hamburger, footer single column
- `≤ 600px` — hero padding reduced, feature grid single column

---

## 🚀 Running Locally

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Opens at **http://localhost:5173**

> `--legacy-peer-deps` is required due to React 19 peer dependency resolution with Recharts.

---

## 🔧 Environment

Create `frontend/.env` (optional — only needed for production):

```ini
VITE_API_URL=http://127.0.0.1:8000
```

If not set, API calls default to relative URLs (same origin). This works correctly when both frontend and backend run locally.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19 | UI framework |
| `react-dom` | ^19 | DOM rendering |
| `react-router-dom` | ^7 | Client-side routing |
| `recharts` | ^3 | Radar chart + data visualization |
| `react-is` | ^19 | Required by Recharts |
| `vite` | ^8 | Build tool + dev server |
| `@vitejs/plugin-react` | ^6 | React fast refresh |

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `frontend/dist/`. Deploy to Vercel, Netlify, or any static host.

For Vercel: connect the `frontend/` directory as the project root.
