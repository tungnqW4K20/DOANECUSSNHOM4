import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/xuatkho-npl`;

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
   🟢 LẤY TẤT CẢ PHIẾU XUẤT KHO NPL
============================================================ */
export const getAllXuatKhoNPL = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getAllXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT PHIẾU XUẤT THEO ID
============================================================ */
export const getXuatKhoNPLById = async (id_xuat) => {
    try {
        const res = await api.get(`/${id_xuat}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getXuatKhoNPLById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 TẠO MỚI PHIẾU XUẤT NPL
   body: { id_kho, ngay_xuat, file_phieu? }
============================================================ */
export const createXuatKhoNPL = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi tạo phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT PHIẾU XUẤT NPL
============================================================ */
export const updateXuatKhoNPL = async (id_xuat, payload) => {
    try {
        const res = await api.put(`/${id_xuat}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 XÓA PHIẾU XUẤT NPL
============================================================ */
export const deleteXuatKhoNPL = async (id_xuat) => {
    try {
        const res = await api.delete(`/${id_xuat}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi xóa phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 THÊM CHI TIẾT PHIẾU XUẤT
   backend yêu cầu: { id_xuat, id_npl, so_luong }
============================================================ */
export const addChiTietXuatKhoNPL = async (id_xuat, payload) => {
    try {
        // 👇 backend cần cả id_xuat trong body
        const data = { id_xuat, ...payload };
        const res = await api.post(`/${id_xuat}/chi-tiet`, data);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi addChiTietXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi thêm chi tiết phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH CHI TIẾT CỦA MỘT PHIẾU XUẤT
============================================================ */
export const getChiTietByPhieuXuat = async (id_xuat) => {
    try {
        const res = await api.get(`/${id_xuat}/chi-tiet`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getChiTietByPhieuXuat:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu xuất NPL" };
    }
};

/* ============================================================
   🟢 XÓA MỘT CHI TIẾT PHIẾU XUẤT
============================================================ */
export const deleteChiTietXuatKhoNPL = async (id_ct) => {
    try {
        const res = await api.delete(`/chi-tiet/${id_ct}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteChiTietXuatKhoNPL:", err);
        throw err.response?.data || { message: "Lỗi khi xóa chi tiết phiếu xuất NPL" };
    }
};

export default {
    getAllXuatKhoNPL,
    getXuatKhoNPLById,
    createXuatKhoNPL,
    updateXuatKhoNPL,
    deleteXuatKhoNPL,
    addChiTietXuatKhoNPL,
    getChiTietByPhieuXuat,
    deleteChiTietXuatKhoNPL,
};
