import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLES = ['Salesforce', 'HubSpot', 'SAP', 'Zendesk', 'Oracle', 'Pipedrive'];

const STATS = [
  { value: '10,000+', label: 'Signals Detected' },
  { value: '94%',     label: 'Intent Accuracy' },
  { value: '3x',      label: 'Pipeline Velocity' },
  { value: '<30s',    label: 'Scan Time' },
];

const FEATURES = [
  {
    title: 'Live Web Intelligence',
    desc: 'Bright Data SERP and Web Unlocker APIs fire parallel searches across Reddit, G2, Glassdoor, Trustpilot, and Hacker News in real time.',
  },
  {
    title: 'AI Intent Scoring',
    desc: 'Claude Opus reads every scraped page, extracts company names, and scores each lead 1–10 for switch intent with evidence quotes.',
  },
  {
    title: 'Battle Card Generation',
    desc: 'One click generates a personalized outbound email, GTM talking points, and objection handling guide tailored to each lead.',
  },
  {
    title: 'CRM Push',
    desc: 'Qualified leads are pushed directly to HubSpot as deals with full context — pain point, source, and AI-generated battle card attached.',
  },
  {
    title: 'Bright Data MCP Server',
    desc: 'Primary data collection via Bright Data MCP Server — search_engine, web_data_reddit_posts, and scrape_as_markdown tools run natively in the agent loop.',
  },
  {
    title: 'Vulnerability Radar',
    desc: 'Interactive radar chart tracks competitor health across five dimensions: Pricing, Support, Features, Hiring, and Sentiment.',
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const startScan = (competitor) => {
    if (competitor.trim()) {
      navigate('/dashboard', { state: { competitor: competitor.trim() } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startScan(query);
  };

  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Autonomous AI Agent</div>

          <h1 className="hero-title">
            Turn competitor frustration<br />
            into <span className="text-gradient">qualified pipeline</span>
          </h1>

          <p className="hero-subtitle">
            Vanta monitors the open web for competitor weakness signals,
            scores intent with AI, and delivers ready-to-send battle cards directly
            into your CRM — fully automated.
          </p>

          <form className="hero-form" onSubmit={handleSubmit}>
            <div className="hero-input-wrap">
              <svg className="hero-input-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                className="hero-input"
                placeholder="Enter a competitor name — e.g. Salesforce, Zendesk"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button className="hero-btn" type="submit" disabled={!query.trim()}>
                Run Scan
              </button>
            </div>
          </form>

          <div className="hero-examples">
            <span className="examples-label">Popular targets</span>
            <div className="examples-row">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  className="example-chip"
                  type="button"
                  onClick={() => startScan(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-block">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Workflow</p>
            <h2 className="section-title">Three steps from signal to deal</h2>
            <p className="section-sub">
              The entire pipeline runs autonomously. You review leads and push to CRM.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Detect</h3>
              <p className="step-desc">
                Bright Data SERP API fires parallel Google searches for competitor
                complaints, alternatives, and pricing frustrations across Reddit,
                G2, Glassdoor, and Hacker News.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Score</h3>
              <p className="step-desc">
                Claude Opus reads every scraped page, extracts company names,
                and scores each lead 1–10 for switch intent with direct evidence
                quotes from the source.
              </p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Push</h3>
              <p className="step-desc">
                AI generates a personalized outbound email and battle card for
                each lead. One click pushes the deal and full context directly
                to HubSpot CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Capabilities</p>
            <h2 className="section-title">Everything your GTM team needs</h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-title">Ready to find your next customer?</h2>
            <p className="cta-sub">
              Enter any competitor name and watch the agent work in real time.
            </p>
            <button
              className="hero-btn large"
              onClick={() => navigate('/dashboard')}
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
