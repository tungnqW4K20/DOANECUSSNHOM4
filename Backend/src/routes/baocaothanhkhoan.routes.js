const express = require('express');
const router = express.Router();
const thanhKhoanController = require('../controllers/baocaothanhkhoan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// ========== APIs cho Giao diện Người dùng (Doanh nghiệp) ==========

// API 1: Lấy danh sách Hợp đồng của Doanh nghiệp
// GET /api/user/thanh-khoan/hop-dong
router.get(
  '/hop-dong',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.getHopDong
);

// API 2: Tính toán và tạo dữ liệu Báo cáo Thanh khoản
// POST /api/user/thanh-khoan/calculate
router.post(
  '/calculate',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.calculate
);

// API 3: Lưu Báo cáo Thanh khoản
// POST /api/user/thanh-khoan/save
router.post(
  '/save',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.saveBaoCao
);

// ========== APIs bổ sung ==========

// Lấy danh sách báo cáo thanh khoản
// GET /api/user/thanh-khoan/reports
router.get(
  '/reports',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.getThanhKhoanReports
);

// Lấy chi tiết báo cáo theo ID
// GET /api/user/thanh-khoan/reports/:id_bc
router.get(
  '/reports/:id_bc',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.getBaoCaoById
);

// Cập nhật trạng thái báo cáo
// PATCH /api/user/thanh-khoan/reports/:id_bc/status
router.patch(
  '/reports/:id_bc/status',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.updateStatus
);

// Cập nhật nội dung báo cáo
// PUT /api/user/thanh-khoan/reports/:id_bc
router.put(
  '/reports/:id_bc',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.updateBaoCao
);

// Xóa báo cáo thanh khoản
// DELETE /api/user/thanh-khoan/reports/:id_bc
router.delete(
  '/reports/:id_bc',
  authenticateToken,
  authorizeRole('business'),
  thanhKhoanController.deleteBaoCao
);

module.exports = router;
