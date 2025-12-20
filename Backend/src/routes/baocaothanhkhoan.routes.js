const express = require('express');
const router = express.Router();
const thanhKhoanController = require('../controllers/thanhkhoan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// API 1: danh sách hợp đồng
router.get(
  '/hop-dong',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.getHopDong
);

// API 2: tính toán báo cáo
router.post(
  '/calculate',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.calculate
);

// API 3: lưu báo cáo
router.post(
  '/thanh-khoan/save',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.saveBaoCao
);

module.exports = router;
