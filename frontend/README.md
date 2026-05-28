# 💻 frontend — React Dashboard & Client Interface

This directory houses the React single-page application built on Vite and designed with a premium, glassmorphic dark-theme design.

---

## 🎨 Design System & Aesthetics
* **Theme**: Glassmorphism (semi-transparent container cards with backdrop blur, fine border highlights, and glowing neon accents).
* **Colors**: Curated dark HSL palette with a bright neon violet/magenta indicator highlight.
* **Typography**: Modern font stack using Google Fonts **Outfit** (headings) and **Inter** (body text/logs).
* **Micro-Animations**: Real-time heartbeat/pulse scan dots, progress line keyframes, hover card transitions, and slide-in drawer layouts.

---

## 📂 Code Structure

### 📄 `src/App.jsx`
Contains the entire UI view state manager:
1. **Landing View**:
   * **Vulnerability Index Table**: Aggregates live data from `/api/competitor-stats` to display competitor risk levels (Critical, High, Moderate, Low), active leads counts, and trends.
   * **Search Bar**: Quick entry to launch competitor scans.
   * **Workflow Cards**: Direct step-by-step guides visualizing the MCP/Bright Data architecture.
2. **Workspace View**:
   * **Left Panel (Activity Feed)**: Lists live agent execution logs (SSE stream updates) with detailed icon markers.
   * **Right Panel (Intent Signal Cards)**: Displays extracted prospects sorted dynamically by intent score (1-10).
   * **Side Drawer**: Opens the review panel where users can trigger Gemini battle tactics, customize cold outreach emails, and push the lead as a HubSpot CRM deal.

### 📄 `src/index.css`
Houses the CSS tokens, utility variables, layouts, scrollbars, responsive rules, and keyframes.

---

## 🚀 Running the Client Locally

1. Install Node.js dependencies:
   ```bash
   npm install
   ```
2. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
3. Open **`http://localhost:5173/`** in your browser.
