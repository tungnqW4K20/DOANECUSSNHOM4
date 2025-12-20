const express = require('express');
const router = express.Router();
const khoController = require('../controllers/kho.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

router.post('/', khoController.create);
router.get('/', authenticateToken, authorizeRole('business'), khoController.getAll);
router.get('/:id', khoController.getById);
router.put('/:id', khoController.update);
router.delete('/:id', khoController.delete);

module.exports = router;
