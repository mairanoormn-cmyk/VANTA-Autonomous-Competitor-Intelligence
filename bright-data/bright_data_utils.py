"""
Vanta — Bright Data Utility Functions
Covers: SERP API, Web Unlocker, Scraping Browser
"""
import os
import re
import asyncio
import requests
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load .env from backend directory
_env_path = Path(__file__).parent.parent / "backend" / ".env"
load_dotenv(dotenv_path=_env_path)

BRIGHT_DATA_API_KEY  = os.getenv("BRIGHT_DATA_API_KEY", "")
SERP_ZONE            = os.getenv("BRIGHT_DATA_SERP_ZONE", "serp_api2")
UNLOCKER_ZONE        = os.getenv("BRIGHT_DATA_UNLOCKER_ZONE", "web_unlocker1")
SB_ZONE              = os.getenv("BRIGHT_DATA_SB_ZONE", "scraping_browser1")

# Bright Data REST endpoint (SERP + Web Unlocker + Scraping Browser)
BD_ENDPOINT = "https://api.brightdata.com/request"


def _bd_headers() -> dict:
    """Always build headers fresh so key is never stale."""
    return {
        "Content-Type":  "application/json",
        "Authorization": f"Bearer {BRIGHT_DATA_API_KEY}",
    }


# ── 1. SERP API — structured JSON results ────────────────────────────────────
def search_web(query: str, num: int = 8) -> dict:
    """
    Search Google via Bright Data SERP API.
    Uses format=json for reliable structured results instead of raw HTML parsing.
    Falls back to raw HTML parsing if JSON format is unavailable.
    """
    if not BRIGHT_DATA_API_KEY:
        return {"success": False, "query": query, "error": "No API key", "results": []}

    encoded    = requests.utils.quote(query)
    google_url = f"https://www.google.com/search?q={encoded}&hl=en&gl=us&num={num}"

    # Try JSON format first (structured, reliable)
    payload_json = {
        "zone":   SERP_ZONE,
        "url":    google_url,
        "format": "json",
    }
    try:
        resp = requests.post(BD_ENDPOINT, headers=_bd_headers(), json=payload_json, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            # Bright Data SERP JSON schema: data.organic[]
            organic = data.get("organic", [])
            results = []
            for item in organic[:num]:
                url  = item.get("link", "") or item.get("url", "")
                title   = item.get("title", "")
                snippet = item.get("description", "") or item.get("snippet", "")
                if url and title:
                    results.append({
                        "title":   title,
                        "url":     url,
                        "snippet": snippet[:300],
                    })
            if results:
                return {"success": True, "query": query, "results": results}
    except Exception:
        pass  # Fall through to raw HTML fallback

    # Fallback: raw HTML parsing
    payload_raw = {
        "zone":   SERP_ZONE,
        "url":    google_url,
        "format": "raw",
    }
    try:
        resp = requests.post(BD_ENDPOINT, headers=_bd_headers(), json=payload_raw, timeout=30)
        resp.raise_for_status()
        soup    = BeautifulSoup(resp.text, "html.parser")
        results = []

        for div in soup.select("div.g, div[data-hveid]"):
            a_tag = div.find("a", href=True)
            if not a_tag:
                continue
            href = a_tag["href"]
            if not href.startswith("http"):
                continue
            if "google.com" in href and "url?q=" not in href:
                continue
            if "url?q=" in href:
                href = href.split("url?q=")[1].split("&")[0]

            title_tag = div.find("h3")
            title     = title_tag.get_text(strip=True) if title_tag else a_tag.get_text(strip=True)
            snippet   = ""
            for sel in ["div.VwiC3b", "span.aCOpRe", "div[data-sncf]", "div.IsZvec"]:
                snip = div.select_one(sel)
                if snip:
                    snippet = snip.get_text(" ", strip=True)[:300]
                    break

            if title and href:
                results.append({"title": title, "url": href, "snippet": snippet})
            if len(results) >= num:
                break

        # Last-resort anchor fallback
        if not results:
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if href.startswith("http") and "google.com" not in href:
                    t = a.get_text(strip=True)[:100]
                    if t and len(t) > 10:
                        results.append({"title": t, "url": href, "snippet": ""})
                if len(results) >= num:
                    break

        return {"success": bool(results), "query": query, "results": results}
    except Exception as e:
        return {"success": False, "query": query, "error": str(e), "results": []}


# ── 2. Web Unlocker — general page scraping ───────────────────────────────────
def scrape_url(url: str) -> dict:
    """
    Fetch and clean a webpage via Bright Data Web Unlocker.
    Best for standard pages — bypasses Cloudflare / Akamai bot protection.
    """
    if not BRIGHT_DATA_API_KEY:
        return {"success": False, "url": url, "error": "No API key", "content": ""}

    payload = {
        "zone":   UNLOCKER_ZONE,
        "url":    url,
        "format": "raw",
    }
    try:
        resp = requests.post(BD_ENDPOINT, headers=_bd_headers(), json=payload, timeout=45)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "iframe", "noscript"]):
            tag.decompose()
        text = re.sub(r"\s+", " ", soup.get_text(separator=" ", strip=True)).strip()
        return {"success": True, "url": url, "content": text[:5000]}
    except Exception as e:
        return {"success": False, "url": url, "error": str(e), "content": ""}


