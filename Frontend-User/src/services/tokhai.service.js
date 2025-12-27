import { createApiInstance } from "./apiConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 TỜ KHAI NHẬP
============================================================ */
export const getAllToKhaiNhap = async () => {
    try {
        const res = await api.get("/to-khai-nhap");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách tờ khai nhập" };
    }
};

/* ============================================================
   🟢 TỜ KHAI XUẤT
============================================================ */
export const getAllToKhaiXuat = async () => {
    try {
        const res = await api.get("/to-khai-xuat");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllToKhaiXuat:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách tờ khai xuất" };
    }
};

/* ============================================================
   🟢 HÓA ĐƠN NHẬP
============================================================ */
export const getAllHoaDonNhap = async () => {
    try {
        const res = await api.get("/hoa-don-nhap");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách hóa đơn nhập" };
    }
};

/* ============================================================
   🟢 HÓA ĐƠN XUẤT
============================================================ */
export const getAllHoaDonXuat = async () => {
    try {
        const res = await api.get("/hoa-don-xuat");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllHoaDonXuat:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách hóa đơn xuất" };
    }
};

/* ============================================================
   🟢 VẬN ĐƠN NHẬP
============================================================ */
export const getAllVanDonNhap = async () => {
    try {
        const res = await api.get("/van-don-nhap");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách vận đơn nhập" };
    }
};

/* ============================================================
   🟢 VẬN ĐƠN XUẤT
============================================================ */
export const getAllVanDonXuat = async () => {
    try {
        const res = await api.get("/van-don-xuat");
        // Backend trả về array trực tiếp
        return Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
    } catch (err) {
        console.error("❌ Lỗi getAllVanDonXuat:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách vận đơn xuất" };
    }
};

/* ============================================================
   🟢 LÔ HÀNG
============================================================ */
export const getAllLoHang = async () => {
    try {
        const res = await api.get("/lo-hang");
        // Backend trả về { success: true, data: [...] }
        return res.data?.data || res.data || [];
    } catch (err) {
        console.error("❌ Lỗi getAllLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách lô hàng" };
    }
};

/* ============================================================
   🟢 TIỀN TỆ
============================================================ */
export const getAllTienTe = async () => {
    try {
        const res = await api.get("/tiente");
        // Backend trả về { success: true, data: [...] }
        return res.data?.data || res.data || [];
    } catch (err) {
        console.error("❌ Lỗi getAllTienTe:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách tiền tệ" };
    }
};

/* ============================================================
   🟢 NGUYÊN PHỤ LIỆU
============================================================ */
export const getAllNguyenPhuLieu = async () => {
    try {
        const res = await api.get("/nguyen-lieu");
        // Backend trả về { success: true, data: [...] }
        return res.data?.data || res.data || [];
    } catch (err) {
        console.error("❌ Lỗi getAllNguyenPhuLieu:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách nguyên phụ liệu" };
    }
};

/* ============================================================
   🟢 SẢN PHẨM
============================================================ */
export const getAllSanPham = async () => {
    try {
        const res = await api.get("/san-pham");
        // Backend trả về { success: true, data: [...] }
        return res.data?.data || res.data || [];
    } catch (err) {
        console.error("❌ Lỗi getAllSanPham:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách sản phẩm" };
    }
};

/* ============================================================
   🟢 DELETE FUNCTIONS
============================================================ */
export const deleteToKhaiNhap = async (id) => {
    try {
        const res = await api.delete(`/to-khai-nhap/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteToKhaiNhap:", err);
        throw err.response?.data || { message: "Lỗi khi xóa tờ khai nhập" };
    }
};

export const deleteToKhaiXuat = async (id) => {
    try {
        const res = await api.delete(`/to-khai-xuat/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteToKhaiXuat:", err);
        throw err.response?.data || { message: "Lỗi khi xóa tờ khai xuất" };
    }
};

export const deleteLoHang = async (id) => {
    try {
        const res = await api.delete(`/lo-hang/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi xóa lô hàng" };
    }
};

export const deleteHoaDonNhap = async (id) => {
    try {
        const res = await api.delete(`/hoa-don-nhap/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi xóa hóa đơn nhập" };
    }
};

export const deleteHoaDonXuat = async (id) => {
    try {
        const res = await api.delete(`/hoa-don-xuat/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteHoaDonXuat:", err);
        throw err.response?.data || { message: "Lỗi khi xóa hóa đơn xuất" };
    }
};

export const deleteVanDon = async (id) => {
    try {
        const res = await api.delete(`/van-don-nhap/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi deleteVanDon:", err);
        throw err.response?.data || { message: "Lỗi khi xóa vận đơn" };
    }
};

/* ============================================================
   🟢 UPDATE FUNCTIONS
============================================================ */
export const updateLoHang = async (id, data) => {
    try {
        const res = await api.put(`/lo-hang/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateLoHang:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật lô hàng" };
    }
};

export const updateHoaDonNhap = async (id, data) => {
    try {
        const res = await api.put(`/hoa-don-nhap/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateHoaDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật hóa đơn nhập" };
    }
};

export const updateHoaDonXuat = async (id, data) => {
    try {
        const res = await api.put(`/hoa-don-xuat/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateHoaDonXuat:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật hóa đơn xuất" };
    }
};

export const updateVanDonNhap = async (id, data) => {
    try {
        const res = await api.put(`/van-don-nhap/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateVanDonNhap:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật vận đơn nhập" };
    }
};

export const updateVanDonXuat = async (id, data) => {
    try {
        const res = await api.put(`/van-don-xuat/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi updateVanDonXuat:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật vận đơn xuất" };
    }
};

export default {
    getAllToKhaiNhap,
    getAllToKhaiXuat,
    getAllHoaDonNhap,
    getAllHoaDonXuat,
    getAllVanDonNhap,
    getAllVanDonXuat,
    getAllLoHang,
    getAllTienTe,
    getAllNguyenPhuLieu,
    getAllSanPham,
    deleteToKhaiNhap,
    deleteToKhaiXuat,
    deleteLoHang,
    deleteHoaDonNhap,
    deleteHoaDonXuat,
    deleteVanDon,
    updateLoHang,
    updateHoaDonNhap,
    updateHoaDonXuat,
    updateVanDonNhap,
    updateVanDonXuat,
};
