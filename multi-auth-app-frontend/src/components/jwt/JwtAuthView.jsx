import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Cpu } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const JwtAuthView = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  return (
    <div className="auth-grid">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <KeyRound size={14} />
            <span>JSON Web Token Auth</span>
          </div>
          <h3>{activeTab === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}</h3>
          <p>
            {activeTab === 'login'
              ? 'Enter your credentials to receive a cryptographically signed JWT.'
              : 'Register your email & password to generate an access token.'}
          </p>
        </div>

        <div className="tab-switcher">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
        )}
      </div>
    </div>
  );
};
