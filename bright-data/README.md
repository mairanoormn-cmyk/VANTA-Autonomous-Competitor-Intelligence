# 🌐 bright-data — Scraping & Proxy Web Utilities

This directory houses the structured extraction utilities that integrate with the **Bright Data API network**. It handles anti-bot bypassing, CAPTCHA solving, raw HTML page requests, and structured data parsing.

---

## 📂 Code Structure

### 📄 `bright_data_utils.py`
The primary scraping module that exposes two key utility functions:

#### 1. `search_web(query)`
* **Tool Engaged**: **Bright Data SERP API** (using zone `serp_api2` in `format=raw`).
* **Protocol**: Sends search parameters to Google, bypassing CAPTCHAs, geoblocking, and search rate limiting.
* **Extraction**: Uses `BeautifulSoup` (with `html.parser`) to parse organic search result items.
* **Returns**: A dictionary containing `{"success": True, "results": [{"title": "...", "url": "..."}, ...]}`.

#### 2. `scrape_url(url)`
* **Tool Engaged**: **Bright Data Web Unlocker** (using zone `web_unlocker1` in `format=raw`).
* **Protocol**: Acts as a proxy using real browser signatures, managing TLS handshakes, user-agent rotation, cookies, and dynamic Javascript execution to fetch pages behind Cloudflare or Akamai bot protection.
* **Post-Processing**: Parses HTML, strips out bloated visual components (`script`, `style`, `nav`, `header`, `footer`), and extracts normalized content strings for LLM context processing.
* **Returns**: A dictionary containing `{"success": True, "content": "Cleaned page text..."}`.

---

## ⚙️ Configuration Variables
The scraping credentials are loaded dynamically from `backend/.env`:
* `BRIGHT_DATA_API_KEY`: API authentication bearer token.
* `BRIGHT_DATA_SERP_ZONE`: Custom zone configured for SERP raw requests.
* `BRIGHT_DATA_UNLOCKER_ZONE`: Custom zone configured for Web Unlocker routing.
* `BD_ENDPOINT`: Bright Data gateway proxy `https://api.brightdata.com/request`.
