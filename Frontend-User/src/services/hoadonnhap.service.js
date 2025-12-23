import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/hoa-don-nhap`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY DANH SÁCH TẤT CẢ HÓA ĐƠN NHẬP
============================================================ */
export const getAllHoaDonNhap = async () => {
    try {
        const res = await api.get("/");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách hóa đơn nhập" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT HÓA ĐƠN NHẬP THEO ID
============================================================ */
export const getHoaDonNhapById = async (id_hd_nhap) => {
    try {
        const res = await api.get(`/${id_hd_nhap}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi getHoaDonNhapById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết hóa đơn nhập" };
    }
};

/* ============================================================
   🟢 TẠO MỚI HÓA ĐƠN NHẬP
============================================================ */
export const createHoaDonNhap = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi createHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi tạo hóa đơn nhập" };
    }
};

/* ============================================================
   🟢 XÓA HÓA ĐƠN NHẬP
============================================================ */
export const deleteHoaDonNhap = async (id_hd_nhap) => {
    try {
        const res = await api.delete(`/${id_hd_nhap}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi xóa hóa đơn nhập" };
    }
};

export default {
    getAllHoaDonNhap,
    getHoaDonNhapById,
    createHoaDonNhap,
    deleteHoaDonNhap,
};
