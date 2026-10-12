import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getAuthToken, setAuthToken, removeAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mysterybox_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem('mysterybox_user', JSON.stringify(currentUser));
      } catch (err) {
        console.warn('Session expired or invalid, logging out', err);
        removeAuthToken();
        localStorage.removeItem('mysterybox_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('mysterybox_user', JSON.stringify(response.user));
    return response.user;
  };

  const register = async (name, email, password, role) => {
    const response = await authApi.register({ name, email, password, role });
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('mysterybox_user', JSON.stringify(response.user));
    return response.user;
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('mysterybox_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, register, logout }}>
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
