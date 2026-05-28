import { useState, useEffect, useRef } from 'react';

const API = 'http://127.0.0.1:8000';

const EXAMPLES = ['Salesforce', 'HubSpot', 'SAP', 'Zendesk', 'Oracle', 'Pipedrive'];

// ── helpers ─────────────────────────────────────────────────────────────────
function getScoreClass(score) {
  if (score >= 8) return 'score-high';
  if (score >= 6) return 'score-med';
  return 'score-low';
}

function getSourceClass(src = '') {
  const s = src.toLowerCase();
  if (s.includes('reddit')) return 'src-reddit';
  if (s.includes('job') || s.includes('indeed') || s.includes('linkedin')) return 'src-job';
  if (s.includes('serp') || s.includes('google') || s.includes('search')) return 'src-serp';
  if (s.includes('g2') || s.includes('capterra') || s.includes('review') || s.includes('trustpilot')) return 'src-g2';
  return 'src-default';
}

const VULNERABILITY_DATA = [
  { name: 'Salesforce', score: 84, level: 'Critical', trigger: 'Pricing & Complexity', signals: 42, trend: 'up' },
  { name: 'HubSpot', score: 61, level: 'Moderate', trigger: 'Seat Limit Cost hikes', signals: 28, trend: 'stable' },
  { name: 'SAP', score: 79, level: 'High', trigger: 'Legacy Interface Bloat', signals: 35, trend: 'up' },
  { name: 'Zendesk', score: 53, level: 'Moderate', trigger: 'Support SLA complaints', signals: 19, trend: 'down' },
  { name: 'Oracle', score: 88, level: 'Critical', trigger: 'Cloud Migration friction', signals: 51, trend: 'up' },
  { name: 'Pipedrive', score: 38, level: 'Low', trigger: 'Feature limitations', signals: 11, trend: 'stable' },
];

