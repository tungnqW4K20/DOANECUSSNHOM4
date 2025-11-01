'use strict';
const express = require('express');
const controller = require('../controllers/hoadonnhap.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('business'), controller.create);
router.get('/', controller.getAll);
router.get('/:id_hd_nhap', controller.getById);
router.delete('/:id_hd_nhap', authenticateToken, authorizeRole('business'), controller.remove);

module.exports = router;
