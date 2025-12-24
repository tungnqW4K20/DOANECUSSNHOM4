'use strict';
const express = require('express');
const controller = require('../controllers/hoadonnhap.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.create);
router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.getAll);
router.get('/:id_hd_nhap', authenticateToken, authorizeRole(['business', 'Admin']), controller.getById);
router.delete('/:id_hd_nhap', authenticateToken, authorizeRole(['business', 'Admin']), controller.remove);

module.exports = router;
