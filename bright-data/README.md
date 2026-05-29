# bright-data — Scraping & Web Data Utilities

Bright Data integration layer for Vanta. Provides SERP search, Web Unlocker scraping, and Scraping Browser for JS-heavy sites.

---

## 📄 File

### `bright_data_utils.py`

All Bright Data REST API calls go through a single endpoint:
```
POST https://api.brightdata.com/request
Authorization: Bearer <BRIGHT_DATA_API_KEY>
```

---

## 🔧 Functions

### `search_web(query, num=8)` → `dict`
**Tool:** Bright Data SERP API (`serp_api2` zone)

Searches Google and returns structured results.

**Strategy:**
1. Tries `format=json` first — returns `organic[]` array with title, url, snippet
2. Falls back to `format=raw` HTML parsing with BeautifulSoup if JSON fails

**Returns:**
```python
{
  "success": True,
  "query": "site:reddit.com Salesforce alternatives",
  "results": [
    { "title": "...", "url": "https://...", "snippet": "..." }
  ]
}
```

---

### `scrape_url(url)` → `dict`
**Tool:** Bright Data Web Unlocker (`web_unlocker1` zone)

Fetches a webpage bypassing Cloudflare, Akamai, and other bot protection. Strips scripts, styles, nav, footer before returning clean text.

**Returns:**
```python
{
  "success": True,
  "url": "https://...",
  "content": "cleaned page text up to 5000 chars"
}
```

**Best for:** HackerNews, general blogs, company websites, non-JS pages.

---

### `scrape_js_site(url)` → `str` (async)
**Tool:** Bright Data Scraping Browser (`scraping_browser1` zone)

Sends the URL to a cloud-hosted Chromium instance that fully renders JavaScript before returning the page. Falls back to `scrape_url()` (Web Unlocker) if the Scraping Browser returns insufficient content.

**Returns:** Cleaned page text (up to 5000 chars) or empty string on failure.

**Best for:** G2.com, Trustpilot, Glassdoor — all JS-rendered review sites.

---

### `search_web_async(query, num=8)` → `dict` (async)
Async wrapper around `search_web()` using `asyncio.get_running_loop().run_in_executor()`.

Used by the agent orchestrator in async context.

---

## 🌐 Bright Data Tools Summary

| Tool | Zone | Function | Used For |
|---|---|---|---|
| SERP API | `serp_api2` | `search_web()` | Google search queries |
| Web Unlocker | `web_unlocker1` | `scrape_url()` | General page scraping |
| Scraping Browser | `scraping_browser1` | `scrape_js_site()` | JS-rendered review sites |
| MCP Server | SSE transport | `_run_mcp_agent()` in orchestrator | Primary agent path |

> **Note:** LinkedIn Jobs Dataset (`gd_l1viktl72bvl7bjuj0`) was removed — it is a paid Bright Data feature not available on free tier.

---

## ⚙️ Configuration

Set in `backend/.env`:

```ini
BRIGHT_DATA_API_KEY=your_key_here
BRIGHT_DATA_SERP_ZONE=serp_api2
BRIGHT_DATA_UNLOCKER_ZONE=web_unlocker1
BRIGHT_DATA_SB_ZONE=scraping_browser1
```

---

## 🔍 Scraping Behaviour Notes

**Sites that work well with Web Unlocker:**
- HackerNews (`news.ycombinator.com`)
- Company blogs and press releases
- General news articles

**Sites that require Scraping Browser:**
- `g2.com` — JS-rendered reviews
- `trustpilot.com` — JS-rendered reviews
- `glassdoor.com` — JS-rendered employee reviews

**Sites handled via MCP `scrape_as_markdown`:**
- G2 and Trustpilot (primary path when MCP is connected)

**Sites blocked regardless (403):**
- Twitter/X — requires authentication
- LinkedIn — requires authentication
- These are handled via SERP snippets only

---

## 🚨 Error Handling

All functions return gracefully on failure:
- `search_web()` returns `{"success": False, "results": []}` on any error
- `scrape_url()` returns `{"success": False, "content": ""}` on any error
- `scrape_js_site()` falls back to Web Unlocker, then returns `""` if both fail
- No exceptions propagate to the caller
