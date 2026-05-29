const TEAM_VALUES = [
  { title: 'Speed', desc: 'Signals are detected and scored in under 30 seconds. No manual research, no waiting.' },
  { title: 'Accuracy', desc: 'Claude Opus extracts only real, evidence-backed signals. No fabricated leads.' },
  { title: 'Automation', desc: 'The entire pipeline from scan to CRM push runs without human intervention.' },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="container">

        <div className="about-header">
          <p className="section-eyebrow">About</p>
          <h1 className="about-title">Built for competitive GTM teams</h1>
          <p className="about-sub">
            Vanta is an autonomous AI agent that monitors the open web for competitor
            dissatisfaction signals and converts them into qualified pipeline — automatically.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-section-card">
            <h2 className="about-section-title">The Problem</h2>
            <p className="about-section-text">
              In competitive SaaS markets, timing is everything. When a competitor's customer
              posts frustration on Reddit, asks for alternatives on G2, or leaves a scathing
              review on Glassdoor — that is a high-intent buying signal. Sales teams miss these
              signals because monitoring the entire open web manually is impossible at scale.
            </p>
          </div>

          <div className="about-section-card">
            <h2 className="about-section-title">The Solution</h2>
            <p className="about-section-text">
              Vanta uses Bright Data's web infrastructure to continuously scan Reddit,
              G2, Glassdoor, Trustpilot, Hacker News, and LinkedIn. Claude Opus scores every
              signal for switch intent and generates personalized battle cards. Qualified leads
              are pushed directly to HubSpot CRM with full context attached.
            </p>
          </div>
        </div>

        <div className="about-values">
          {TEAM_VALUES.map((v) => (
            <div key={v.title} className="about-value-card">
              <h3 className="about-value-title">{v.title}</h3>
              <p className="about-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-tech-section">
          <h2 className="about-section-title" style={{ marginBottom: '1.5rem' }}>Technology Stack</h2>
          <div className="tech-table">
            <div className="tech-row"><span className="tech-key">Frontend</span><span className="tech-val">React 19, Vite, Recharts, React Router</span></div>
            <div className="tech-row"><span className="tech-key">Backend</span><span className="tech-val">Python, FastAPI, PostgreSQL (Supabase)</span></div>
            <div className="tech-row"><span className="tech-key">AI Model</span><span className="tech-val">Anthropic Claude Opus via AIML API</span></div>
            <div className="tech-row"><span className="tech-key">Data Layer</span><span className="tech-val">Bright Data MCP Server, SERP API, Web Unlocker, Scraping Browser</span></div>
            <div className="tech-row"><span className="tech-key">CRM</span><span className="tech-val">HubSpot Deals API</span></div>
            <div className="tech-row"><span className="tech-key">Streaming</span><span className="tech-val">Server-Sent Events (SSE) for real-time agent activity feed</span></div>
          </div>
        </div>

        <div className="about-built-for">
          <p className="about-built-text">
            Built for the <strong>LabLab AI Hackathon</strong> — Bright Data AI Agents Web Data Challenge, May 2026.
          </p>
        </div>

      </div>
    </div>
  );
}
