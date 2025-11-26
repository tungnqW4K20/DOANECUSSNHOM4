// src/services/doanhNghiepService.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance riêng cho DoanhNghiep
const dnApi = axios.create({
  baseURL: `${API_BASE_URL}/doanh-nghiep`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn accessToken vào header (dùng token đã loginHaiQuan lưu)
dnApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllDoanhNghiep = async () => {
  try {
    const res = await dnApi.get("/"); // router.get('/', authenticateToken, authorizeRole("Admin"), ...)
    // BE trả: { success: true, data: [...] }
    return res.data;
  } catch (err) {
    console.error("getAllDoanhNghiep error:", err);
    throw err.response?.data || { message: "Lỗi kết nối máy chủ" };
  }
};

export const updateStatus = async (id_dn, status) => {
  try {
    const res = await dnApi.post("/update-status", { id_dn, status });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Không cập nhật trạng thái" };
  }
};