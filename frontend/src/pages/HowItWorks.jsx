const STEPS = [
  {
    number: '01',
    title: 'User Initiates a Scan',
    desc: 'The user enters a competitor name — such as Salesforce or Zendesk — into the dashboard. The frontend sends a POST request to the FastAPI backend, which creates a scan job in PostgreSQL and opens a Server-Sent Events stream back to the browser.',
  },
  {
    number: '02',
    title: 'Bright Data MCP Server (Primary Path)',
    desc: "The agent connects to Bright Data's hosted MCP Server via SSE transport. It uses three native tools: search_engine for Google SERP queries, web_data_reddit_posts for structured Reddit data, and scrape_as_markdown for G2 and Trustpilot reviews. This is the primary data collection path.",
  },
  {
    number: '03',
    title: 'Fallback: Multi-Source Scraper Pipeline',
    desc: 'If MCP is unavailable, the agent falls back to a local pipeline. It fires eight targeted Google searches via Bright Data SERP API across Reddit, G2, Glassdoor, Trustpilot, and Hacker News, then scrapes the top results using Web Unlocker and Scraping Browser.',
  },
  {
    number: '04',
    title: 'AI Intent Scoring',
    desc: 'All scraped content is passed to Claude Opus via AIML API with a structured prompt. The model extracts company names, sizes, industries, pain points, and evidence quotes — then assigns each lead an intent score from 1 to 10 based on how close they are to switching.',
  },
  {
    number: '05',
    title: 'Signals Saved to PostgreSQL',
    desc: 'Extracted signals are persisted to a Supabase PostgreSQL database linked to the scan job. The frontend receives signals in real time via the SSE stream and displays them sorted by intent score.',
  },
  {
    number: '06',
    title: 'Battle Card Generation',
    desc: "When a user clicks a signal, they can generate a battle card. Claude Opus produces a personalized outbound email, four GTM talking points, and an objection handling guide — all tailored to the specific company's pain point and competitor context.",
  },
  {
    number: '07',
    title: 'Lead Enrichment',
    desc: 'The Find Contacts feature uses Bright Data SERP to search for real decision makers at companies in the same industry. For real company names, it also scrapes the company website. Claude Opus extracts and structures the contact information.',
  },
  {
    number: '08',
    title: 'CRM Push',
    desc: 'One click pushes the lead as a deal to HubSpot CRM via the HubSpot Deals API. The deal includes the company name, pain point, source evidence, and battle card. If no HubSpot token is configured, the system simulates the push in sandbox mode.',
  },
];

const TECH = [
  { name: 'React + Vite',           role: 'Frontend SPA with SSE streaming and real-time UI updates' },
  { name: 'FastAPI',                role: 'Python backend with async SSE endpoint and REST API routes' },
  { name: 'PostgreSQL (Supabase)',  role: 'Persistent storage for scan jobs, signals, and battle cards' },
  { name: 'Bright Data MCP Server', role: 'Primary agent path — search_engine, web_data_reddit_posts, scrape_as_markdown' },
  { name: 'Bright Data SERP API',   role: 'Google search results across Reddit, G2, Glassdoor, and more (fallback)' },
  { name: 'Bright Data Web Unlocker', role: 'General page scraping bypassing bot protection (fallback)' },
  { name: 'Bright Data Scraping Browser', role: 'JS-rendered page scraping for G2, Glassdoor, Trustpilot (fallback)' },
  { name: 'Claude Opus (AIML API)', role: 'Intent scoring, signal extraction, battle card generation, lead enrichment' },
  { name: 'HubSpot CRM API',        role: 'Deal creation and pipeline push for qualified leads' },
];

export default function HowItWorks() {
  return (
    <div className="hiw-page">
      <div className="container">

        {/* Header */}
        <div className="hiw-header">
          <p className="section-eyebrow">Architecture</p>
          <h1 className="hiw-title">How Vanta Works</h1>
          <p className="hiw-sub">
            A full walkthrough of the autonomous agent pipeline — from competitor name to CRM deal.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="arch-diagram">
          <div className="arch-box arch-box-user">User Dashboard</div>
          <div className="arch-arrow">→</div>
          <div className="arch-box arch-box-api">FastAPI Backend</div>
          <div className="arch-arrow">→</div>
          <div className="arch-box arch-box-agent">Agent Orchestrator<br /><span>Claude Opus</span></div>
          <div className="arch-arrow">→</div>
          <div className="arch-box arch-box-data">Bright Data<br /><span>MCP / SERP / LinkedIn</span></div>
          <div className="arch-arrow arch-arrow-down">↓</div>
          <div className="arch-box arch-box-db">PostgreSQL<br /><span>Supabase</span></div>
          <div className="arch-arrow arch-arrow-down">↓</div>
          <div className="arch-box arch-box-crm">HubSpot CRM</div>
        </div>

        {/* Steps */}
        <div className="hiw-steps">
          {STEPS.map((step) => (
            <div key={step.number} className="hiw-step">
              <div className="hiw-step-number">{step.number}</div>
              <div className="hiw-step-content">
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="hiw-tech-section">
          <h2 className="hiw-tech-title">Technology Stack</h2>
          <div className="hiw-tech-grid">
            {TECH.map((t) => (
              <div key={t.name} className="hiw-tech-card">
                <div className="hiw-tech-name">{t.name}</div>
                <div className="hiw-tech-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
