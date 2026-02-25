import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api.js";

const AuthContext = createContext(null);

function safeLoadToken() {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

function safeSaveToken(token) {
  try {
    if (!token) localStorage.removeItem("auth_token");
    else localStorage.setItem("auth_token", token);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => safeLoadToken());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(token ? "loading" : "anonymous"); // loading | authenticated | anonymous

  async function hydrate(nextToken) {
    if (!nextToken) {
      setUser(null);
      setStatus("anonymous");
      return;
    }
    setStatus("loading");
    try {
      const data = await apiFetch("/api/auth/me", { token: nextToken });
      setUser(data.user);
      setStatus("authenticated");
    } catch {
      safeSaveToken(null);
      setToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }

  useEffect(() => {
    hydrate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    safeSaveToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setStatus("authenticated");
    return data.user;
  }

  function logout() {
    safeSaveToken(null);
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refresh: () => hydrate(safeLoadToken()),
    }),
    [token, user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}


