const API_BASE = (import.meta.env.VITE_API_URL || "https://deepak-software-solutions-server.vercel.app/").replace(/\/+$/, "");

function getToken() {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const inflight = new Map(); // key -> Promise

function stableKey({ url, method, authToken, body }) {
  return `${method}:${url}:${authToken || ""}:${body ? JSON.stringify(body) : ""}`;
}

export async function apiFetch(path, { method = "GET", body, token, headers, timeoutMs = 20000, ...rest } = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const authToken = token ?? getToken();
  const upper = String(method || "GET").toUpperCase();

  // Dedupe concurrent GETs so UI doesn't trigger multiple identical requests (helps on slow cold starts).
  if (upper === "GET") {
    const key = stableKey({ url, method: upper, authToken, body: undefined });
    if (inflight.has(key)) return inflight.get(key);

    const p = _apiFetchImpl(url, { method: upper, body: undefined, authToken, headers, timeoutMs, ...rest }).finally(
      () => inflight.delete(key)
    );
    inflight.set(key, p);
    return p;
  }

  return _apiFetchImpl(url, { method: upper, body, authToken, headers, timeoutMs, ...rest });
}

async function _apiFetchImpl(url, { method, body, authToken, headers, timeoutMs, ...rest }) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = timeoutMs
    ? setTimeout(() => {
        try {
          controller?.abort();
        } catch {
          // ignore
        }
      }, timeoutMs)
    : null;

  const res = await fetch(url, {
    method,
    signal: controller?.signal,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  }).finally(() => {
    if (t) clearTimeout(t);
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = (() => {
      if (data && typeof data === "object") {
        if (Array.isArray(data.issues) && data.issues.length) {
          return data.issues.map((i) => i.message).filter(Boolean).join(", ") || data.error || `Request failed (${res.status})`;
        }
        if (data.error) return data.error;
      }
      return `Request failed (${res.status})`;
    })();
    throw new ApiError(message, { status: res.status, data });
  }

  return data;
}


