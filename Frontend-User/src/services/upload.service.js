import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads`;

// Create API instance with multipart/form-data header
const api = createApiInstance(API_BASE_URL);

// Override content-type for file uploads
api.defaults.headers["Content-Type"] = "multipart/form-data";

/**
 * Upload 1 file (ảnh, pdf, docx, xlsx, v.v.)
 * @param {File} file - File người dùng chọn
 */
export const uploadSingleFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("fileUpload", file);

        const res = await api.post("/file-giay-to", formData);
        return res.data; // backend nên trả về URL hoặc thông tin file
    } catch (err) {
        throw err.response?.data || { message: "Lỗi khi tải tệp lên máy chủ" };
    }
};

/**
 * Upload nhiều file cùng lúc
 * @param {FileList | File[]} files
 */
export const uploadMultipleFiles = async (files) => {
    try {
        const formData = new FormData();
        Array.from(files).forEach((f) => formData.append("fileUpload", f));

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
