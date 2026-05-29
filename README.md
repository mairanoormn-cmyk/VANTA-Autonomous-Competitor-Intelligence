# Vanta
### Autonomous Competitor Intelligence & GTM Agent
*Built for the Bright Data AI Agents Web Data Hackathon — May 2026*

Vanta is an autonomous GTM intelligence agent that scans the open web for competitor dissatisfaction signals, scores intent with AI, generates personalized battle cards, and pushes qualified leads directly into HubSpot CRM — fully automated.

---

## 🏆 Hackathon Track

**Track 1 — GTM Intelligence** | Bright Data AI Agents Web Data Challenge

---

## ✨ Features

| Feature | Status | Description |
|---|---|---|
| Bright Data MCP Server | ✅ Live | Primary agent path via SSE transport — `search_engine`, `web_data_reddit_posts`, `scrape_as_markdown` |
| Bright Data SERP API | ✅ Live | Google search fallback across Reddit, G2, Glassdoor, HackerNews |
| Bright Data Web Unlocker | ✅ Live | General page scraping with bot-protection bypass |
| Bright Data Scraping Browser | ✅ Live | JS-rendered page scraping for G2, Trustpilot (fallback) |
| Claude Opus via AIML API | ✅ Live | Intent scoring, signal extraction, battle card generation |
| PostgreSQL (Supabase) | ✅ Live | Scan jobs + signals persistence |
| HubSpot CRM Integration | ✅ Live | Deal push (real API if token set, sandbox otherwise) |
| Lead Enrichment | ✅ Live | Bright Data SERP + Claude Opus contact discovery |
| Vulnerability Radar Chart | ✅ Live | Interactive Recharts radar across 5 dimensions |
| ROI Calculator Panel | ✅ Live | Pipeline value, hours saved, ROI % |
| Real-time SSE Streaming | ✅ Live | Live agent activity feed in browser |
| Multi-page UI | ✅ Live | Home, Dashboard, How It Works, About |

---

## 📐 Architecture

```
[React Frontend]
      │  POST /api/scan
      ▼
[FastAPI Backend]  ──── creates scan job ──► [PostgreSQL / Supabase]
      │
      ▼
[Agent Orchestrator]
      │
      ├─► PRIMARY: Bright Data MCP Server (SSE)
      │     ├── search_engine        (Google SERP)
      │     ├── web_data_reddit_posts (Reddit structured data)
      │     └── scrape_as_markdown   (G2 / Trustpilot reviews)
      │
      └─► FALLBACK: Manual Pipeline
            ├── Bright Data SERP API    (8 targeted queries)
            ├── Bright Data Web Unlocker (page scraping)
            └── Bright Data Scraping Browser (JS-heavy sites)
                        │
                        ▼
              [Claude Opus — AIML API]
              Signal extraction + intent scoring
                        │
                        ▼
              [PostgreSQL] ──► [SSE Stream] ──► [React UI]
                        │
                        ▼
              [HubSpot CRM] (on Push to CRM click)
```

---

## 📂 Project Structure

```
Vanta/
├── backend/
│   ├── main.py              # FastAPI routes, SSE streaming, CRM push
│   ├── database.py          # PostgreSQL schema + query functions
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # API keys (not committed)
│   └── .env.example         # Template for environment variables
│
├── ai-llm/
│   └── agent_orchestrator.py  # MCP agent, fallback pipeline, Claude Opus calls
│
├── bright-data/
│   └── bright_data_utils.py   # SERP API, Web Unlocker, Scraping Browser helpers
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page with hero + features
    │   │   ├── Dashboard.jsx    # Scanner UI, signals, radar, ROI panel
    │   │   ├── HowItWorks.jsx   # Architecture walkthrough
    │   │   └── About.jsx        # Project info + tech stack
    │   ├── components/
    │   │   ├── Navbar.jsx       # Responsive navigation
    │   │   ├── Footer.jsx       # Footer with links
    │   │   └── Layout.jsx       # Page wrapper
    │   ├── App.jsx              # Router setup
    │   └── index.css            # Complete design system
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Environment Setup

Copy `backend/.env.example` to `backend/.env` and fill in your keys:

```ini
# Bright Data
BRIGHT_DATA_API_KEY=your_bright_data_api_key_here
BRIGHT_DATA_SERP_ZONE=serp_api2
BRIGHT_DATA_UNLOCKER_ZONE=web_unlocker1
BRIGHT_DATA_SB_ZONE=scraping_browser1

# AI Model (AIML API Gateway)
AIML_API_KEY=your_aiml_api_key_here
AIML_MODEL=anthropic/claude-opus-4-8

# Database (PostgreSQL / Supabase)
DATABASE_URL=postgresql://user:password@host:5432/postgres

# HubSpot CRM (optional — leave blank for sandbox mode)
HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
```

---

## 🚀 Running Locally

### Requirements
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scan` | Start a scan — returns SSE stream |
| `GET` | `/api/signals` | Fetch signals (filter by competitor or job_id) |
| `GET` | `/api/status/{job_id}` | Get scan job status |
| `POST` | `/api/battlecard` | Generate battle card for a signal |
| `POST` | `/api/push-crm` | Push signal as HubSpot deal |
| `POST` | `/api/enrich` | Find contacts for a company |
| `GET` | `/api/competitor-stats` | Aggregated vulnerability stats for radar chart |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Recharts, React Router |
| Backend | Python, FastAPI, SSE |
| Database | PostgreSQL via Supabase (psycopg2) |
| AI Model | Anthropic Claude Opus via AIML API |
| Data Layer | Bright Data MCP Server, SERP API, Web Unlocker, Scraping Browser |
| CRM | HubSpot Deals API |

---

## 📝 Notes

- LinkedIn Jobs Dataset has been removed — it is a paid Bright Data feature not available on free tier
- MCP Server is the primary data path; SERP + Web Unlocker + Scraping Browser are automatic fallbacks
- All LLM calls go through AIML API (`https://api.aimlapi.com/v1`) using `anthropic/claude-opus-4-8`
- Database tables are auto-created on first backend startup
