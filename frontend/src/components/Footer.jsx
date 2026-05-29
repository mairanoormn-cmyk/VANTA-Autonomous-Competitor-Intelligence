import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-brand-col">
          <div className="footer-brand">
            <img src={logo} alt="Vanta" className="footer-logo" />
            <span className="footer-name">Vanta</span>
          </div>
          <p className="footer-tagline">
            Autonomous GTM intelligence that turns competitor frustration into your pipeline.
          </p>
        </div>

        {/* Product links */}
        <div className="footer-col">
          <p className="footer-col-title">Product</p>
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
          <Link to="/about" className="footer-link">About</Link>
        </div>

        {/* Technology links */}
        <div className="footer-col">
          <p className="footer-col-title">Technology</p>
          <a href="https://brightdata.com" target="_blank" rel="noreferrer" className="footer-link">Bright Data</a>
          <a href="https://aimlapi.com" target="_blank" rel="noreferrer" className="footer-link">AIML API</a>
          <a href="https://hubspot.com" target="_blank" rel="noreferrer" className="footer-link">HubSpot CRM</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Vanta. Built for the LabLab AI Hackathon.</p>
      </div>
    </footer>
  );
}
