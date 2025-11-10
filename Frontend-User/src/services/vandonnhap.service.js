import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/van-don-nhap`;

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
   🟢 LẤY DANH SÁCH TẤT CẢ VẬN ĐƠN NHẬP
============================================================ */
export const getAllVanDonNhap = async () => {
    try {
        const res = await api.get("/");
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi getAllVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách vận đơn nhập" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT VẬN ĐƠN NHẬP THEO ID
============================================================ */
export const getVanDonNhapById = async (id_vd) => {
    try {
        const res = await api.get(`/${id_vd}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi getVanDonNhapById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết vận đơn nhập" };
    }
};

/* ============================================================
   🟢 TẠO MỚI VẬN ĐƠN NHẬP
============================================================ */
export const createVanDonNhap = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi createVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi tạo vận đơn nhập" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT VẬN ĐƠN NHẬP
============================================================ */
export const updateVanDonNhap = async (id_vd, payload) => {
    try {
        const res = await api.put(`/${id_vd}`, payload);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật vận đơn nhập" };
    }
};

/* ============================================================
   🟢 XÓA VẬN ĐƠN NHẬP
============================================================ */
export const deleteVanDonNhap = async (id_vd) => {
    try {
        const res = await api.delete(`/${id_vd}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi xóa vận đơn nhập" };
    }
};

export default {
    getAllVanDonNhap,
    getVanDonNhapById,
    createVanDonNhap,
    updateVanDonNhap,
    deleteVanDonNhap,
};
