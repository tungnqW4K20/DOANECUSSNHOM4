import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động gắn admin token nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminAuthToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor xử lý response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn, redirect về login (chỉ khi không phải đang ở trang login)
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                localStorage.removeItem('adminAuthToken');
                localStorage.removeItem('adminRefreshToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// API cho tiền tệ
export const currencyAPI = {
    getAll: () => api.get('/tiente'),
    getById: (id) => api.get(`/tiente/${id}`),
    create: (data) => api.post('/tiente', data),
    update: (id, data) => api.put(`/tiente/${id}`, data),
    delete: (id) => api.delete(`/tiente/${id}`),
};

// API cho đơn vị tính hải quan
export const unitAPI = {
    getAll: () => api.get('/don-vi-tinh-hai-quan'),
    getById: (id) => api.get(`/don-vi-tinh-hai-quan/${id}`),
    create: (data) => api.post('/don-vi-tinh-hai-quan', data),
    update: (id, data) => api.put(`/don-vi-tinh-hai-quan/${id}`, data),
    delete: (id) => api.delete(`/don-vi-tinh-hai-quan/${id}`),
};

// API cho tờ khai hải quan
export const customsDeclarationAPI = {
    // Tờ khai nhập
    getImportDeclarations: () => api.get('/to-khai-nhap'),
    getImportDeclarationById: (id) => api.get(`/to-khai-nhap/${id}`),
    createImportDeclaration: (data) => api.post('/to-khai-nhap', data),
    updateImportDeclaration: (id, data) => api.put(`/to-khai-nhap/${id}`, data),
    deleteImportDeclaration: (id) => api.delete(`/to-khai-nhap/${id}`),

    // Tờ khai xuất
    getExportDeclarations: () => api.get('/to-khai-xuat'),
    getExportDeclarationById: (id) => api.get(`/to-khai-xuat/${id}`),
    createExportDeclaration: (data) => api.post('/to-khai-xuat', data),
    updateExportDeclaration: (id, data) => api.put(`/to-khai-xuat/${id}`, data),
    deleteExportDeclaration: (id) => api.delete(`/to-khai-xuat/${id}`),
};

// API cho báo cáo thanh khoản hợp đồng
export const contractLiquidityAPI = {
    getAll: () => api.get('/bao-cao-thanh-khoan'),
    getById: (id) => api.get(`/bao-cao-thanh-khoan/${id}`),
    getByContract: (contractId) => api.get(`/bao-cao-thanh-khoan/hopdong/${contractId}`),
};

// API cho doanh nghiệp (để lấy thông tin trong báo cáo)
export const businessAPI = {
    getAll: () => api.get('/doanh-nghiep'),
    getById: (id) => api.get(`/doanh-nghiep/${id}`),
};

// API cho quản lý doanh nghiệp (Admin)
export const businessAdminAPI = {
    // Lấy danh sách doanh nghiệp với phân trang và filter
    getAll: (params = {}) => api.get('/doanh-nghiep', { params }),
    
    // Lấy chi tiết doanh nghiệp
    getById: (id) => api.get(`/doanh-nghiep/${id}`),
    
    // Duyệt doanh nghiệp
    approve: (id) => api.post(`/doanh-nghiep/approve`, { idDoanhNghiep: id }),
    
    // Từ chối doanh nghiệp
    reject: (id, reason = '') => api.post(`/doanh-nghiep/reject`, {
        idDoanhNghiep: id,
        ly_do_tu_choi: reason
    }),
    
    // Upload giấy phép kinh doanh
    uploadLicense: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_dn', id);
        return api.post('/upload/file-giay-to', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    // Cập nhật thông tin doanh nghiệp
    update: (id, data) => api.put(`/doanh-nghiep/${id}`, data),
    
    // Xóa doanh nghiệp (soft delete)
    delete: (id) => api.delete(`/doanh-nghiep/${id}`),
};

export default api;