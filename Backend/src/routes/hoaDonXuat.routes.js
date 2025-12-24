const express = require('express');
const hoaDonXuatController = require('../controllers/hoaDonXuat.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), hoaDonXuatController.getAll);
router.get('/:id', authenticateToken, authorizeRole(['business', 'Admin']), hoaDonXuatController.getById);
router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), hoaDonXuatController.create);
router.put('/:id', authenticateToken, authorizeRole(['business', 'Admin']), hoaDonXuatController.update);
router.delete('/:id', authenticateToken, authorizeRole(['business', 'Admin']), hoaDonXuatController.delete);

module.exports = router;
