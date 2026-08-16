import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('multi_auth_jwt_token') || null);
  const [selectedStrategy, setSelectedStrategy] = useState('jwt'); // 'jwt', 'clerk', 'google'
  const [isLoading, setIsLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend server health
  useEffect(() => {
    const checkServer = async () => {
      try {
        await api.health();
        setServerOnline(true);
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, []);

  // Validate existing token on boot
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('multi_auth_jwt_token');
      if (savedToken) {
        try {
          const res = await api.jwt.getMe(savedToken);
          if (res.success && res.user) {
            setUser(res.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('multi_auth_jwt_token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          localStorage.removeItem('multi_auth_jwt_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // JWT Register
  const registerWithJWT = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await api.jwt.register(name, email, password);
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('multi_auth_jwt_token', data.token);
        addToast(`Welcome aboard, ${data.user.name}! Registered with JWT.`, 'success');
        return { success: true };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // JWT Login
  const loginWithJWT = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await api.jwt.login(email, password);
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('multi_auth_jwt_token', data.token);
        addToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      const msg = err.message || 'Invalid credentials';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('multi_auth_jwt_token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedStrategy,
        setSelectedStrategy,
        isLoading,
        serverOnline,
        registerWithJWT,
        loginWithJWT,
        logout,
        addToast,
        toasts,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
