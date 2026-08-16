import React from 'react';
import { Sparkles, Shield, UserCheck, Key, CheckCircle, Code, Layers, Zap } from 'lucide-react';

export const ClerkView = () => {
  return (
    <div className="provider-preview-container">
      <div className="glass-panel provider-hero">
        <div className="provider-hero-icon clerk">
          <Sparkles size={32} />
        </div>
        <div className="badge-preview" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
          Authentication Strategy 2
        </div>
        <h3>Clerk Managed Authentication</h3>
        <p>
          Clerk provides complete drop-in UI components, session management, multi-factor authentication (MFA), passwordless logins, and social connection integrations.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h4><Zap size={18} style={{ color: '#818cf8' }} /> Drop-in UI Components</h4>
            <p>Pre-styled, accessible, and responsive <code>&lt;SignIn /&gt;</code> and <code>&lt;SignUp /&gt;</code> components.</p>
          </div>

          <div className="feature-card">
            <h4><Shield size={18} style={{ color: '#10b981' }} /> Built-in Security</h4>
            <p>Automated bot detection, rate limiting, breached password screening, and session revocation.</p>
          </div>

          <div className="feature-card">
            <h4><Layers size={18} style={{ color: '#06b6d4' }} /> JWT Verification Backend</h4>
            <p>Backend validates short-lived asymmetric RS256 session tokens with Clerk's public JSON Web Key Set (JWKS).</p>
          </div>
        </div>

        <div className="glass-panel blueprint-card" style={{ textAlign: 'left' }}>
          <h4><Code size={20} style={{ color: 'var(--primary-light)' }} /> Implementation Blueprint for Next Phase</h4>
          <div className="step-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Clerk Project Credentials</strong>
                <p>Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> and backend <code>CLERK_SECRET_KEY</code> to environment configs.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Frontend Provider Setup</strong>
                <p>Wrap the React tree with <code>&lt;ClerkProvider publishableKey=...&gt;</code> for reactive state hooks.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Backend Verification Middleware</strong>
                <p>Integrate <code>@clerk/express</code> or verify session tokens using Clerk SDK to sync user data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
