import { createApiInstance } from "./apiConfig";

// 🔹 Base URL cho API kho
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/kho`;

// 🔹 Tạo instance axios với interceptors
const api = createApiInstance(API_BASE_URL);

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
        // Backend trả về array trực tiếp (không wrap)
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
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
