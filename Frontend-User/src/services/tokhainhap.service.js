import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/to-khai-nhap`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY DANH SÁCH TẤT CẢ TỜ KHAI NHẬP
============================================================ */
export const getAllToKhaiNhap = async () => {
    try {
        const res = await api.get("/");
        return res.data; // [{...}]
    } catch (err) {
        console.error("❌ Lỗi getAllToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách tờ khai nhập" };
    }
};

/* ============================================================
   🟢 LẤY CHI TIẾT TỜ KHAI NHẬP THEO ID
============================================================ */
export const getToKhaiNhapById = async (id_tkn) => {
    try {
        const res = await api.get(`/${id_tkn}`);
        return res.data; // {...}
    } catch (err) {
        console.error("❌ Lỗi getToKhaiNhapById:", err);
        throw err.response?.data || { message: "Lỗi khi lấy chi tiết tờ khai nhập" };
    }
};

/* ============================================================
   🟢 TẠO MỚI TỜ KHAI NHẬP
============================================================ */
export const createToKhaiNhap = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { message, data }
    } catch (err) {
        console.error("❌ Lỗi createToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi tạo tờ khai nhập" };
    }
};

/* ============================================================
   🟢 CẬP NHẬT TỜ KHAI NHẬP
============================================================ */
export const updateToKhaiNhap = async (id_tkn, payload) => {
    try {
        const res = await api.put(`/${id_tkn}`, payload);
        return res.data; // { message, data }
    } catch (err) {
        console.error("❌ Lỗi updateToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật tờ khai nhập" };
    }
};

/* ============================================================
   🟢 XÓA TỜ KHAI NHẬP
============================================================ */
export const deleteToKhaiNhap = async (id_tkn) => {
    try {
        const res = await api.delete(`/${id_tkn}`);
        return res.data; // { message }
    } catch (err) {
        console.error("❌ Lỗi deleteToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi xóa tờ khai nhập" };
    }
};

export default {
    getAllToKhaiNhap,
    getToKhaiNhapById,
    createToKhaiNhap,
    updateToKhaiNhap,
    deleteToKhaiNhap,
};
