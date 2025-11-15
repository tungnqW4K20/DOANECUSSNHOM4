import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/nhapkho-npl`;

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
   🟢 LẤY TẤT CẢ PHIẾU NHẬP NPL
============================================================ */
export const getAllNhapKhoNPL = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getAllNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT PHIẾU NHẬP THEO ID
============================================================ */
export const getNhapKhoNPLById = async (id_nhap) => {
    try {
        const res = await api.get(`/${id_nhap}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getNhapKhoNPLById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 TẠO MỚI PHIẾU NHẬP NPL
============================================================ */
export const createNhapKhoNPL = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi tạo phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT PHIẾU NHẬP NPL
============================================================ */
export const updateNhapKhoNPL = async (id_nhap, payload) => {
    try {
        const res = await api.put(`/${id_nhap}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 XÓA PHIẾU NHẬP NPL
============================================================ */
export const deleteNhapKhoNPL = async (id_nhap) => {
    try {
        const res = await api.delete(`/${id_nhap}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi xóa phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 THÊM CHI TIẾT PHIẾU NHẬP NPL
   body yêu cầu: { id_npl, so_luong }
============================================================ */
export const addChiTietNhapKhoNPL = async (id_nhap, payload) => {
    try {
        const res = await api.post(`/${id_nhap}/chi-tiet`, payload);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi addChiTietNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi thêm chi tiết phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH CHI TIẾT CỦA MỘT PHIẾU NHẬP
============================================================ */
export const getChiTietByPhieuNhap = async (id_nhap) => {
    try {
        const res = await api.get(`/${id_nhap}/chi-tiet`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getChiTietByPhieuNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu nhập NPL" };
    }
};

/* ============================================================
   🟢 XÓA MỘT CHI TIẾT PHIẾU NHẬP
============================================================ */
export const deleteChiTietNhapKhoNPL = async (id_ct) => {
    try {
        const res = await api.delete(`/chi-tiet/${id_ct}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteChiTietNhapKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi xóa chi tiết phiếu nhập NPL" };
    }
};

export default {
    getAllNhapKhoNPL,
    getNhapKhoNPLById,
    createNhapKhoNPL,
    updateNhapKhoNPL,
    deleteNhapKhoNPL,
    addChiTietNhapKhoNPL,
    getChiTietByPhieuNhap,
    deleteChiTietNhapKhoNPL,
};
