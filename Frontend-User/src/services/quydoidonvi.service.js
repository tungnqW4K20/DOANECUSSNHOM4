import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper để lấy token
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken'); // Sửa từ 'token' thành 'accessToken'
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== QUY ĐỔI DOANH NGHIỆP (NPL) ====================
export const getAllQuyDoiDN = async () => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-doanh-nghiep`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getQuyDoiDNById = async (id_qd) => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-doanh-nghiep/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createQuyDoiDN = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/quy-doi-don-vi-doanh-nghiep`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateQuyDoiDN = async (id_qd, data) => {
    try {
        const response = await axios.put(`${API_URL}/quy-doi-don-vi-doanh-nghiep/${id_qd}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteQuyDoiDN = async (id_qd) => {
    try {
        const response = await axios.delete(`${API_URL}/quy-doi-don-vi-doanh-nghiep/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ==================== QUY ĐỔI SẢN PHẨM ====================
export const getAllQuyDoiSP = async () => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-san-pham`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getQuyDoiSPById = async (id_qd) => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-san-pham/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createQuyDoiSP = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/quy-doi-don-vi-san-pham`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateQuyDoiSP = async (id_qd, data) => {
    try {
        const response = await axios.put(`${API_URL}/quy-doi-don-vi-san-pham/${id_qd}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteQuyDoiSP = async (id_qd) => {
    try {
        const response = await axios.delete(`${API_URL}/quy-doi-don-vi-san-pham/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// ==================== QUY ĐỔI NPL ====================
export const getAllQuyDoiNPL = async () => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-npl`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getQuyDoiNPLById = async (id_qd) => {
    try {
        const response = await axios.get(`${API_URL}/quy-doi-don-vi-npl/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createQuyDoiNPL = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/quy-doi-don-vi-npl`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateQuyDoiNPL = async (id_qd, data) => {
    try {
        const response = await axios.put(`${API_URL}/quy-doi-don-vi-npl/${id_qd}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteQuyDoiNPL = async (id_qd) => {
    try {
        const response = await axios.delete(`${API_URL}/quy-doi-don-vi-npl/${id_qd}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    // Quy đổi DN (NPL)
    getAllQuyDoiDN,
    getQuyDoiDNById,
    createQuyDoiDN,
    updateQuyDoiDN,
    deleteQuyDoiDN,
    // Quy đổi SP
    getAllQuyDoiSP,
    getQuyDoiSPById,
    createQuyDoiSP,
    updateQuyDoiSP,
    deleteQuyDoiSP,
    // Quy đổi NPL
    getAllQuyDoiNPL,
    getQuyDoiNPLById,
    createQuyDoiNPL,
    updateQuyDoiNPL,
    deleteQuyDoiNPL,
};
