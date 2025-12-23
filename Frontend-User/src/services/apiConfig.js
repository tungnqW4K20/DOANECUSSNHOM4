import axios from "axios";
import { showWarning } from "../components/notification";

// Create a base axios instance
export const createApiInstance = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor - attach token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response interceptor - handle 401 errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            // Handle 401 Unauthorized - session expired
            if (error.response?.status === 401) {
                console.error('🔒 401 Unauthorized - Token invalid or expired');
                console.error('Request URL:', error.config?.url);
                console.error('Response:', error.response?.data);
                
                // Clear tokens
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                
                // Show warning notification
                showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
                
                // Redirect to login page (only once)
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApiInstance;
