import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/lo-hang`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY DANH SÁCH TOÀN BỘ LÔ HÀNG
============================================================ */
export const getAllLoHang = async () => {
    try {
        const res = await api.get("/");
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi getAllLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách lô hàng" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT LÔ HÀNG THEO ID
============================================================ */
export const getLoHangById = async (id_lh) => {
    try {
        const res = await api.get(`/${id_lh}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getLoHangById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết lô hàng" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH LÔ HÀNG THEO HỢP ĐỒNG
============================================================ */
export const getLoHangByHopDong = async (id_hd) => {
    try {
        const res = await api.get(`/byHopDong/${id_hd}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getLoHangByHopDong:", err);
        throw err.response?.data || { message: "Lỗi khi lấy lô hàng theo hợp đồng" };
    }
};

/* ============================================================
   🟢 TẠO MỚI LÔ HÀNG
============================================================ */
export const createLoHang = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi tạo lô hàng" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT LÔ HÀNG
============================================================ */
export const updateLoHang = async (id_lh, payload) => {
    try {
        const res = await api.put(`/${id_lh}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật lô hàng" };
    }
};

/* ============================================================
   🟢 XÓA LÔ HÀNG
============================================================ */
export const deleteLoHang = async (id_lh) => {
    try {
        const res = await api.delete(`/${id_lh}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi xóa lô hàng" };
    }
};

export default {
    getAllLoHang,
    getLoHangById,
    getLoHangByHopDong,
    createLoHang,
    updateLoHang,
    deleteLoHang,
};
