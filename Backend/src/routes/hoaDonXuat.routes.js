const express = require('express');
const hoaDonXuatController = require('../controllers/hoaDonXuat.controller');
const router = express.Router();

router.get('/', hoaDonXuatController.getAll);
router.get('/:id', hoaDonXuatController.getById);
router.post('/', hoaDonXuatController.create);
router.put('/:id', hoaDonXuatController.update);
router.delete('/:id', hoaDonXuatController.delete);

module.exports = router;
