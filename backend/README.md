# backend — FastAPI Application & Database Layer

Python FastAPI backend for Vanta. Handles SSE streaming, database persistence, CRM integration, and all REST API routes.

---

## 📄 Files

| File | Purpose |
|---|---|
| `main.py` | FastAPI app — all routes, SSE stream, CRM push, radar stats |
| `database.py` | PostgreSQL connection, schema init, all query functions |
| `requirements.txt` | Python dependencies |
| `.env` | API keys (not committed to git) |
| `.env.example` | Template — copy this to `.env` |
| `test_agent.py` | CLI end-to-end test for the agent pipeline |

---

## 🔌 API Routes

### `POST /api/scan`
Starts a competitive scan. Returns a **Server-Sent Events (SSE)** stream.

**Request:**
```json
{ "competitor": "Salesforce" }
```

**SSE Event types streamed:**
| Type | Description |
|---|---|
| `job_created` | Scan job created in DB |
| `thinking` | Agent status message |
| `tool_call` | Tool being invoked (search_web, scrape_url) |
| `search_result` | SERP results returned |
| `scrape_result` | Page scrape completed |
| `signals_ready` | Signal list extracted — saved to DB |
| `complete` | Scan finished |
| `stream_end` | SSE stream closing |
| `error` | Unhandled exception |

---

### `GET /api/signals`
Fetch signals from database.

**Query params:**
- `?competitor=Salesforce` — all signals for a competitor
- `?job_id=<uuid>` — signals for a specific scan job
- (no params) — 50 most recent signals

---

### `GET /api/status/{job_id}`
Get scan job status and progress percentage.

**Response:**
```json
{
  "id": "uuid",
  "competitor": "Salesforce",
  "status": "COMPLETED",
  "progress": 100,
  "created_at": "2026-05-29T..."
}
```

Job statuses: `PENDING` → `RUNNING` → `SCORING` → `COMPLETED` / `FAILED`

---

### `POST /api/battlecard`
Generate a GTM battle card for a signal using Claude Opus.

**Request:**
```json
{ "signal_id": 42, "competitor": "Salesforce" }
```

**Response:**
```json
{
  "summary": "...",
  "talking_points": ["...", "...", "...", "..."],
  "email_pitch": { "subject": "...", "body": "..." },
  "objection_handling": { "objection": "...", "response": "..." }
}
```

---

### `POST /api/push-crm`
Push a signal as a HubSpot deal.

**Request:**
```json
{ "signal_id": 42, "crm_type": "HubSpot" }
```

- If `HUBSPOT_ACCESS_TOKEN` is set → creates real deal via HubSpot Deals API
- If not set → simulates push in sandbox mode

**Response:**
```json
{
  "success": true,
  "message": "Lead pushed to simulated HubSpot sandbox pipeline.",
  "crm_type": "HubSpot",
  "signal_id": 42,
  "real_apis": { "hubspot": false }
}
```

---

### `POST /api/enrich`
Find decision-maker contacts for a company.

**Request:**
```json
{ "company_name": "Acme Corp", "industry": "SaaS" }
```

**Response:**
```json
{
  "success": true,
  "contacts": [
    { "name": "Jane Doe", "title": "CEO", "email": "jane@acme.com", "linkedin": "..." }
  ]
}
```

---

### `GET /api/competitor-stats`
Aggregated vulnerability stats for the radar chart dashboard.

**Response:**
```json
[
  {
    "name": "Salesforce",
    "score": 72,
    "level": "High",
    "trigger": "Pricing",
    "signals": 14,
    "trend": "up",
    "pricing_score": 88,
    "support_score": 64,
    "feature_score": 70,
    "hiring_score": 45,
    "sentiment_score": 60
  }
]
```

---

## 🗄️ Database Schema

### `scan_jobs`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (UUID) | Primary key |
| `competitor` | TEXT | Competitor name scanned |
| `status` | TEXT | PENDING / RUNNING / SCORING / COMPLETED / FAILED |
| `progress` | INTEGER | 0–100 |
| `created_at` | TEXT | ISO timestamp |

### `signals`
| Column | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `job_id` | TEXT | FK → scan_jobs.id |
| `company_name` | TEXT | Extracted company name |
| `company_size` | TEXT | e.g. "50-200 employees" |
| `industry` | TEXT | e.g. "SaaS", "Healthcare" |
| `intent_score` | INTEGER | 1–10 |
| `source` | TEXT | Reddit / G2 / Trustpilot / HackerNews |
| `source_url` | TEXT | URL of the source page |
| `source_details` | TEXT | Thread title or review title |
| `pain_point` | TEXT | Pricing / Support Issues / Feature Gaps / etc. |
| `raw_text` | TEXT | Direct quote from source |
| `battlecard` | TEXT | JSON battle card (generated on demand) |
| `is_pushed` | INTEGER | 0 = not pushed, 1 = pushed to CRM |

> Tables are auto-created on first backend startup via `init_db()`.

---

## 🚀 Running Locally

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend runs at **http://127.0.0.1:8000**

---

## 🧪 Testing

```bash
python test_agent.py
```

Runs a full end-to-end CLI test of the agent pipeline — scraping, signal extraction, and DB persistence.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BRIGHT_DATA_API_KEY` | Yes | Bright Data account API key |
| `BRIGHT_DATA_SERP_ZONE` | Yes | SERP zone name (default: `serp_api2`) |
| `BRIGHT_DATA_UNLOCKER_ZONE` | Yes | Web Unlocker zone (default: `web_unlocker1`) |
| `BRIGHT_DATA_SB_ZONE` | Yes | Scraping Browser zone (default: `scraping_browser1`) |
| `AIML_API_KEY` | Yes | AIML API key for Claude Opus |
| `AIML_MODEL` | No | Model name (default: `anthropic/claude-opus-4-8`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `HUBSPOT_ACCESS_TOKEN` | No | HubSpot token — leave blank for sandbox mode |

---

## 🔒 CORS

Currently allows:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

For production deployment, update `allow_origins` in `main.py` to your deployed frontend URL.
