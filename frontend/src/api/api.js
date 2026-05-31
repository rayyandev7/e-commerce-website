// Lightweight fetch wrapper around the backend API.
// Automatically attaches the JWT (when present) and parses JSON / errors.

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored?.token || null;
  } catch {
    return null;
  }
};

const request = async (path, { method = "GET", body, isForm = false } = {}) => {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = body;
  if (body && !isForm) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  // Try to parse JSON, but tolerate empty bodies.
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && data.message) || res.statusText || "Something went wrong";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
};

export const api = {
  get: (path) => request(path),
  post: (path, body, opts) => request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts) => request(path, { method: "PUT", body, ...opts }),
  del: (path) => request(path, { method: "DELETE" }),
};

export { API_URL };
export default api;
