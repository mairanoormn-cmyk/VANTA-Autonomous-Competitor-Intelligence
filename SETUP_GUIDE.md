# 🚀 VANTA PROJECT - COMPLETE SETUP & DEPLOYMENT GUIDE

**Status**: ✅ All critical issues fixed | Project ready for deployment

---

## 📋 What Was Fixed

### 🔴 CRITICAL FIXES (Blocking Issues - Now Resolved)
1. ✅ **Cleaned Dependency Stack** - Pruned unused/heavy packages (`cognee`, `asyncio-contextmanager`) to prevent Vercel build/size failures while retaining primary MCP SSE client.
2. ✅ **requirements.txt** - Added missing required runtime packages: `mcp`, `aiohttp`, `anyio>=4.0.0` (fixing critical subtyping errors in the MCP SDK).
3. ✅ **database.py** - Added error handling for PostgreSQL connection failures on startup to prevent backend crash.
4. ✅ **frontend/.env.local** - Created with proper local/production API routing parameters.

### 🟠 VERIFIED (Already Working)
- ✅ `scrape_js_site()` - Async function for JavaScript-heavy sites (G2, Glassdoor, Trustpilot)
- ✅ `search_web_async()` - Async wrapper for SERP searches
- ✅ `agent_orchestrator.py` - Complete with MCP path and fallback pipeline
- ✅ `main.py` - All endpoints properly implemented
- ✅ `Dashboard.jsx` - Vulnerability Radar and ROI Panel components ready

---

## 🛠️ SETUP INSTRUCTIONS

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL or Supabase database
- Bright Data API account
- AIML API key (for Claude Opus access)
- Optional: HubSpot CRM token, TriggerWare API key, Cognee account

---

### **STEP 1: Backend Setup**

#### 1.1 - Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 1.2 - Create `.env` file
Copy `backend/.env.example` to `backend/.env` and fill in your credentials:

```env
# Bright Data API Config
BRIGHT_DATA_API_KEY=your_key_here
BRIGHT_DATA_SERP_ZONE=serp_api2
BRIGHT_DATA_UNLOCKER_ZONE=web_unlocker1
BRIGHT_DATA_SB_ZONE=scraping_browser1

# AI Model
AIML_API_KEY=your_aiml_key_here
AIML_MODEL=anthropic/claude-opus-4-8

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vanta

# Optional: HubSpot CRM
HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here

# Optional: TriggerWare Workflows
TRIGGWARE_API_KEY=your_triggware_key_here
```

#### 1.3 - Initialize Database
```bash
python -c "import database; database.init_db()"
# Output should show: ✅ PostgreSQL Database initialized successfully.
```

#### 1.4 - Start Backend API
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
# API will be available at: http://localhost:8000
# Swagger docs at: http://localhost:8000/docs
```

---

### **STEP 2: Frontend Setup**

#### 2.1 - Install Dependencies
```bash
cd frontend
npm install
```

#### 2.2 - Create `.env.local` file
```env
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
```

#### 2.3 - Start Development Server
```bash
npm run dev
# Frontend will be available at: http://localhost:5173
```

---

## 🧪 TESTING

### Test Backend API
```bash
curl http://localhost:8000/
# Should return: {"message": "Vanta API v2 is running."}
```

### Test Agent Locally
```bash
cd backend
python test_agent.py
# Should stream agent events for "Salesforce" competitor analysis
```

### Test Frontend
Open `http://localhost:5173` in browser and:
1. Enter a competitor name (e.g., "Salesforce", "HubSpot")
2. Click "Run Scan"
3. Watch real-time SSE events stream in
4. Review extracted signals with intent scores
5. Generate battle cards
6. Check ROI metrics

---

## 📊 8 FEATURES CHECKLIST

### Feature 1: Bright Data MCP Server Integration ✅
- **Status**: Implemented in `agent_orchestrator.py`
- **Test**: Run scan with no BRIGHT_DATA_API_KEY in fallback mode
- **Prize**: Main Track Prize ($700)

### Feature 2: Scraping Browser for JS Sites ✅
- **Status**: Implemented as `scrape_js_site()` in `bright_data_utils.py`
- **Test**: Scan targets G2.com, Glassdoor, Trustpilot URLs
- **Prize**: Main Track Prize ($700)

### Feature 3: Cognee Agent Memory (Roadmap Extension)
- **Status**: Explored during architecture planning. Excluded from core build to keep the dependency footprint Vercel-serverless compatible (avoiding heavy ML graph/vector packages).
- **Implementation**: Can be added as a separate memory service using Cognee's API or cloud database.
- **Prize Category**: Cognee Partner Prize ($500 Amazon + $2,400 credits)

