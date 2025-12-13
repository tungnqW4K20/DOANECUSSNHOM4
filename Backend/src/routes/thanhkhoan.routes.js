const express = require('express');
const router = express.Router();
const thanhKhoanController = require('../controllers/thanhkhoan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// Lấy hợp đồng theo doanh nghiệp
router.get('/hop-dong', authenticateToken, authorizeRole('business'), thanhKhoanController.getHopDong);

// Tính toán báo cáo thanh khoản (preview)
router.post('/calculate', authenticateToken, authorizeRole('business'), thanhKhoanController.calculate);

// Lưu báo cáo thanh khoản
router.post('/save', authenticateToken, authorizeRole('business'), thanhKhoanController.saveBaoCao);

module.exports = router;