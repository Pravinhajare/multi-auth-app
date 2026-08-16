import React from 'react';
import { Globe2, Shield, Lock, ArrowRightLeft, Code, Database, Key } from 'lucide-react';

export const GoogleView = () => {
  return (
    <div className="provider-preview-container">
      <div className="glass-panel provider-hero">
        <div className="provider-hero-icon google">
          <Globe2 size={32} />
        </div>
        <div className="badge-preview" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
          Authentication Strategy 3
        </div>
        <h3>Google OAuth 2.0 & OpenID Connect</h3>
        <p>
          Standard OAuth 2.0 Authorization Code Grant flow with PKCE or Google Identity Services (GSI) One-Tap login.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <h4><Key size={18} style={{ color: '#ea4335' }} /> OpenID ID Tokens</h4>
            <p>Cryptographically signed JWT containing verified profile: email, name, picture, and Google sub (ID).</p>
          </div>

          <div className="feature-card">
            <h4><ArrowRightLeft size={18} style={{ color: '#4285f4' }} /> OAuth 2.0 Flow</h4>
            <p>User consents on Google servers &rarr; auth code exchanged for tokens on backend &rarr; user logged in.</p>
          </div>

          <div className="feature-card">
            <h4><Database size={18} style={{ color: '#34a853' }} /> Account Linking</h4>
            <p>Unified database automatically links Google sub identifier with existing email records.</p>
          </div>
        </div>

        <div className="glass-panel blueprint-card" style={{ textAlign: 'left' }}>
          <h4><Code size={20} style={{ color: 'var(--primary-light)' }} /> Implementation Blueprint for Next Phase</h4>
          <div className="step-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Google Cloud Console Credentials</strong>
                <p>Configure OAuth 2.0 Client ID and Secret in Google Cloud Console with authorized origins.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Frontend Google Login Button</strong>
                <p>Integrate <code>@react-oauth/google</code> or Google Identity Services script for seamless one-tap and popups.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Backend Verification & Token Exchange</strong>
                <p>Validate Google ID tokens with <code>google-auth-library</code>, retrieve profile, and issue internal session JWT.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
