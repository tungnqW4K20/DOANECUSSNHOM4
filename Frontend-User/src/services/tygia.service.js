import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/tygia`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🧩 Interceptor: tự động gắn access token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ============================================================
   🟢 CẬP NHẬT TỶ GIÁ TỪ API NGOÀI (qua backend)
============================================================ */
export const updateTyGiaFromAPI = async () => {
    try {
        const res = await api.post("/updateFromAPI");
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateTyGiaFromAPI:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật tỷ giá từ API" };
    }
};

export default {
    updateTyGiaFromAPI,
};
