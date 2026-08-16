import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerWithJWT, isLoading } = useAuth();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: 'Enter a password', class: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (password.length >= 10 && /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 1) return { level: 1, text: 'Weak (at least 6 characters)', class: 'active-weak' };
    if (score === 2) return { level: 2, text: 'Medium (mix of letters & numbers)', class: 'active-medium' };
    return { level: 3, text: 'Strong (mix with symbols)', class: 'active-strong' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await registerWithJWT(name.trim(), email.trim(), password);
    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="jwt-form-container">
      {errorMsg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">
            Full Name
          </label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Jane Doe"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">
            Email Address
          </label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              id="reg-email"
              type="email"
              placeholder="jane@example.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">
            Password
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="input-action-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {password && (
            <div className="password-strength">
              <div className="strength-bars">
                <div className={`strength-bar ${strength.level >= 1 ? strength.class : ''}`} />
                <div className={`strength-bar ${strength.level >= 2 ? strength.class : ''}`} />
                <div className={`strength-bar ${strength.level >= 3 ? strength.class : ''}`} />
              </div>
              <span className="strength-text">{strength.text}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-confirm-password">
            Confirm Password
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="reg-confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.3rem', display: 'block' }}>
              Passwords do not match
            </span>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Create Account</span>
            </>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-light)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
