import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/xuatkho-sp`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY TẤT CẢ PHIẾU XUẤT KHO SẢN PHẨM
============================================================ */
export const getAllXuatKhoSP = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getAllXuatKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT PHIẾU XUẤT THEO ID
============================================================ */
export const getXuatKhoSPById = async (id_xuat) => {
    try {
        const res = await api.get(`/${id_xuat}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getXuatKhoSPById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 TẠO MỚI PHIẾU XUẤT SẢN PHẨM
   body: { id_kho, id_hd_xuat, ngay_xuat, file_phieu?, chi_tiets: [{id_sp, so_luong, id_qd}] }
============================================================ */
export const createXuatKhoSP = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createXuatKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi tạo phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT PHIẾU XUẤT SẢN PHẨM
============================================================ */
export const updateXuatKhoSP = async (id_xuat, payload) => {
    try {
        const res = await api.put(`/${id_xuat}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateXuatKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 XÓA PHIẾU XUẤT SẢN PHẨM
============================================================ */
export const deleteXuatKhoSP = async (id_xuat) => {
    try {
        const res = await api.delete(`/${id_xuat}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteXuatKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi xóa phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 THÊM CHI TIẾT PHIẾU XUẤT
   backend yêu cầu: { id_xuat, id_sp, so_luong, id_qd }
============================================================ */
export const addChiTiet = async (id_xuat, payload) => {
    try {
        // 👇 backend cần cả id_xuat trong body
        const data = { id_xuat, ...payload };
        const res = await api.post(`/${id_xuat}/chi-tiet`, data);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi addChiTiet:", err);
        throw err.response?.data || { message: "Lỗi khi thêm chi tiết phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH CHI TIẾT CỦA MỘT PHIẾU XUẤT
============================================================ */
export const getChiTiet = async (id_xuat) => {
    try {
        const res = await api.get(`/${id_xuat}/chi-tiet`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getChiTiet:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu xuất SP" };
    }
};

/* ============================================================
   🟢 XÓA MỘT CHI TIẾT PHIẾU XUẤT
============================================================ */
export const deleteChiTiet = async (id_ct) => {
    try {
        const res = await api.delete(`/chi-tiet/${id_ct}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteChiTiet:", err);
        throw err.response?.data || { message: "Lỗi khi xóa chi tiết phiếu xuất SP" };
    }
};

export default {
    getAllXuatKhoSP,
    getXuatKhoSPById,
    createXuatKhoSP,
    updateXuatKhoSP,
    deleteXuatKhoSP,
    addChiTiet,
    getChiTiet,
    deleteChiTiet,
};
