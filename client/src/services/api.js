// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Important for CORS with credentials
//   timeout: 10000, // 10 second timeout
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log(`Response from ${response.config.url}:`, response.status);
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('Request timeout');
//     } else if (!error.response) {
//       console.error('Network error - make sure backend is running');
//     } else if (error.response.status === 401) {
//       console.warn("Token expired or invalid");
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

// ─── Base Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with every request
});

// ─── Request Interceptor: Attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Errors Globally ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Token expired or invalid → force logout
    if (response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login (adjust path as needed)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Forbidden
    if (response?.status === 403) {
      console.warn("Access denied:", response.data?.message);
    }

    // Server error
    if (response?.status >= 500) {
      console.error("Server error:", response.data?.message);
    }

    // Normalize error so callers can always read error.message
    const message =
      response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
export const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === "admin";
  },
};

// ─── Default Export ───────────────────────────────────────────────────────────
export default api;