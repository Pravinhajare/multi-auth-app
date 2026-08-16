import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Play, KeyRound, Clock, Database, LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TokenInspector } from './jwt/TokenInspector';
import { api } from '../services/api';

export const Dashboard = () => {
  const { user, token, logout, addToast } = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const testProtectedEndpoint = async () => {
    setApiLoading(true);
    setApiResponse(null);
    setApiStatus(null);
    const start = performance.now();
    try {
      const data = await api.jwt.getMe(token);
      const duration = Math.round(performance.now() - start);
      setApiStatus({ code: 200, duration, ok: true });
      setApiResponse(data);
      addToast('Protected API (/api/auth/jwt/me) authorized successfully!', 'success');
    } catch (error) {
      const duration = Math.round(performance.now() - start);
      setApiStatus({ code: error.status || 500, duration, ok: false });
      setApiResponse(error.data || { error: error.message });
      addToast('Protected API request failed: ' + error.message, 'error');
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Left Column: User Profile Card */}
        <div className="glass-panel user-card">
          <div className="user-avatar-wrapper">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`}
              alt={user.name}
              className="user-avatar"
            />
            <span className="provider-chip">{user.authProvider || 'JWT'}</span>
          </div>

          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>

          <div className="user-stats-list">
            <div className="stat-item">
              <span className="stat-label">User ID:</span>
              <span className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {user.id}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Auth Method:</span>
              <span className="stat-value" style={{ color: 'var(--primary-light)' }}>
                {user.authProvider ? user.authProvider.toUpperCase() : 'JWT'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Role:</span>
              <span className="stat-value" style={{ textTransform: 'capitalize' }}>
                {user.role || 'user'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Email Verified:</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>
                Active Session
              </span>
            </div>
          </div>

          {/* Interactive Protected Route Tester */}
          <div className="api-tester" style={{ textAlign: 'left' }}>
            <div className="api-tester-header">
              <span className="api-endpoint-badge">
                <span className="method">GET</span> /api/auth/jwt/me
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Sends your Bearer JWT token in the <code>Authorization</code> header to the backend to verify the session.
            </p>

            <button
              onClick={testProtectedEndpoint}
              disabled={apiLoading}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1rem', width: '100%' }}
            >
              {apiLoading ? (
                <>
                  <div className="spinner" />
                  <span>Verifying Token...</span>
                </>
              ) : (
                <>
                  <Play size={15} />
                  <span>Test Protected Route</span>
                </>
              )}
            </button>

            {apiStatus && (
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: apiStatus.ok ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    HTTP {apiStatus.code} {apiStatus.ok ? 'OK' : 'UNAUTHORIZED'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{apiStatus.duration}ms</span>
                </div>
                <pre
                  className="code-block"
                  style={{
                    maxHeight: '140px',
                    fontSize: '0.74rem',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={logout} className="btn-danger-outline" style={{ width: '100%' }}>
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Educational Token Inspector */}
        <div>
          <TokenInspector token={token} />
        </div>
      </div>
    </div>
  );
};
