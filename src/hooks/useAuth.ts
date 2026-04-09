import { useState, useEffect } from "react";
import config from "@/config";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem(config.adminStorageKey);
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const now = new Date().getTime();

        if (session.authenticated && now < session.expiry) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem(config.adminStorageKey);
        }
      } catch (e) {
        localStorage.removeItem(config.adminStorageKey);
      }
    }
    setLoading(false);
  }, []);

  const login = (password: string, username: string) => {
    if (username === config.adminUsername && password === config.adminPassword) {
      const expiry = new Date().getTime() + config.adminStorageTTL;
      const sessionData = { authenticated: true, expiry };

      localStorage.setItem(config.adminStorageKey, JSON.stringify(sessionData));
      setAuthenticated(true);
      setError(false);
      return true;
    } else {
      setError(true);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(config.adminStorageKey);
    setAuthenticated(false);
  };

  return { authenticated, loading, error, login, logout, setError };
}
