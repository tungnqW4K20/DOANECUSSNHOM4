const express = require('express');
const router = express.Router();
const khoController = require('../controllers/kho.controller');

router.post('/', khoController.create);
router.get('/', khoController.getAll);
router.get('/:id', khoController.getById);
router.put('/:id', khoController.update);
router.delete('/:id', khoController.delete);

module.exports = router;
