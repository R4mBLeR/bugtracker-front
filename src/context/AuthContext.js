import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshTokenState, setRefreshTokenState] = useState(null); // переименовал чтобы не путать
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("access_token");
    const savedRefreshToken = localStorage.getItem("refresh_token");

    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }

    if (savedRefreshToken) {
      setRefreshTokenState(savedRefreshToken);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      };

      const response = await fetch(`${API_URL}/auth/login`, requestOptions);

      if (response.status === 409) {
        return { success: false, error: "Incorrect username or password" };
      }

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data = await response.json();

      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token;

      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshTokenState(newRefreshToken);

      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setAccessToken(null);
    setRefreshTokenState(null);

    window.location.href = "/login";
  };

  // Функция для обновления access token
  const refreshAccessToken = async () => {
    try {
      // Используем refreshTokenState из состояния
      const currentRefreshToken =
        refreshTokenState || localStorage.getItem("refresh_token");

      if (!currentRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentRefreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      // Извлекаем новый accessToken из заголовка Authorization
      const authHeader = response.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No access token in response headers");
      }

      const newAccessToken = authHeader.substring(7);

      localStorage.setItem("access_token", newAccessToken);
      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout(); // Если не удалось обновить токен, разлогиниваем пользователя
      throw error;
    }
  };

  // Универсальная функция для запросов с автообновлением токена
  const fetchWithAuth = async (url, options = {}) => {
    // Добавляем токен к запросу
    const makeRequest = (token) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token || accessToken}`,
        },
      });
    };

    try {
      let response = await makeRequest();

      // Если токен истек
      if (response.status === 401) {
        // Если уже идет обновление токена, добавляем запрос в очередь
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            setPendingRequests((prev) => [
              ...prev,
              { resolve, reject, url, options },
            ]);
          });
        }

        // Начинаем обновление токена
        setIsRefreshing(true);

        try {
          const newToken = await refreshAccessToken();
          setIsRefreshing(false);

          // Повторяем все запросы из очереди с новым токеном
          pendingRequests.forEach(({ resolve, reject, url, options }) => {
            fetchWithAuth(url, options).then(resolve).catch(reject);
          });
          setPendingRequests([]);

          // Повторяем текущий запрос с новым токеном
          response = await makeRequest(newToken);
        } catch (refreshError) {
          setIsRefreshing(false);
          setPendingRequests([]);
          throw refreshError;
        }
      }

      return response;
    } catch (error) {
      console.error("Fetch with auth error:", error);
      throw error;
    }
  };

  const value = {
    accessToken,
    refreshToken: refreshTokenState,
    isAuthenticated: !!accessToken,
    login,
    logout,
    refreshTokens: refreshAccessToken,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
