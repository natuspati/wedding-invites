import { useState } from "react";
import config from "@/config";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;

    const sessionStr = localStorage.getItem(config.adminStorageKey);
    if (!sessionStr) return false;

    try {
      const session = JSON.parse(sessionStr);
      const now = new Date().getTime();
      if (session.authenticated && now < session.expiry) {
        return true;
      }
      localStorage.removeItem(config.adminStorageKey);
      return false;
    } catch {
      localStorage.removeItem(config.adminStorageKey);
      return false;
    }
  });

  const [loading] = useState(false);
  const [error, setError] = useState(false);

  const login = (password: string, username: string) => {
    if (
      username === config.adminUsername &&
      password === config.adminPassword
    ) {
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