// ── Landing page component ───────────────────────────────────────────────────
function Landing({ onSearch }) {
  const [value, setValue] = useState('');
  const [vulnerabilityData, setVulnerabilityData] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/competitor-stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setVulnerabilityData(data);
        }
      })
      .catch((err) => console.error("Error loading competitor stats:", err));
  }, []);

  const dataToRender = vulnerabilityData.length > 0 ? vulnerabilityData : VULNERABILITY_DATA;

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div className="landing">
      <div className="landing-logo">
        <div className="logo-shield">🛡️</div>
        <span className="logo-name">Churn Sentinel</span>
      </div>

      <h1 className="landing-tagline">
        Turn your competitor's&nbsp;
        <span>frustrated customers</span>
        &nbsp;into your pipeline
      </h1>

      <p className="landing-sub">
        Autonomous GTM intelligence that monitors the open web for competitor
        weakness signals and generates ready-to-send battle cards in real time.
      </p>

      <form className="search-form" onSubmit={submit}>
        <div className="search-row">
          <span style={{ color: '#475569', fontSize: '1rem' }}>🔍</span>
          <input
            className="search-input"
            placeholder="Enter a competitor name (e.g. Salesforce)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <button className="btn-primary" type="submit" disabled={!value.trim()}>
            <span>▶</span> Run Scan
          </button>
        </div>
      </form>

      <p className="examples-label">Popular targets</p>
      <div className="examples-grid">
        {EXAMPLES.map((ex) => (
          <button key={ex} className="example-chip" onClick={() => onSearch(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {/* Weekly Competitor Health Dashboard */}
      <div className="vulnerability-section">
        <div className="vuln-header">
          <div className="vuln-title-group">
            <h3 className="vuln-title">
              Weekly Vulnerability Index <span>Live Stats</span>
            </h3>
            <p className="vuln-sub">
              Aggregated open-web intent signals compiled over the last 7 days.
            </p>
          </div>
          <div className="vuln-time">Updated: May 2026</div>
        </div>

        <div className="vuln-table-container">
          <table className="vuln-table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Vulnerability Index</th>
                <th>Primary Trigger</th>
                <th>Active Signals</th>
                <th>Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((row) => (
                <tr key={row.name}>
                  <td>
                    <div className="vuln-competitor">
                      <span style={{ fontSize: '1rem' }}>🛡️</span>
                      {row.name}
                    </div>
                  </td>
                  <td className="vuln-score-cell">
                    <div className="vuln-score-group">
                      <span className={`vuln-score-num level-${row.level.toLowerCase()}`}>
                        {row.score}%
                      </span>
                      <div className="vuln-score-bar-bg">
                        <div
                          className={`vuln-score-bar-fill bg-${row.level.toLowerCase()}`}
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="vuln-trigger">{row.trigger}</div>
                  </td>
                  <td>
                    <span className="vuln-signals">{row.signals} leads</span>
                  </td>
                  <td>
                    <span className={`vuln-trend-${row.trend}`}>
                      {row.trend === 'up' ? 'Rising 📈' : row.trend === 'down' ? 'Declining 📉' : 'Stable ➡️'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-table-scan" onClick={() => onSearch(row.name)}>
                      Launch Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="how-it-works">
        <p className="how-title">How it works</p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-num">01 / DETECT</div>
            <div className="step-title">Live Web Search</div>
            <div className="step-desc">
              Bright Data SERP API fires parallel Google searches for competitor
              complaints, alternatives, and pricing frustrations.
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">02 / CORRELATE</div>
            <div className="step-title">AI Intent Scoring</div>
            <div className="step-desc">
              Gemini reads scraped pages via Web Unlocker, extracts company
              names, and scores each lead 1–10 for switch intent.
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">03 / PUSH</div>
            <div className="step-title">Battle Card → CRM</div>
            <div className="step-desc">
              AI generates a personalized outbound email for each lead.
              One click pushes the deal and battle card directly to HubSpot.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// ── Activity item renderer ───────────────────────────────────────────────────
function ActivityItem({ item }) {
  const { type, message, tool, query, url, count, urls, preview, chars, total_signals } = item;

  if (type === 'thinking') {
    return (
      <div className="activity-item thinking">
        <span className="activity-icon">💭</span>
        <span className="activity-text">{message}</span>
      </div>
    );
  }

  if (type === 'tool_call') {
    if (tool === 'search_web') {
      return (
        <div className="activity-item search">
          <span className="activity-icon">🔍</span>
          <span className="activity-text">
            search_web("{query}")
          </span>
        </div>
      );
    }
    if (tool === 'scrape_url') {
      return (
        <div className="activity-item scrape">
          <span className="activity-icon">📄</span>
          <span className="activity-text">
            scrape_url(...)
            <span className="activity-subtext">{url}</span>
          </span>
        </div>
      );
    }
  }

  if (type === 'search_result') {
    return (
      <div className="activity-item result">
        <span className="activity-icon">✓</span>
        <span className="activity-text">
          {count} results returned
          {urls && urls.length > 0 && (
            <span className="activity-subtext">{urls[0]}</span>
          )}
        </span>
      </div>
    );
  }

  if (type === 'scrape_result') {
    return (
      <div className="activity-item result">
        <span className="activity-icon">✓</span>
        <span className="activity-text">
          {chars > 0 ? `${chars.toLocaleString()} chars scraped` : 'Scrape failed'}
          {preview && chars > 0 && (
            <span className="activity-subtext">{preview.slice(0, 120)}…</span>
          )}
        </span>
      </div>
    );
  }

  if (type === 'signals_ready') {
    return (
      <div className="activity-item signal">
        <span className="activity-icon">🎯</span>
        <span className="activity-text">
          {total_signals ?? item.signals?.length ?? 0} intent signals extracted
        </span>
      </div>
    );
  }

  if (type === 'complete') {
    return (
      <div className="activity-item complete">
        <span className="activity-icon">✅</span>
        <span className="activity-text">
          Scan complete — {total_signals} opportunities found
        </span>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="activity-item error">
        <span className="activity-icon">⚠</span>
        <span className="activity-text">{message}</span>
      </div>
    );
  }

  return null;
}

// ── Battle card drawer ───────────────────────────────────────────────────────
function Drawer({ signal, competitor, onClose, onPushed }) {
  const [battlecard, setBattlecard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushed, setPushed] = useState(signal.is_pushed === 1);

  // Parse saved battlecard if exists
  useEffect(() => {
    if (signal.battlecard) {
      try {
        const bc = typeof signal.battlecard === 'string'
          ? JSON.parse(signal.battlecard)
          : signal.battlecard;
        setBattlecard(bc);
      } catch (_) {}
    }
    setPushed(signal.is_pushed === 1);
  }, [signal]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/battlecard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_id: signal.id }),
      });
      const data = await res.json();
      setBattlecard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const push = async () => {
    setPushing(true);
    try {
      await fetch(`${API}/api/push-crm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_id: signal.id }),
      });
      setPushed(true);
      onPushed(signal.id);
    } catch (err) {
      console.error(err);
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="drawer">
      {/* Header */}
      <div className="drawer-header">
        <div>
          <div className="drawer-company">{signal.company_name}</div>
          <div className="drawer-meta">
            {signal.industry} · {signal.company_size} · Score {signal.intent_score}/10
          </div>
        </div>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <div className="drawer-body">
        {/* Source */}
        <div>
          <div className="drawer-section-label">Source Signal</div>
          <div className="source-box">
            <strong style={{ color: 'var(--text-primary)' }}>{signal.source}</strong>
            {signal.source_url && (
              <>
                <br />
                <a
                  href={signal.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="source-url-link"
                >
                  {signal.source_url}
                </a>
              </>
            )}
            <br /><br />
            "{signal.raw_text}"
          </div>
        </div>

        {/* Pain point */}
        <div>
          <div className="drawer-section-label">Pain Point</div>
          <div className="pain-tags">
            <span className="pain-tag">{signal.pain_point}</span>
          </div>
        </div>

        {!battlecard ? (
          <div className="no-battlecard">
            <div className="no-battlecard-icon">⚡</div>
            <h4>No Battle Card yet</h4>
            <p>Generate a personalized outbound email and talking points powered by Gemini AI.</p>
            <button className="btn-generate" onClick={generate} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                  Generating with Gemini…
                </>
              ) : (
                <>✨ Generate Battle Card</>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div>
              <div className="drawer-section-label">Opportunity Summary</div>
              <div className="source-box">{battlecard.summary}</div>
            </div>

            {/* Talking points */}
            {battlecard.talking_points?.length > 0 && (
              <div>
                <div className="drawer-section-label">GTM Battle Tactics</div>
                <div className="talking-points">
                  {battlecard.talking_points.map((pt, i) => (
                    <div key={i} className="talking-point">
                      <div className="tp-bullet">▸</div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            {battlecard.email_pitch && (
              <div>
                <div className="drawer-section-label">Personalized Outbound Email</div>
                <div className="email-box">
                  <div className="email-header-row">
                    <span>Subject:</span>
                    <span className="email-subject">{battlecard.email_pitch.subject}</span>
                  </div>
                  <textarea
                    className="email-body-ta"
                    defaultValue={battlecard.email_pitch.body}
                    rows={6}
                  />
                </div>
              </div>
            )}

            {/* Push CTA */}
            <button
              className={`btn-push ${pushed ? 'pushed' : ''}`}
              onClick={push}
              disabled={pushing || pushed}
            >
              {pushed
                ? '✓ Pushed to HubSpot CRM'
                : pushing
                ? 'Pushing…'
                : '🚀 Push to HubSpot CRM'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Workspace component ──────────────────────────────────────────────────────
function Workspace({ competitor, onBack }) {
  const [activity, setActivity] = useState([]);
  const [signals, setSignals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ searches: 0, scrapes: 0, tool_calls: 0 });
  const [newQuery, setNewQuery] = useState('');
  const [toast, setToast] = useState(null);
  const feedRef = useRef(null);
  const abortRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-scroll activity feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activity]);

  // Start scan on mount
  useEffect(() => {
    runScan(competitor);
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, []);

  const runScan = async (comp) => {
    setScanning(true);
    setDone(false);
    setActivity([]);
    setSignals([]);
    setSelected(null);
    setStats({ searches: 0, scrapes: 0, tool_calls: 0 });

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let searches = 0, scrapes = 0, tools = 0;

    try {
      const res = await fetch(`${API}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitor: comp }),
        signal: ctrl.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          let event;
          try { event = JSON.parse(raw); } catch (_) { continue; }

          const t = event.type;

          if (t === 'stream_end' || t === 'done') { setScanning(false); setDone(true); continue; }
          if (t === 'job_created') continue;

          // Update stats
          if (t === 'tool_call') {
            tools++;
            if (event.tool === 'search_web') searches++;
            if (event.tool === 'scrape_url') scrapes++;
            setStats({ searches, scrapes, tool_calls: tools });
          }
          if (t === 'signals_ready' && event.signals) {
            setSignals(event.signals.map((s, i) => ({ ...s, id: s.id ?? i + 1 })));
          }
          if (t === 'complete') { setScanning(false); setDone(true); }

          setActivity((prev) => [...prev, event]);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setActivity((prev) => [...prev, { type: 'error', message: String(err) }]);
      }
    } finally {
      setScanning(false);
      setDone(true);
    }
  };

  const handleNewScan = (e) => {
    e.preventDefault();
    if (newQuery.trim()) {
      runScan(newQuery.trim());
      setNewQuery('');
    }
  };

  // Reload signals from DB after scan completes (picks up IDs)
  useEffect(() => {
    if (done && signals.length > 0) {
      fetch(`${API}/api/signals?competitor=${encodeURIComponent(competitor)}`)
        .then((r) => r.json())
        .then((data) => { if (data?.length > 0) setSignals(data); })
        .catch(() => {});
    }
  }, [done]);

  const handlePushed = (signalId) => {
    setSignals((prev) => prev.map((s) => s.id === signalId ? { ...s, is_pushed: 1 } : s));
    showToast('Lead successfully pushed to HubSpot CRM!');
  };

  return (
    <div className="workspace">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.type === 'error' ? '⚠' : '✓'} {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="workspace-topbar">
        <div className="topbar-logo" onClick={onBack} title="Back to home">
          <div className="topbar-logo-icon">🛡️</div>
          <span className="topbar-logo-text">Churn Sentinel</span>
        </div>

        <form className="topbar-search" onSubmit={handleNewScan}>
          <span style={{ color: '#475569', fontSize: '0.85rem' }}>🔍</span>
          <input
            className="topbar-input"
            placeholder="Scan new competitor…"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            disabled={scanning}
          />
          <button className="btn-scan" type="submit" disabled={scanning || !newQuery.trim()}>
            ▶ Scan
          </button>
        </form>

        <div className="stats-bar">
          <div className="stat-item">
            🔍 <span className="stat-value">{stats.searches}</span> searches
          </div>
          <div className="stat-item">
            📄 <span className="stat-value">{stats.scrapes}</span> scraped
          </div>
          <div className="stat-item">
            ⚙ <span className="stat-value">{stats.tool_calls}</span> tool calls
          </div>
        </div>
      </div>

      {/* Progress line */}
      <div className={`progress-line ${scanning ? 'active' : ''}`}>
        {scanning && <div className="progress-line-fill" />}
      </div>

      {/* Body */}
      <div className="workspace-body">
        {/* LEFT — Activity feed */}
        <div className="activity-panel">
          <div className="panel-header">
            <div className="panel-header-title">
              <div className={`pulse-dot ${scanning ? '' : 'idle'}`} />
              Agent Activity
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Target: <strong style={{ color: 'var(--purple-light)' }}>{competitor}</strong>
            </span>
          </div>

          {activity.length === 0 ? (
            <div className="activity-empty">
              <div className="activity-empty-icon">⚡</div>
              <div>Starting agent loop…</div>
            </div>
          ) : (
            <div className="activity-feed" ref={feedRef}>
              {activity.map((item, i) => (
                <ActivityItem key={i} item={item} />
              ))}
              {scanning && (
                <div className="activity-item thinking" style={{ gap: '0.5rem' }}>
                  <div className="spinner" />
                  <span>Agent working…</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Signals + Drawer */}
        <div className="signals-panel">
          <div className="signals-header">
            <div className="signals-title">
              Competitor Intent Signals
              <span className="count-badge">{signals.length}</span>
            </div>
            {signals.filter((s) => s.intent_score >= 8).length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
                🔴 {signals.filter((s) => s.intent_score >= 8).length} high-intent
              </span>
            )}
          </div>

          <div className={`signals-inner ${selected ? 'drawer-open' : ''}`}>
            {/* Table */}
            <div className="signals-table-wrap">
              {signals.length === 0 ? (
                <div className="signals-empty">
                  <div className="signals-empty-icon">📡</div>
                  <h3>{scanning ? 'Scanning open web…' : 'No signals yet'}</h3>
                  <p>
                    {scanning
                      ? 'Bright Data is scraping Google, forums, and job boards for live signals.'
                      : 'Enter a competitor name and click Run Scan to begin.'}
                  </p>
                </div>
              ) : (
                signals
                  .slice()
                  .sort((a, b) => b.intent_score - a.intent_score)
                  .map((sig, idx) => (
                    <div
                      key={sig.id ?? idx}
                      className={`signal-card ${selected?.id === sig.id ? 'active' : ''}`}
                      onClick={() => setSelected(sig)}
                    >
                      <div className={`score-badge ${getScoreClass(sig.intent_score)}`}>
                        {sig.intent_score}
                      </div>

                      <div className="signal-body">
                        <div className="signal-company">{sig.company_name}</div>
                        <div className="signal-meta">
                          <span className={`source-tag ${getSourceClass(sig.source)}`}>
                            {sig.source}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {sig.industry} · {sig.company_size}
                          </span>
                        </div>
                        <div className="signal-pain">{sig.pain_point}</div>
                        {sig.raw_text && (
                          <div className="signal-snippet">"{sig.raw_text}"</div>
                        )}
                      </div>

                      <div className="signal-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`btn-review ${sig.is_pushed ? 'pushed' : ''}`}
                          onClick={() => setSelected(sig)}
                        >
                          {sig.is_pushed ? '✓ Pushed' : '⚡ Review'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Battle card drawer */}
            {selected && (
              <Drawer
                key={selected.id}
                signal={selected}
                competitor={competitor}
                onClose={() => setSelected(null)}
                onPushed={handlePushed}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('landing');   // 'landing' | 'workspace'
  const [competitor, setCompetitor] = useState('');

  const startScan = (comp) => {
    setCompetitor(comp);
    setView('workspace');
  };

  if (view === 'workspace') {
    return <Workspace competitor={competitor} onBack={() => setView('landing')} />;
  }

  return <Landing onSearch={startScan} />;
}
