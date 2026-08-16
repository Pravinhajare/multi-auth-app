import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthSelector } from './components/AuthSelector';
import { JwtAuthView } from './components/jwt/JwtAuthView';
import { Dashboard } from './components/Dashboard';
import { ClerkView } from './components/clerk/ClerkView';
import { GoogleView } from './components/google/GoogleView';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const AppContent = () => {
  const { selectedStrategy, user, isLoading } = useAuth();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <AuthSelector />

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div className="spinner" style={{ width: '32px', height: '32px', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Initializing multi-auth session...</p>
          </div>
        ) : (
          <>
            {selectedStrategy === 'jwt' && (
              user ? <Dashboard /> : <JwtAuthView />
            )}

            {selectedStrategy === 'clerk' && <ClerkView />}

            {selectedStrategy === 'google' && <GoogleView />}
          </>
        )}
      </main>

      <Footer />

      <Toast />
    </div>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
