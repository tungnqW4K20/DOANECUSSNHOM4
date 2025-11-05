// import axios from "axios";

// const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/to-khai-xuat`;

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // 🧩 Interceptor: tự động gắn access token nếu có
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// /* ============================================================
//    🟢 LẤY DANH SÁCH TẤT CẢ TỜ KHAI XUẤT
// ============================================================ */
// export const getAllToKhaiXuat = async () => {
//     try {
//         const res = await api.get("/");
//         return res.data; // [{...}]
//     } catch (err) {
//         console.error("❌ Lỗi getAllToKhaiXuat:", err);
//         throw err.response?.data || { message: "Lỗi khi lấy danh sách tờ khai xuất" };
//     }
// };

// /* ============================================================
//    🟢 TẠO MỚI TỜ KHAI XUẤT
// ============================================================ */
// export const createToKhaiXuat = async (payload) => {
//     try {
//         const res = await api.post("/", payload);
//         return res.data; // { message, data }
//     } catch (err) {
//         console.error("❌ Lỗi createToKhaiXuat:", err);
//         throw err.response?.data || { message: "Lỗi khi tạo tờ khai xuất" };
//     }
// };

// /* ============================================================
//    🟢 CẬP NHẬT TỜ KHAI XUẤT
// ============================================================ */
// export const updateToKhaiXuat = async (id_tkx, payload) => {
//     try {
//         const res = await api.put(`/${id_tkx}`, payload);
//         return res.data; // { message, data }
//     } catch (err) {
//         console.error("❌ Lỗi updateToKhaiXuat:", err);
//         throw err.response?.data || { message: "Lỗi khi cập nhật tờ khai xuất" };
//     }
// };

// /* ============================================================
//    🟢 XÓA TỜ KHAI XUẤT
// ============================================================ */
// export const deleteToKhaiXuat = async (id_tkx) => {
//     try {
//         const res = await api.delete(`/${id_tkx}`);
//         return res.data; // { message }
//     } catch (err) {
//         console.error("❌ Lỗi deleteToKhaiXuat:", err);
//         throw err.response?.data || { message: "Lỗi khi xóa tờ khai xuất" };
//     }
// };

// export default {
//     getAllToKhaiXuat,
//     createToKhaiXuat,
//     updateToKhaiXuat,
//     deleteToKhaiXuat,
// };
