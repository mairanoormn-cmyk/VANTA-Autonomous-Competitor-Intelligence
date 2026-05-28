from pathlib import Path
import sys, os
sys.stdout.reconfigure(encoding='utf-8')
_root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_root_dir / "ai-llm"))
sys.path.insert(0, str(_root_dir / "bright-data"))
os.chdir(str(_root_dir / "backend"))

from agent_orchestrator import run_agent_stream


print("Starting full agent loop for: Salesforce")
print("=" * 60)

for event in run_agent_stream("Salesforce"):
    t = event.get("type")
    if t == "thinking":
        print(f"[THINK]  {event['message'][:120]}")
    elif t == "tool_call":
        tool = event["tool"]
        if tool == "search_web":
            print(f"[SEARCH] {event['query']}")
        elif tool == "scrape_url":
            print(f"[SCRAPE] {event.get('url','')[:90]}")
    elif t == "search_result":
        urls = event.get("urls", [])
        first = urls[0][:60] if urls else "none"
        print(f"  >> {event['count']} results | {first}")
    elif t == "scrape_result":
        print(f"  >> {event['chars']} chars scraped from {event.get('url','')[:60]}")
    elif t == "signals_ready":
        sigs = event.get("signals", [])
        print(f"\n[SIGNALS] {len(sigs)} found:")
        for s in sigs:
            print(f"  * {s['company_name']} (score {s['intent_score']}/10) -- {s['pain_point']}")
    elif t == "complete":
        print(f"\n[DONE] {event['total_signals']} total signals")
    elif t == "error":
        print(f"[ERROR] {event['message']}")