### Feature 4: LinkedIn Hiring Signals ✅
- **Status**: Implemented via Google SERP alternative searches in `agent_orchestrator.py`.
- **Implementation**: Fallback query scans LinkedIn URLs for companies looking for alternatives or evaluating migrators.
- **Prize Category**: Main Track Prize

### Feature 5: TriggerWare Workflows (Roadmap Extension)
- **Status**: Conceptualized for webhook-based downstream routing.
- **Implementation**: Can be added by piping scan completions to TriggerWare hooks.
- **Prize Category**: TriggerWare Partner Prize ($300 Amazon)

### Feature 6: Multi-Source Signal Fusion ✅
- **Status**: Implemented in prompt instruction in `agent_orchestrator.py` where Claude Opus fuses multiple mentions and context clues to infer company size, industry, and exact intent score.
- **Prize Category**: Main Track Prize

### Feature 7: Vulnerability Radar Chart ✅
- **Status**: Fully implemented in `frontend/src/pages/Dashboard.jsx`
- **Display**: 5-dimension radar (Pricing, Support, Features, Hiring, Sentiment)
- **Prize**: Demo Polish Score

### Feature 8: ROI Calculator Panel ✅
- **Status**: Fully implemented in `frontend/src/pages/Dashboard.jsx`
- **Metrics**: Pipeline value, hours saved, ROI%, high-intent leads
- **Prize**: Business Value Score

---

## 🔌 API ENDPOINTS

### Core Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/scan` | Start competitor scan (SSE stream) |
| GET | `/api/status/{job_id}` | Get scan status/progress |
| GET | `/api/signals` | Retrieve extracted signals |
| POST | `/api/battlecard` | Generate sales battle card |
| POST | `/api/push-crm` | Push lead to HubSpot/CRM |
| GET | `/api/competitor-stats` | Get competitor vulnerability dashboard data |
| POST | `/api/enrich` | Enrich lead with contact information |

### Expected Response Format (SSE Stream)
```json
{
  "type": "thinking",
  "message": "Initialising competitive scan for Salesforce..."
}
```

---

## 🚨 TROUBLESHOOTING

### Issue: "No API key" error
**Fix**: Check your `.env` file has `BRIGHT_DATA_API_KEY` and `AIML_API_KEY` set

### Issue: Database connection failed
**Fix**: 
1. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
2. Check PostgreSQL is running
3. Verify credentials are correct

### Issue: Frontend shows empty results
**Fix**:
1. Check browser console for CORS errors
2. Verify `VITE_API_URL` in `.env.local` matches backend URL
3. Check backend is running on port 8000

### Issue: MCP Server connection fails
**Fix**:
1. MCP is optional - fallback pipeline will activate
2. Verify `BRIGHT_DATA_API_KEY` is valid
3. Check internet connection to `https://mcp.brightdata.com/sse`

---

## 📦 DEPLOYMENT

### Production Checklist
- [ ] All 8 features tested locally
- [ ] Environment variables set correctly (.env files)
- [ ] Database migrated to production PostgreSQL/Supabase
- [ ] Frontend built: `npm run build`
- [ ] Backend CORS configured for production domain
- [ ] SSL certificates configured (HTTPS)
- [ ] Rate limiting enabled on API endpoints
- [ ] Monitoring/logging configured

### Deployment Options
1. **Heroku**: Deploy both backend and frontend separately
2. **AWS**: Backend on EC2/Lambda, Frontend on S3+CloudFront
3. **Vercel**: Frontend (Next.js compatible)
4. **Railway**: Full stack deployment
5. **Docker**: Containerize both services

---

## 📞 SUPPORT & DOCS

- **README.md**: Project overview and architecture
- **VISUAL_FLOW_GUIDE.md**: User journey states and animation timeline details
- **API Swagger Docs**: http://localhost:8000/docs (when backend running)
- **Bright Data Docs**: https://brightdata.com/products/serp-api
- **FastAPI Docs**: https://fastapi.tiangolo.com/

---

## ✨ NEXT STEPS

1. **Production Verification**: Run the verification checklist across the frontend and backend endpoints.
2. **Test All Endpoints**: Use provided curl commands or Swagger UI
3. **Optimize Performance**: Monitor SSE streams, optimize database queries
4. **Deploy**: Choose hosting platform and deploy to production
5. **Monitor**: Set up logging and error tracking (e.g., Sentry)

**Project Status**: Ready for hackathon submission! 🎉
