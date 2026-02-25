const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

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

export async function apiFetch(path, { method = "GET", body, token, headers, ...rest } = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const authToken = token ?? getToken();

  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
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


