import React from 'react';
import { ShieldCheck, LogOut, Cpu, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, serverOnline, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon-wrapper">
          <ShieldCheck size={24} />
        </div>
        <div className="brand-text">
          <h1>MultiAuth Platform</h1>
          <span>JWT • Clerk • Google OAuth Hub</span>
        </div>
      </div>

      <div className="nav-actions">
        <div
          className="server-badge"
          title={serverOnline ? 'Backend API is connected and responding' : 'Backend API is offline'}
          style={{
            borderColor: serverOnline ? 'var(--success-border)' : 'var(--danger-border)',
            color: serverOnline ? 'var(--success)' : 'var(--danger)',
            background: serverOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <span
            className="status-dot"
            style={{
              background: serverOnline ? 'var(--success)' : 'var(--danger)',
              boxShadow: `0 0 8px ${serverOnline ? 'var(--success)' : 'var(--danger)'}`,
            }}
          />
          <span>{serverOnline ? 'API Online :5000' : 'API Connecting...'}</span>
        </div>

        {user && (
          <button onClick={logout} className="btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
