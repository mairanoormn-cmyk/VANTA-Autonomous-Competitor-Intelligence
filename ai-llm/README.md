# 🧠 ai-llm — Agent Orchestration Core

This directory contains the central brain of **The Churn Sentinel**—the autonomous B2B competitive intelligence agent. It manages LLM prompts, streams real-time execution steps, and synthesizes sales enablement assets.

---

## 📂 Code Structure

### 📄 `agent_orchestrator.py`
The main orchestrator module implementing:
1. **`run_agent_stream(competitor)`**:
   * A Python Generator yielding real-time events (`thinking`, `tool_call`, `search_result`, `scrape_result`, `signals_ready`, `complete`, `error`) to drive the Server-Sent Events (SSE) frontend feed.
   * Coordinates the multi-query Google Search strategy via Bright Data SERP.
   * Crawls search result pages using the Web Unlocker proxy.
   * Feeds raw data to **Gemini 2.5 Flash** (via the AIML API Gateway) for signal extraction and intent scoring.
2. **`generate_battlecard(signal, competitor)`**:
   * Uses Gemini to analyze an extracted customer pain point and generate a structured GTM battle card containing:
     * **Opportunity Summary**: 1-sentence sales context of the lead vulnerability.
     * **GTM Battle Tactics**: 4 specific talking points addressing competitor issues.
     * **Personalized Outbound Email**: Subject line and 3-paragraph outreach draft.
     * **Objection Handling**: Typical prospect friction and recommended response.

---

## 🎯 AI Prompts & Decision Parameters

### 1. Intent Scoring Guidance (1–10)
Gemini evaluates signal intent scores based on the following weight criteria:
* **Score 9–10 (Critical Churn)**: Verified public switch signals, such as job ads seeking administrators for competing software (*"hiring Salesforce Consultant"*), or threads explicitly stating *"we are migrating off X next month"*.
* **Score 7–8 (High Intent)**: Strong pricing/contract dissatisfaction, service outages, or user licensing cost complaints.
* **Score 5–6 (Moderate Intent)**: Technical limitations, workflow complexity complaints, or feature gap reviews.

### 2. Company Profiling & Deduplication
To prevent cold outreach to anonymous users, the prompt strictly enforces:
* **Real Company Extraction**: Must extract actual entity names (e.g., *Innovate Sales Solutions*) instead of social media usernames (e.g., *u/salesguy*).
* **Profile Resolution**: Automatically infers company size and industry based on contextual web clues.
* **Mock Lead Fallback**: If a live forum post does not explicitly name the company, the LLM generates a highly realistic, contextual company lead referencing the authentic pain point from the thread.

---

## 🔌 API Gateway Specifications
The agent connects via the standard OpenAI SDK client directed to the **AIML API Gateway**:
* **Base URL**: `https://api.aimlapi.com/v1`
* **Default Model**: `google/gemini-2.5-flash` (ensures fast tokens, parallel tool execution, and zero `thought_signature` 400 bad requests).
