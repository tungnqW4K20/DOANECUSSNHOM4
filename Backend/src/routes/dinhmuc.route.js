'use strict';

const express = require('express');
const dmController = require('../controllers/dinhmuc.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('business'), dmController.create);
router.get('/', dmController.getAll);
router.get('/:id_sp', dmController.getByProduct);
router.delete('/:id_dinhmuc', authenticateToken, authorizeRole('business'), dmController.remove);

module.exports = router;
