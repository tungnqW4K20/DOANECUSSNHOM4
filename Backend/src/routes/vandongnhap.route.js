'use strict';
const express = require('express');
const controller = require('../controllers/vandongnhap.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.create);
router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.getAll);
router.get('/:id_vd', authenticateToken, authorizeRole(['business', 'Admin']), controller.getById);
router.put('/:id_vd', authenticateToken, authorizeRole(['business', 'Admin']), controller.update);
router.delete('/:id_vd', authenticateToken, authorizeRole(['business', 'Admin']), controller.remove);

module.exports = router;
