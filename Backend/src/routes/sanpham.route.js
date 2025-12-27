'use strict';

const express = require('express');
const spController = require('../controllers/sanpham.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả API đều yêu cầu xác thực và phân quyền theo id_dn
router.post("/", authenticateToken, authorizeRole(["Admin", "business"]), spController.create);
router.get("/", authenticateToken, authorizeRole(["Admin", "business"]), spController.getAll);
router.get("/:id_sp", authenticateToken, authorizeRole(["Admin", "business"]), spController.getById);
router.put("/:id_sp", authenticateToken, authorizeRole(["Admin", "business"]), spController.update);
router.delete("/:id_sp", authenticateToken, authorizeRole(["Admin", "business"]), spController.remove);

module.exports = router;
