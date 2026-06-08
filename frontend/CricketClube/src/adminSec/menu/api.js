// api.js
// A pre-configured axios instance that automatically attaches
// the JWT token to every request header.
//
// Import this instead of plain axios in all your components:
//   import api from "./api";
//   const res = await api.get("/GetMatches");
//   const res = await api.post("/CreateMatch", { ... });

import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// If any response returns 401/403, token is invalid — log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminName");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;