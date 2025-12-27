'use strict';
const express = require('express');
const controller = require('../controllers/xuatKhoSP.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRole('business'), controller.create);
router.get('/', authenticateToken, authorizeRole('business'), controller.getAll);
router.get('/:id', authenticateToken, authorizeRole('business'), controller.getById);
router.put('/:id', authenticateToken, authorizeRole('business'), controller.update);
router.delete('/:id', authenticateToken, authorizeRole('business'), controller.delete);

// chi tiết
router.post('/:id/chi-tiet', authenticateToken, authorizeRole('business'), controller.addChiTiet);
router.get('/:id/chi-tiet', controller.getChiTiet);
router.delete('/chi-tiet/:id', authenticateToken, authorizeRole('business'), controller.deleteChiTiet);

module.exports = router;
