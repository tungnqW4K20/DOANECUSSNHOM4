const express = require('express');
const controller = require('../controllers/vanDonXuat.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.getAll);
router.get('/:id', authenticateToken, authorizeRole(['business', 'Admin']), controller.getById);
router.post('/', authenticateToken, authorizeRole(['business', 'Admin']), controller.create);
router.put('/:id', authenticateToken, authorizeRole(['business', 'Admin']), controller.update);
router.delete('/:id', authenticateToken, authorizeRole(['business', 'Admin']), controller.delete);

module.exports = router;
