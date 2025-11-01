import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Upload 1 file (ảnh, pdf, docx, xlsx, v.v.)
 * @param {File} file - File người dùng chọn
 * @param {string} fieldName - Tên field trong multer (ví dụ: 'fileUpload')
 */
export const uploadSingleFile = async (file, fieldName = "fileUpload") => {
    try {
        const formData = new FormData();
        formData.append(fieldName, file);

        const res = await api.post("/file-giay-to", formData);
        return res.data; // backend nên trả về URL hoặc thông tin file
    } catch (err) {
        throw err.response?.data || { message: "Lỗi khi tải tệp lên máy chủ" };
    }
};

/**
 * Upload nhiều file cùng lúc
 * @param {FileList | File[]} files
 * @param {string} fieldName
 */
export const uploadMultipleFiles = async (files, fieldName = "filesUpload") => {
    try {
        const formData = new FormData();
        Array.from(files).forEach((f) => formData.append(fieldName, f));

        const res = await api.post("/file-multi-giay-to", formData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: "Lỗi khi tải nhiều tệp lên" };
    }
};

export default {
    uploadSingleFile,
    uploadMultipleFiles,
};
