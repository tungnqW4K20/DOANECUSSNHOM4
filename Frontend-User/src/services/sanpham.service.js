import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/san-pham`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY DANH SÁCH TẤT CẢ SẢN PHẨM
============================================================ */
export const getAllSanPham = async () => {
    try {
        const res = await api.get("/");
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi getAllSanPham:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách sản phẩm" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT SẢN PHẨM THEO ID
============================================================ */
export const getSanPhamById = async (id_sp) => {
    try {
        const res = await api.get(`/${id_sp}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getSanPhamById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết sản phẩm" };
    }
};

/* ============================================================
   🟢 TẠO MỚI SẢN PHẨM
============================================================ */
export const createSanPham = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createSanPham:", err);
        throw err.response?.data || { message: "Lỗi khi tạo sản phẩm" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT SẢN PHẨM
============================================================ */
export const updateSanPham = async (id_sp, payload) => {
    try {
        const res = await api.put(`/${id_sp}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateSanPham:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật sản phẩm" };
    }
};

/* ============================================================
   🟢 XÓA SẢN PHẨM
============================================================ */
export const deleteSanPham = async (id_sp) => {
    try {
        const res = await api.delete(`/${id_sp}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteSanPham:", err);
        throw err.response?.data || { message: "Lỗi khi xóa sản phẩm" };
    }
};

export default {
    getAllSanPham,
    getSanPhamById,
    createSanPham,
    updateSanPham,
    deleteSanPham,
};
