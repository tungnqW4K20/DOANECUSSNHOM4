import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/nhapkho-sp`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY TẤT CẢ PHIẾU NHẬP SẢN PHẨM
============================================================ */
export const getAllNhapKhoSP = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getAllNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT PHIẾU NHẬP THEO ID
============================================================ */
export const getNhapKhoSPById = async (id_nhap) => {
    try {
        const res = await api.get(`/${id_nhap}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getNhapKhoSPById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 TẠO MỚI PHIẾU NHẬP SẢN PHẨM
============================================================ */
export const createNhapKhoSP = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi tạo phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT PHIẾU NHẬP SẢN PHẨM
============================================================ */
export const updateNhapKhoSP = async (id_nhap, payload) => {
    try {
        const res = await api.put(`/${id_nhap}`, payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 XÓA PHIẾU NHẬP SẢN PHẨM
============================================================ */
export const deleteNhapKhoSP = async (id_nhap) => {
    try {
        const res = await api.delete(`/${id_nhap}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi xóa phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 THÊM CHI TIẾT PHIẾU NHẬP SẢN PHẨM
   body yêu cầu: { id_sp, so_luong }
============================================================ */
export const addChiTietNhapKhoSP = async (id_nhap, payload) => {
    try {
        const res = await api.post(`/${id_nhap}/chi-tiet`, payload);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi addChiTietNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi thêm chi tiết phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH CHI TIẾT CỦA MỘT PHIẾU NHẬP
============================================================ */
export const getChiTietByPhieuNhapSP = async (id_nhap) => {
    try {
        const res = await api.get(`/${id_nhap}/chi-tiet`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getChiTietByPhieuNhapSP:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết phiếu nhập SP" };
    }
};

/* ============================================================
   🟢 XÓA MỘT CHI TIẾT PHIẾU NHẬP
============================================================ */
export const deleteChiTietNhapKhoSP = async (id_ct) => {
    try {
        const res = await api.delete(`/chi-tiet/${id_ct}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteChiTietNhapKhoSP:", err);
        throw err.response?.data || { message: "Lỗi khi xóa chi tiết phiếu nhập SP" };
    }
};

export default {
    getAllNhapKhoSP,
    getNhapKhoSPById,
    createNhapKhoSP,
    updateNhapKhoSP,
    deleteNhapKhoSP,
    addChiTietNhapKhoSP,
    getChiTietByPhieuNhapSP,
    deleteChiTietNhapKhoSP,
};
