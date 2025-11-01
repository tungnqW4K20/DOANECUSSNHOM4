'use strict';

const express = require('express');
const hopDongController = require('../controllers/hopdong.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('business'), hopDongController.create);
router.get('/', hopDongController.getAll);
router.get('/:id_hd', hopDongController.getById);
router.put('/:id_hd', authenticateToken, authorizeRole('business'), hopDongController.update);
router.delete('/:id_hd', authenticateToken, authorizeRole('business'), hopDongController.remove);

module.exports = router;
