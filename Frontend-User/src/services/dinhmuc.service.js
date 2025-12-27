import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/dinh-muc`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 LẤY DANH SÁCH TẤT CẢ ĐỊNH MỨC SẢN PHẨM
============================================================ */
export const getAllDinhMuc = async () => {
    try {
        const res = await api.get("/");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getAllDinhMuc:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách định mức" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH ĐỊNH MỨC THEO SẢN PHẨM
============================================================ */
export const getDinhMucBySanPham = async (id_sp) => {
    try {
        const res = await api.get(`/${id_sp}`);
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getDinhMucBySanPham:", err);
        throw err.response?.data || { message: "Lỗi khi lấy định mức theo sản phẩm" };
    }
};

/* ============================================================
   🟢 TẠO MỚI ĐỊNH MỨC SẢN PHẨM
============================================================ */
export const createDinhMuc = async (payload) => {
    try {
        const res = await api.post("/", payload);
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi createDinhMuc:", err);
        throw err.response?.data || { message: "Lỗi khi tạo định mức sản phẩm" };
    }
};

/* ============================================================
   🟢 XÓA ĐỊNH MỨC SẢN PHẨM
============================================================ */
export const deleteDinhMuc = async (id_dinhmuc) => {
    try {
        const res = await api.delete(`/${id_dinhmuc}`);
        return res.data; // { success, message }
    } catch (err) {
        console.error("❌ Lỗi deleteDinhMuc:", err);
        throw err.response?.data || { message: "Lỗi khi xóa định mức sản phẩm" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH SẢN PHẨM THEO DOANH NGHIỆP (DROPDOWN)
============================================================ */
export const getSanPhamByDN = async () => {
    try {
        const res = await api.get("/san-pham");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getSanPhamByDN:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách sản phẩm" };
    }
};

/* ============================================================
   🟢 LẤY DANH SÁCH NGUYÊN LIỆU THEO DOANH NGHIỆP (DROPDOWN)
============================================================ */
export const getNguyenLieuByDN = async () => {
    try {
        const res = await api.get("/nguyen-lieu");
        return res.data; // { success, data }
    } catch (err) {
        console.error("❌ Lỗi getNguyenLieuByDN:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách nguyên liệu" };
    }
};

export default {
    getAllDinhMuc,
    getDinhMucBySanPham,
    createDinhMuc,
    deleteDinhMuc,
    getSanPhamByDN,
    getNguyenLieuByDN,
};
