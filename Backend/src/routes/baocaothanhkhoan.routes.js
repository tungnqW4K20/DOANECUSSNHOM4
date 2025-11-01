'use strict';
const express = require('express');
const BaoCaoThanhKhoanController = require('../controllers/baocaothanhkhoan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// --- Báo cáo thanh khoản ---
router.post('/', authenticateToken, authorizeRole('business'), BaoCaoThanhKhoanController.create);
router.get('/', BaoCaoThanhKhoanController.getAll);
router.get('/:id_bc', BaoCaoThanhKhoanController.getById);
router.get('/hopdong/:id_hd', BaoCaoThanhKhoanController.getByHopDong);
router.put('/:id_bc', authenticateToken, authorizeRole('business'), BaoCaoThanhKhoanController.update);
router.delete('/:id_bc', authenticateToken, authorizeRole('business'), BaoCaoThanhKhoanController.remove);

module.exports = router;
