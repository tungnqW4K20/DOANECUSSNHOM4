import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/quy-doi`;
const api = createApiInstance(API_BASE_URL);

/**
 * Lấy danh sách quy đổi cho NPL
 * @param {number} id_npl - ID nguyên phụ liệu
 * @returns {Promise<Array>}
 */
export const getQuyDoiListNPL = async (id_npl) => {
    try {
        const res = await api.get(`/npl/${id_npl}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("❌ Lỗi getQuyDoiListNPL:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách quy đổi NPL" };
    }
};

/**
 * Lấy danh sách quy đổi cho SP
 * @param {number} id_sp - ID sản phẩm
 * @returns {Promise<Array>}
 */
export const getQuyDoiListSP = async (id_sp) => {
    try {
        const res = await api.get(`/sp/${id_sp}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("❌ Lỗi getQuyDoiListSP:", err);
        throw err.response?.data || { message: "Lỗi khi lấy danh sách quy đổi SP" };
    }
};

/**
 * Tính toán quy đổi NPL từ đơn vị DN sang đơn vị HQ
 * @param {number} id_npl - ID nguyên phụ liệu
 * @param {string} ten_dvt_dn - Tên đơn vị tính DN (VD: "Thùng", "Cây")
 * @param {number} so_luong_dn - Số lượng theo đơn vị DN
 * @returns {Promise<{so_luong_hq: number, id_dvt_hq: number, ten_dvt_hq: string, he_so: number, id_qd: number}>}
 */
export const calculateNPL_DN_to_HQ = async (id_npl, ten_dvt_dn, so_luong_dn) => {
    try {
        const res = await api.post('/npl/dn-to-hq', {
            id_npl,
            ten_dvt_dn,
            so_luong_dn
        });
        return res.data?.data || null;
    } catch (err) {
        console.error("❌ Lỗi calculateNPL_DN_to_HQ:", err);
        throw err.response?.data || { message: "Lỗi khi tính toán quy đổi NPL" };
    }
};

/**
 * Tính toán quy đổi SP từ đơn vị DN sang đơn vị HQ
 * @param {number} id_sp - ID sản phẩm
 * @param {string} ten_dvt_sp - Tên đơn vị tính DN (VD: "Thùng", "Hộp")
 * @param {number} so_luong_dn - Số lượng theo đơn vị DN
 * @returns {Promise<{so_luong_hq: number, id_dvt_hq: number, ten_dvt_hq: string, he_so: number, id_qd: number}>}
 */
export const calculateSP_DN_to_HQ = async (id_sp, ten_dvt_sp, so_luong_dn) => {
    try {
        const res = await api.post('/sp/dn-to-hq', {
            id_sp,
            ten_dvt_sp,
            so_luong_dn
        });
        return res.data?.data || null;
    } catch (err) {
        console.error("❌ Lỗi calculateSP_DN_to_HQ:", err);
        throw err.response?.data || { message: "Lỗi khi tính toán quy đổi SP" };
    }
};

/**
 * Tính toán quy đổi NPL từ đơn vị HQ sang đơn vị DN
 * @param {number} id_qd - ID quy đổi
 * @param {number} so_luong_hq - Số lượng theo đơn vị HQ
 * @returns {Promise<{so_luong_dn: number, ten_dvt_dn: string, he_so: number}>}
 */
export const calculateNPL_HQ_to_DN = async (id_qd, so_luong_hq) => {
    try {
        const res = await api.post('/npl/hq-to-dn', {
            id_qd,
            so_luong_hq
        });
        return res.data?.data || null;
    } catch (err) {
        console.error("❌ Lỗi calculateNPL_HQ_to_DN:", err);
        throw err.response?.data || { message: "Lỗi khi tính toán quy đổi NPL" };
    }
};

/**
 * Tính toán quy đổi SP từ đơn vị HQ sang đơn vị DN
 * @param {number} id_qd - ID quy đổi
 * @param {number} so_luong_hq - Số lượng theo đơn vị HQ
 * @returns {Promise<{so_luong_dn: number, ten_dvt_sp: string, he_so: number}>}
 */
export const calculateSP_HQ_to_DN = async (id_qd, so_luong_hq) => {
    try {
        const res = await api.post('/sp/hq-to-dn', {
            id_qd,
            so_luong_hq
        });
        return res.data?.data || null;
    } catch (err) {
        console.error("❌ Lỗi calculateSP_HQ_to_DN:", err);
        throw err.response?.data || { message: "Lỗi khi tính toán quy đổi SP" };
    }
};

export default {
    getQuyDoiListNPL,
    getQuyDoiListSP,
    calculateNPL_DN_to_HQ,
    calculateSP_DN_to_HQ,
    calculateNPL_HQ_to_DN,
    calculateSP_HQ_to_DN
};
