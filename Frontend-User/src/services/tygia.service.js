import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/tygia`;

const api = createApiInstance(API_BASE_URL);

/* ============================================================
   🟢 CẬP NHẬT TỶ GIÁ TỪ API NGOÀI (qua backend)
============================================================ */
export const updateTyGiaFromAPI = async () => {
    try {
        const res = await api.post("/updateFromAPI");
        return res.data; // { success, message, data }
    } catch (err) {
        console.error("❌ Lỗi updateTyGiaFromAPI:", err);
        throw err.response?.data || { message: "Lỗi khi cập nhật tỷ giá từ API" };
    }
};

export default {
    updateTyGiaFromAPI,
};
