import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor tự động gắn access token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Đăng ký doanh nghiệp
export const registerBusiness = async (data) => {
    try {
        const res = await api.post("/register", data);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// Đăng nhập doanh nghiệp
export const loginBusiness = async (data) => {
    try {
        const res = await api.post("/login", data);

        // BE trả về kiểu nào thì lấy đúng key đó
        const { token, refreshToken } = res.data?.data || {};

        if (token) localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        return res.data;
    } catch (err) {
        console.error("Lỗi loginBusiness:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// Đăng nhập hải quan
export const loginHaiQuan = async (data) => {
    try {
        const res = await api.post("/login-haiquan", data);

        const { token, refreshToken } = res.data?.data || {};

        if (token) localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        return res.data;
    } catch (err) {
        console.error("Lỗi loginHaiQuan:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// Làm mới access token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Thiếu refresh token");

        const res = await api.post("/refresh", { refreshToken });

        const { accessToken, refreshToken: newRefresh } = res.data?.data || {};

        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

        return res.data;
    } catch (err) {
        // Nếu refresh fail thì xóa token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw err.response?.data || { message: "Lỗi khi làm mới token" };
    }
};

// Đăng xuất
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

export default {
    registerBusiness,
    loginBusiness,
    loginHaiQuan,
    refreshAccessToken,
    logout,
};
