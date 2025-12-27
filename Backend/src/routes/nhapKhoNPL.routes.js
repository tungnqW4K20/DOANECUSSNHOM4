'use strict';
const express = require('express');
const controller = require('../controllers/nhapKhoNPL.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

// CRUD phiếu nhập
router.post('/', authenticateToken, authorizeRole('business'), controller.create);
router.get('/', authenticateToken, authorizeRole('business'), controller.getAll);
router.get('/:id', authenticateToken, authorizeRole('business'), controller.getById);
router.put('/:id', authenticateToken, authorizeRole('business'), controller.update);
router.delete('/:id', authenticateToken, authorizeRole('business'), controller.delete);

// chi tiết
router.post('/:id/chi-tiet', authenticateToken, authorizeRole('business'), controller.addChiTiet); // body should contain id_npl, so_luong OR accept id_nhap from params
router.get('/:id/chi-tiet', controller.getChiTiet);
router.delete('/chi-tiet/:id', authenticateToken, authorizeRole('business'), controller.deleteChiTiet);

// Lấy số lượng NPL có thể nhập theo hóa đơn nhập
router.get('/so-luong-co-the-nhap/:id_hd_nhap', authenticateToken, authorizeRole('business'), controller.getSoLuongCoTheNhap);

module.exports = router;
