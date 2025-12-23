import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/bao-cao-thanh-khoan`;

const api = createApiInstance(API_BASE_URL);

// ==================== BÁO CÁO THANH KHOẢN ====================

// Lấy danh sách hợp đồng
export const getAllHopDong = async () => {
    try {
        const response = await api.get('/hop-dong');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Tính toán báo cáo thanh khoản
export const calculateReport = async (data) => {
    try {
        const response = await api.post('/calculate', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lưu báo cáo thanh khoản
export const saveReport = async (data) => {
    try {
        const response = await api.post('/thanh-khoan/save', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lấy danh sách báo cáo đã lưu
export const getAllReports = async () => {
    try {
        const response = await api.get('/thanh-khoan-reports');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Cập nhật trạng thái báo cáo
export const updateReportStatus = async (id_bc, status) => {
    try {
        const response = await api.patch(`/thanh-khoan-reports/${id_bc}/status`, { status });
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
    updateReportStatus,
};
