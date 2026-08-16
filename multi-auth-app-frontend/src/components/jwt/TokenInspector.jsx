import React, { useState, useEffect } from 'react';
import { Terminal, Shield, CheckCircle, Copy, Check, Info, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api.js';

export const TokenInspector = ({ token }) => {
  const [copied, setCopied] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // Parse JWT parts safely on client
  const parseTokenParts = (rawToken) => {
    if (!rawToken) return null;
    const parts = rawToken.split('.');
    if (parts.length !== 3) return null;

    try {
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return {
        headerPart: parts[0],
        payloadPart: parts[1],
        signaturePart: parts[2],
        headerJson: header,
        payloadJson: payload,
      };
    } catch (e) {
      return null;
    }
  };

  const parsed = parseTokenParts(token);

  useEffect(() => {
    if (token) {
      verifyWithBackend();
    }
  }, [token]);

  const verifyWithBackend = async () => {
    if (!token) return;
    setLoadingVerify(true);
    try {
      const res = await api.jwt.inspectToken(token);
      setVerificationResult(res);
    } catch (err) {
      setVerificationResult({ isValid: false, verificationError: err.message });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTimeRemaining = (expTimestamp) => {
    if (!expTimestamp) return '';
    const now = Math.floor(Date.now() / 1000);
    const diff = expTimestamp - now;
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  if (!parsed) {
    return (
      <div className="glass-panel inspector-card">
        <p style={{ color: 'var(--text-muted)' }}>No active JWT token available to inspect.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel inspector-card">
      <div className="inspector-header">
        <div className="inspector-title">
          <Terminal size={22} style={{ color: 'var(--primary-light)' }} />
          <h3>Interactive JWT Token Inspector</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {verificationResult?.isValid ? (
            <span className="inspector-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <CheckCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Signature Valid (HS256)
            </span>
          ) : (
            <span className="inspector-badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Verification Error
            </span>
          )}

          <button onClick={handleCopy} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
            {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy JWT'}</span>
          </button>
        </div>
      </div>

      <div className="jwt-breakdown">
        {/* Raw Encoded JWT (Color coded) */}
        <div className="jwt-section-card">
          <div className="jwt-section-header">
            <span className="jwt-tag" style={{ color: 'var(--text-secondary)' }}>
              Raw Encoded Token (Header.Payload.Signature)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Format: Base64URL
            </span>
          </div>
          <div className="jwt-raw-token">
            <span className="part-header" title="Encoded Header (Algorithm & Token Type)">{parsed.headerPart}</span>
            <span className="part-dot">.</span>
            <span className="part-payload" title="Encoded Payload (Claims & User Data)">{parsed.payloadPart}</span>
            <span className="part-dot">.</span>
            <span className="part-signature" title="HMAC SHA256 Cryptographic Signature">{parsed.signaturePart}</span>
          </div>
        </div>

        {/* 1. Header */}
        <div className="jwt-section-card">
          <div className="jwt-section-header">
            <span className="jwt-tag header-tag">1. Decoded Header (Algorithm & Token Type)</span>
            <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
              alg: {parsed.headerJson.alg}
            </span>
          </div>
          <pre className="code-block">{JSON.stringify(parsed.headerJson, null, 2)}</pre>
        </div>

        {/* 2. Payload */}
        <div className="jwt-section-card">
          <div className="jwt-section-header">
            <span className="jwt-tag payload-tag">2. Decoded Payload (Data Claims)</span>
            {parsed.payloadJson.exp && (
              <span style={{ fontSize: '0.75rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                {getTimeRemaining(parsed.payloadJson.exp)}
              </span>
            )}
          </div>
          <pre className="code-block">{JSON.stringify(parsed.payloadJson, null, 2)}</pre>
          
          {/* Claims Explanation Bar */}
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
              <div><strong>iat (Issued At):</strong> {formatTimestamp(parsed.payloadJson.iat)}</div>
              <div><strong>exp (Expires At):</strong> {formatTimestamp(parsed.payloadJson.exp)}</div>
              <div><strong>role:</strong> {parsed.payloadJson.role || 'user'}</div>
              <div><strong>authProvider:</strong> {parsed.payloadJson.authProvider || 'jwt'}</div>
            </div>
          </div>
        </div>

        {/* 3. Signature */}
        <div className="jwt-section-card">
          <div className="jwt-section-header">
            <span className="jwt-tag signature-tag">3. Cryptographic Signature</span>
            <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>
              HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
            </span>
          </div>
          <div style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#06b6d4' }}>
            {parsed.signaturePart}
          </div>
        </div>
      </div>
    </div>
  );
};
