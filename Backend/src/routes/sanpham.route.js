'use strict';

const express = require('express');
const spController = require('../controllers/sanpham.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Thêm sản phẩm mới
router.post("/", authenticateToken, authorizeRole(["Admin", "business"]), spController.create);

// Lấy danh sách sản phẩm
router.get("/", spController.getAll);

// Lấy chi tiết sản phẩm theo ID
router.get("/:id_sp", spController.getById);

// Cập nhật sản phẩm
router.put("/:id_sp", authenticateToken, authorizeRole(["Admin", "business"]), spController.update);

// Xóa sản phẩm
router.delete("/:id_sp", authenticateToken, authorizeRole(["Admin", "business"]), spController.remove);

module.exports = router;
