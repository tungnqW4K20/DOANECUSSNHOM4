'use strict';

const express = require('express');
const nglController = require('../controllers/nguyenlieu.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả API đều yêu cầu xác thực và phân quyền theo id_dn
router.post('/', authenticateToken, authorizeRole(['Admin', 'business']), nglController.create);
router.get('/', authenticateToken, authorizeRole(['Admin', 'business']), nglController.getAll);
router.get('/:id_nguyenlieu', authenticateToken, authorizeRole(['Admin', 'business']), nglController.getById);
router.put('/:id_nguyenlieu', authenticateToken, authorizeRole(['Admin', 'business']), nglController.update);
router.delete('/:id_nguyenlieu', authenticateToken, authorizeRole(['Admin', 'business']), nglController.remove);

module.exports = router;
