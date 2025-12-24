const express = require('express');
const router = express.Router();
const khoController = require('../controllers/kho.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

router.post('/', khoController.create);
router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), khoController.getAll);

// Lấy tồn kho NPL theo kho - ĐẶT TRƯỚC route /:id để tránh conflict
router.get('/:id_kho/ton-kho-npl', authenticateToken, authorizeRole(['business', 'Admin']), khoController.getTonKhoNPLByKho);

// Lấy tồn kho SP theo kho
router.get('/:id_kho/ton-kho-sp', authenticateToken, authorizeRole(['business', 'Admin']), khoController.getTonKhoSPByKho);

router.get('/:id', khoController.getById);
router.put('/:id', khoController.update);
router.delete('/:id', khoController.delete);

module.exports = router;
