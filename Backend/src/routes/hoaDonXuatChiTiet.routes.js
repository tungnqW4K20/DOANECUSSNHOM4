const express = require('express');
const controller = require('../controllers/hoaDonXuatChiTiet.controller');
const router = express.Router();

router.get('/hoa-don/:id_hd_xuat', controller.getByHoaDon);
router.post('/', controller.create);
router.delete('/:id', controller.delete);

module.exports = router;
