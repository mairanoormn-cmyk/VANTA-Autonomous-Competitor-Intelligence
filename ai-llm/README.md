# ai-llm — Agent Orchestration Core

This directory contains the central intelligence of **Vanta** — the autonomous GTM agent. It manages the Bright Data MCP connection, fallback scraping pipeline, Claude Opus LLM calls, and all signal extraction logic.

---

## 📄 File

### `agent_orchestrator.py`

Single file containing all agent logic. No external dependencies beyond `bright_data_utils` and standard libraries.

---

## � Agent Flow

```
run_agent_stream(competitor)
        │
        ├─► Step 1: Bright Data MCP Server (PRIMARY)
        │     └── _run_mcp_agent(competitor)
        │           ├── search_engine × 3 queries
        │           ├── web_data_reddit_posts × 1
        │           └── scrape_as_markdown × 2 (G2 + Trustpilot)
        │                     │
        │                     └── Claude Opus → signals[]
        │
        └─► Step 2: Fallback Pipeline (if MCP fails)
              ├── SERP API × 8 queries (build_search_queries)
              ├── Web Unlocker × 4 URLs
              └── Scraping Browser × 2 review URLs
                        │
                        └── Claude Opus → signals[]
```

---

## 📦 Functions

### `run_agent_stream(competitor)` → `AsyncGenerator[dict, None]`
Main entry point. Called by FastAPI `/api/scan`. Yields SSE events:

| Event type | When |
|---|---|
| `thinking` | Agent status messages |
| `tool_call` | Before each tool invocation |
| `search_result` | After SERP query returns |
| `scrape_result` | After page scrape completes |
| `signals_ready` | When signal list is extracted |
| `complete` | Scan finished |
| `error` | Any unhandled exception |

---

### `_run_mcp_agent(competitor)` → `tuple[bool, list]`
Connects to Bright Data MCP Server via SSE transport.

**URL:** `https://mcp.brightdata.com/sse?token=<KEY>&pro=1&unlocker=<ZONE>&browser=<ZONE>`

**MCP Tools used:**

| Tool | Purpose |
|---|---|
| `search_engine` | Google SERP — Reddit, HackerNews queries |
| `web_data_reddit_posts` | Structured Reddit post data |
| `scrape_as_markdown` | G2 and Trustpilot review pages |

Returns `(True, signals[])` on success, `(False, [])` on failure — triggers fallback.

> **Note:** `web_data_linkedin_job_listings` was removed — it is a paid Bright Data feature.

---

### `build_search_queries(competitor)` → `list[str]`
Builds 8 targeted Google search queries for the fallback pipeline:
- Reddit complaints and alternatives
- G2 reviews with switching signals
- Trustpilot negative reviews
- HackerNews discussions
- General web migration mentions
- LinkedIn alternative searches

---

### `generate_battlecard(signal, competitor)` → `dict`
Calls Claude Opus to generate a full GTM battle card.

**Returns:**
```json
{
  "summary": "2-3 sentence account vulnerability summary",
  "talking_points": ["...", "...", "...", "..."],
  "email_pitch": {
    "subject": "...",
    "body": "..."
  },
  "objection_handling": {
    "objection": "...",
    "response": "..."
  }
}
```

Has a hardcoded fallback if the API call fails.

---

### `enrich_lead(company_name, industry)` → `list`
Smart contact discovery using Bright Data SERP + Claude Opus.

**Two strategies:**

1. **Generic company name** (e.g. "Mid-Market SaaS Company") — searches for real decision makers in the same industry via LinkedIn SERP queries
2. **Real company name** — searches directly for their leadership + scrapes company website `/about` or `/team`

**Fallback:** Returns LinkedIn Sales Navigator and Apollo.io search links for manual lookup.

---

### `_safe_parse_signals(raw)` → `list`
Robust JSON array parser with two fallback strategies. Handles LLM responses that include extra text before/after the JSON array.

---

## 🎯 Intent Scoring Guide

Claude Opus scores each signal 1–10:

| Score | Meaning |
|---|---|
| 9–10 | Actively switching — stated "we are leaving", hiring for migration |
| 7–8 | Strong complaints, asking for alternatives, pricing frustration |
| 5–6 | Moderate frustration, feature gaps mentioned |
| 3–4 | General dissatisfaction, no immediate action |

---

## 🔌 API Configuration

All calls go through **AIML API Gateway**:
- **Base URL:** `https://api.aimlapi.com/v1/chat/completions`
- **Model:** `anthropic/claude-opus-4-8` (set via `AIML_MODEL` in `.env`)
- **Temperature:** `0.3` for extraction, `0.3` for battle cards, `0.4` for enrichment

---

## ⚠️ Known Behaviours

- MCP `notifications/progress` warnings in logs are cosmetic — Bright Data sends progress notifications that the `mcp` library doesn't fully validate. Functionality is unaffected.
- If MCP returns 0 content blocks, it falls back to manual pipeline automatically.
- Company names from Reddit/HackerNews are inferred (anonymous posters) — Claude uses context clues (budget, industry, tool mentions) to create realistic names.
