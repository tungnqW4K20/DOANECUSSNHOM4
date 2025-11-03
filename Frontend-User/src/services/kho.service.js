import axios from "axios";

// 🔹 Base URL cho API kho
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/kho`;

// 🔹 Tạo instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Interceptor tự động gắn token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// =======================
// 📦 Các hàm CRUD cho Kho
// =======================

// 🟢 Tạo kho mới
export const createKho = async (data) => {
    try {
        const res = await api.post("/", data);
        return res.data;
    } catch (err) {
        console.error("Lỗi createKho:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// 🟡 Lấy danh sách tất cả kho
export const getAllKho = async () => {
    try {
        const res = await api.get("/");
        return res.data;
    } catch (err) {
        console.error("Lỗi getAllKho:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// 🔵 Lấy chi tiết kho theo ID
export const getKhoById = async (id_kho) => {
    try {
        const res = await api.get(`/${id_kho}`);
        return res.data;
    } catch (err) {
        console.error("Lỗi getKhoById:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// 🟣 Cập nhật kho
export const updateKho = async (id_kho, data) => {
    try {
        const res = await api.put(`/${id_kho}`, data);
        return res.data;
    } catch (err) {
        console.error("Lỗi updateKho:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// 🔴 Xóa kho
export const deleteKho = async (id_kho) => {
    try {
        const res = await api.delete(`/${id_kho}`);
        return res.data;
    } catch (err) {
        console.error("Lỗi deleteKho:", err);
        throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
    }
};

// =======================
// 📤 Xuất các hàm
// =======================
export default {
    createKho,
    getAllKho,
    getKhoById,
    updateKho,
    deleteKho,
};
