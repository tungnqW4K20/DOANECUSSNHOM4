'use strict';
const express = require('express');
const controller = require('../controllers/vandongnhap.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('business'), controller.create);
router.get('/', controller.getAll);
router.get('/:id_vd', controller.getById);
router.put('/:id_vd', authenticateToken, authorizeRole('business'), controller.update);
router.delete('/:id_vd', authenticateToken, authorizeRole('business'), controller.remove);

module.exports = router;
