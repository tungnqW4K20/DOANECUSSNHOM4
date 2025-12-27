'use strict';

const express = require('express');
const hopDongController = require('../controllers/hopdong.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), hopDongController.create);
router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), hopDongController.getAll);
router.get('/:id_hd', authenticateToken, authorizeRole(['business', 'Admin']), hopDongController.getById);
router.put('/:id_hd', authenticateToken, authorizeRole(['business', 'Admin']), hopDongController.update);
router.delete('/:id_hd', authenticateToken, authorizeRole(['business', 'Admin']), hopDongController.remove);

module.exports = router;
