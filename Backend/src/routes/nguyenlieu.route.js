'use strict';

const express = require('express');
const nglController = require('../controllers/nguyenlieu.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('HaiQuan'), nglController.create);
router.get('/', nglController.getAll);
router.get('/:id_nguyenlieu', nglController.getById);
router.put('/:id_nguyenlieu', authenticateToken, authorizeRole(''), nglController.update);
router.delete('/:id_nguyenlieu', authenticateToken, authorizeRole('HaiQuan'), nglController.remove);

module.exports = router;
