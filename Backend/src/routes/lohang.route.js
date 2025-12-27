'use strict';

const express = require('express');
const router = express.Router();

const loHangController = require('../controllers/lohang.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// =============================
// 📦 ROUTES LÔ HÀNG
// =============================

// 👉 Tạo mới (chỉ doanh nghiệp được phép)
router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.create);

// 👉 Lấy toàn bộ lô hàng
router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.getAll);

// 👉 Lấy theo ID lô hàng
router.get('/:id_lh', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.getById);

// 👉 Lấy danh sách lô hàng theo hợp đồng
router.get('/byHopDong/:id_hd', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.getByHopDong);

// 👉 Cập nhật lô hàng
router.put('/:id_lh', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.update);

// 👉 Xóa lô hàng
router.delete('/:id_lh', authenticateToken, authorizeRole(['business', 'Admin']), loHangController.remove);

module.exports = router;
