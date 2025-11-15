import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/don-vi-tinh-hai-quan`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor tự động gắn token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Lấy tất cả đơn vị tính HQ
export const getAllDonViTinhHQ = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("Lỗi getAllDonViTinhHQ:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách đơn vị tính HQ" };
    }
};

// ✅ Lấy đơn vị tính HQ theo ID
export const getDonViTinhHQById = async (id_dvt_hq) => {
    try {
        const res = await api.get(`/${id_dvt_hq}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("Lỗi getDonViTinhHQById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết đơn vị tính HQ" };
    }
};

export default {
    getAllDonViTinhHQ,
    getDonViTinhHQById,
};
