import axios from "axios";

const API_BASE_URL = "http://localhost:8070/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add Authorization header to every request if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle authentication errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user from local storage and redirect to login if necessary
      localStorage.removeItem("token");
      // Optionally redirect to login or refresh the page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
