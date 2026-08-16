import React from 'react';
import { Heart, Code2, Sparkles, ShieldCheck, Terminal, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-creator-badge">
          <span className="creator-dot" />
          <Code2 size={16} style={{ color: 'var(--primary-light)' }} />
          <span>Designed & Engineered by <strong className="creator-name">Pravin Hajare</strong></span>
        </div>

        <p className="footer-desc">
          Full-Stack Multi-Authentication Architecture &bull; JWT &bull; Clerk &bull; Google OAuth
        </p>

        <div className="footer-tech-stack">
          <span className="tech-pill">MongoDB Atlas</span>
          <span className="tech-pill">Express.js</span>
          <span className="tech-pill">React 18</span>
          <span className="tech-pill">JSON Web Tokens</span>
          <span className="tech-pill">Vite</span>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Pravin Hajare. All rights reserved.</span>
          <div className="footer-links">
            <span className="build-tag">
              <Sparkles size={12} style={{ color: 'var(--secondary)' }} />
              Production Ready Auth Suite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
