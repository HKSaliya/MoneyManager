import axios from "axios";

const API_BASE_URL = "http://localhost:5000/app";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach token if available
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

// Response interceptor to handle token expiration and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("token"); // Remove expired token
                window.location.href = "/login"; // Redirect to login page
            }
        }
        return Promise.reject(error); // Pass the error for further handling
    }
);

export default api;