# ── 3. Scraping Browser — JS-heavy sites ─────────────────────────────────────
async def scrape_js_site(url: str) -> str:
    """
    Fetch JS-rendered pages via Bright Data Scraping Browser.

    Bright Data Scraping Browser (Browser API) is accessed via:
    - REST endpoint: https://api.brightdata.com/request with zone=<SB_ZONE>
    - This is the same REST endpoint as Web Unlocker but with the Browser API zone

    The Browser API zone handles full JS rendering, CAPTCHA solving, and fingerprinting.
    Falls back to Web Unlocker if Browser API returns insufficient content.
    """
    if not BRIGHT_DATA_API_KEY:
        print("[Scraping Browser] No API key — skipping.")
        return ""

    # Primary: Scraping Browser via REST endpoint (Browser API zone)
    payload = {
        "zone":   SB_ZONE,
        "url":    url,
        "format": "raw",
    }
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                BD_ENDPOINT,
                headers=_bd_headers(),
                json=payload,
            )
            if response.status_code == 200:
                html = response.text
                if html and len(html.strip()) > 500:
                    soup = BeautifulSoup(html, "html.parser")
                    for tag in soup(["script", "style", "nav", "footer", "header", "iframe", "noscript"]):
                        tag.decompose()
                    text = re.sub(r"\s+", " ", soup.get_text(separator=" ", strip=True)).strip()
                    if len(text) > 200:
                        print(f"[Scraping Browser] OK — {len(text)} chars from {url}")
                        return text[:5000]
                print(f"[Scraping Browser] Insufficient content ({len(html)} bytes) from {url}")
            elif response.status_code == 403:
                print(f"[Scraping Browser] 403 Forbidden — zone credentials may be incorrect for {url}")
                # Log the response for debugging
                try:
                    resp_data = response.json()
                    print(f"[Scraping Browser] Error details: {resp_data}")
                except Exception:
                    print(f"[Scraping Browser] Response text: {response.text[:300]}")
            else:
                print(f"[Scraping Browser] Status {response.status_code} for {url}")
                # Log response body for debugging
                try:
                    print(f"[Scraping Browser] Response: {response.text[:200]}")
                except Exception:
                    pass
    except Exception as e:
        print(f"[Scraping Browser] Error: {e}")

    # Fallback: Web Unlocker
    print(f"[Scraping Browser] Falling back to Web Unlocker for {url}")
    res = scrape_url(url)
    return res.get("content", "") if res.get("success") else ""


# ── 4. Async SERP wrapper (for use in async agent loops) ─────────────────────
async def search_web_async(query: str, num: int = 8) -> dict:
    """Async wrapper around search_web for use in async agent pipelines."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: search_web(query, num))
