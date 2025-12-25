import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/thanh-khoan`;

const api = createApiInstance(API_BASE_URL);

// ==================== BÁO CÁO THANH KHOẢN ====================

// API 1: Lấy danh sách hợp đồng của doanh nghiệp
export const getAllHopDong = async () => {
    try {
        const response = await api.get('/hop-dong');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// API 2: Tính toán và tạo dữ liệu Báo cáo Thanh khoản
export const calculateReport = async (data) => {
    try {
        const response = await api.post('/calculate', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// API 3: Lưu Báo cáo Thanh khoản
export const saveReport = async (data) => {
    try {
        const response = await api.post('/save', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lấy danh sách báo cáo đã lưu (có phân trang và filter)
export const getAllReports = async (params = {}) => {
    try {
        const { page = 1, limit = 10, q, ket_luan_tong_the, trang_thai } = params;
        const queryParams = new URLSearchParams();
        
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (q) queryParams.append('q', q);
        if (ket_luan_tong_the) queryParams.append('ket_luan_tong_the', ket_luan_tong_the);
        if (trang_thai) queryParams.append('trang_thai', trang_thai);

        const response = await api.get(`/reports?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lấy chi tiết báo cáo theo ID
export const getReportById = async (id_bc) => {
    try {
        const response = await api.get(`/reports/${id_bc}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Cập nhật trạng thái báo cáo
export const updateReportStatus = async (id_bc, trang_thai) => {
    try {
        const response = await api.patch(`/reports/${id_bc}/status`, { trang_thai });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    getAllHopDong,
    calculateReport,
    saveReport,
    getAllReports,
    getReportById,
    updateReportStatus,
};
