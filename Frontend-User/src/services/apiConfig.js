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

    // Response interceptor - handle 401 errors and REJECTED status
    api.interceptors.response.use(
        (response) => {
            // Kiểm tra nếu response chứa thông tin user với status REJECTED (case-insensitive)
            const userData = response.data?.data;
            if (userData && userData.status?.toUpperCase() === 'REJECTED') {
                console.warn('⚠️ Account status is REJECTED - logging out');
                
                // Clear tokens and user data
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                
                // Show warning notification with business name
                const businessName = userData.ten_dn || 'Doanh nghiệp';
                const taxCode = userData.ma_so_thue || '';
                const message = taxCode 
                    ? `Doanh nghiệp "${businessName}" (MST: ${taxCode}) đã bị từ chối bởi quản trị viên. Vui lòng liên hệ để biết thêm chi tiết.`
                    : `Doanh nghiệp "${businessName}" đã bị từ chối bởi quản trị viên. Vui lòng liên hệ để biết thêm chi tiết.`;
                
                showWarning('Doanh nghiệp bị từ chối', message);
                
                // Redirect to login page
                setTimeout(() => {
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }, 2000);
            }
            
            return response;
        },
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
