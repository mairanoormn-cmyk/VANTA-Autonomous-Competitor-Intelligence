import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/',            label: 'Home' },
    { to: '/dashboard',   label: 'Dashboard' },
    { to: '/how-it-works',label: 'How It Works' },
    { to: '/about',       label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Vanta" className="nav-logo" />
          <span className="nav-name">Vanta</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${isActive(l.to) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="nav-actions">
          <button
            className="nav-cta"
            onClick={() => navigate('/dashboard')}
          >
            Launch Scanner
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-mobile-link ${isActive(l.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="nav-cta mobile"
            onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
          >
            Launch Scanner
          </button>
        </div>
      )}
    </nav>
  );
}
