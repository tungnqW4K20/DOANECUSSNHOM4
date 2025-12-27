import { createApiInstance } from "./apiConfig";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/profile`;

const api = createApiInstance(API_BASE_URL);

// Lấy thông tin profile
export const getProfile = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error.response?.data || error;
  }
};

// Cập nhật thông tin profile
export const updateProfile = async (data) => {
  try {
    const response = await api.put('/', data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || error;
  }
};

// Đổi mật khẩu
export const changePassword = async (data) => {
  try {
    const response = await api.post('/change-password', data);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error.response?.data || error;
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword
};
