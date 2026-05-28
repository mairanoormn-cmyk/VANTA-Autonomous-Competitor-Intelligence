# ⚡ backend — FastAPI Application & Database Layer

This directory houses the core RESTful services, real-time event routing, database connectivity, and testing utilities.

---

## 📂 Code Structure

### 1. 📄 `main.py`
The FastAPI application serving as the primary REST gateway. It contains the following routes:
* **`POST /api/scan`**: Launches a search job, triggers the `run_agent_stream` generator, and feeds SSE chunks (real-time stream) to the frontend client.
* **`GET /api/status/{job_id}`**: Retrieves the live execution percentage and stage (e.g. `SCANNING_SERP`, `SCORING`, `COMPLETED`).
* **`GET /api/signals`**: Fetches detected competitor-vulnerable company profiles, sorted by priority/intent score.
* **`POST /api/battlecard`**: Triggers Gemini to generate a battlecard (tactics, emails, and objections) for a specific signal ID.
* **`POST /api/push-crm`**: Marks a deal in the DB and connects to the active HubSpot deals pipeline.
* **`GET /api/competitor-stats`**: Aggregates live database statistics to build the Weekly Competitor Health Dashboard index on the landing page.

### 2. 📄 `database.py`
Manages connections to **Supabase PostgreSQL** via psycopg2:
* **Relational Schema**: Builds the linked `scan_jobs` and `signals` tables.
* **Initialization**: Initializes PostgreSQL schemas automatically on server startup.
* **Query Cursors**: Implements dictionary cursor formatting (`RealDictCursor`) and sanitizes inputs with SQL parameterization `%s`.

---

## 🚀 Running the Server Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the FastAPI development server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

---

## 🧪 Testing Scripts

* **`test_agent.py`**: Executes an end-to-end command-line test of the scraper loop, LLM correlation engine, and Supabase PostgreSQL persistence (simulating the full SSE event lifecycle).
  ```bash
  python test_agent.py
  ```
