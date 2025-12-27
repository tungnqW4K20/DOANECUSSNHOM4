const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/profile - Lấy thông tin profile
router.get('/', profileController.getProfile);

// PUT /api/profile - Cập nhật thông tin profile
router.put('/', profileController.updateProfile);

// POST /api/profile/change-password - Đổi mật khẩu
router.post('/change-password', profileController.changePassword);

module.exports = router;
