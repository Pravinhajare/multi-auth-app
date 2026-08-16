import React from 'react';
import { KeyRound, Sparkles, Globe2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthSelector = () => {
  const { selectedStrategy, setSelectedStrategy, user } = useAuth();

  // If already authenticated with JWT, we still let them browse strategies or see their active dashboard
  return (
    <div className="strategy-selector-container">
      <div className="strategy-intro">
        <h2>Multi-Strategy Authentication Hub</h2>
        <p>
          Compare, test, and understand industry standard authentication mechanisms side-by-side in a single unified architecture.
        </p>
      </div>

      <nav className="strategy-nav" aria-label="Authentication Strategy Tabs">
        <button
          type="button"
          className={`strategy-btn ${selectedStrategy === 'jwt' ? 'active' : ''}`}
          onClick={() => setSelectedStrategy('jwt')}
        >
          <KeyRound size={18} />
          <span>JWT Auth</span>
          <span className="badge-ready">Active</span>
        </button>

        <button
          type="button"
          className={`strategy-btn ${selectedStrategy === 'clerk' ? 'active' : ''}`}
          onClick={() => setSelectedStrategy('clerk')}
        >
          <Sparkles size={18} />
          <span>Clerk Auth</span>
          <span className="badge-preview">Phase 2</span>
        </button>

        <button
          type="button"
          className={`strategy-btn ${selectedStrategy === 'google' ? 'active' : ''}`}
          onClick={() => setSelectedStrategy('google')}
        >
          <Globe2 size={18} />
          <span>Google OAuth</span>
          <span className="badge-preview">Phase 3</span>
        </button>
      </nav>
    </div>
  );
};
