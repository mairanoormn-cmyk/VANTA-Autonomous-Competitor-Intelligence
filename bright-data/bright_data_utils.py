import os
import re
import requests
from pathlib import Path
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load .env from backend directory
_env_path = Path(__file__).parent.parent / "backend" / ".env"
load_dotenv(dotenv_path=_env_path)

# Config
BRIGHT_DATA_API_KEY    = os.getenv("BRIGHT_DATA_API_KEY")
BRIGHT_DATA_SERP_ZONE  = os.getenv("BRIGHT_DATA_SERP_ZONE", "serp_api2")
BRIGHT_DATA_UNL_ZONE   = os.getenv("BRIGHT_DATA_UNLOCKER_ZONE", "web_unlocker1")
BD_ENDPOINT            = "https://api.brightdata.com/request"
BD_HEADERS             = {
    "Content-Type":  "application/json",
    "Authorization": f"Bearer {BRIGHT_DATA_API_KEY}",
}

def search_web(query: str) -> dict:
    """Search Google via Bright Data SERP API (format=raw), parse HTML for organic results."""
    encoded = requests.utils.quote(query)
    google_url = f"https://www.google.com/search?q={encoded}&hl=en&gl=us&num=8"
    payload = {
        "zone":   BRIGHT_DATA_SERP_ZONE,
        "url":    google_url,
        "format": "raw",
    }
    try:
        resp = requests.post(BD_ENDPOINT, headers=BD_HEADERS, json=payload, timeout=30)
        resp.raise_for_status()
        html = resp.text

        # Parse raw Google HTML to extract organic results
        soup = BeautifulSoup(html, "html.parser")
        results = []

        # Google wraps each organic result in a <div class="g"> or similar
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
            title = title_tag.get_text(strip=True) if title_tag else a_tag.get_text(strip=True)

            snippet = ""
            for sel in ["div.VwiC3b", "span.aCOpRe", "div[data-sncf]", "div.IsZvec"]:
                snip_tag = div.select_one(sel)
                if snip_tag:
                    snippet = snip_tag.get_text(" ", strip=True)[:300]
                    break

            if title and href:
                results.append({"title": title, "url": href, "snippet": snippet})
            if len(results) >= 6:
                break

        # Fallback
        if not results:
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if href.startswith("http") and "google.com" not in href:
                    title = a.get_text(strip=True)[:100]
                    if title and len(title) > 10:
                        results.append({"title": title, "url": href, "snippet": ""})
                if len(results) >= 6:
                    break

        return {"success": True, "query": query, "results": results}
    except Exception as e:
        return {"success": False, "query": query, "error": str(e), "results": []}

def scrape_url(url: str) -> dict:
    """Fetch and clean a webpage via Bright Data Web Unlocker."""
    payload = {
        "zone":   BRIGHT_DATA_UNL_ZONE,
        "url":    url,
        "format": "raw",
    }
    try:
        resp = requests.post(BD_ENDPOINT, headers=BD_HEADERS, json=payload, timeout=45)
        resp.raise_for_status()
        html = resp.text
        
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "iframe", "noscript"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r"\s+", " ", text).strip()
        return {"success": True, "url": url, "content": text[:5000]}
    except Exception as e:
        return {"success": False, "url": url, "error": str(e), "content": ""}
