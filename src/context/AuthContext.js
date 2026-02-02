import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const savedAccessToken = localStorage.getItem('access_token');
    const savedRefreshToken = localStorage.getItem('refresh_token');
    
    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }
    
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      };
      
      const response = await fetch(`${API_URL}/login`, requestOptions);
      
      if (response.status === 409) {
        return { success: false, error: "Incorrect username or password" };
      }
      
      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token;
      
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    setAccessToken(null);
    setRefreshToken(null);
    
    window.location.href = '/login';
  };

  const refreshTokens = (newAccessToken) => {
    localStorage.setItem('access_token', newAccessToken);
    setAccessToken(newAccessToken);
  };

  const value = {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
    refreshTokens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};