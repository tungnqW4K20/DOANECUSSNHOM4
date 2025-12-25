'use strict';

const express = require('express');
const router = express.Router();

const quyDoiNPLController = require('../controllers/quydoi_npl.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');


// Admin mới có quyền tạo / sửa / xóa
router.post("/", authenticateToken, authorizeRole("business"), quyDoiNPLController.create);
router.get("/", authenticateToken, quyDoiNPLController.getAll);
router.get("/:id_qd", authenticateToken, quyDoiNPLController.getById);
router.put("/:id_qd", authenticateToken, authorizeRole("business"), quyDoiNPLController.update);
router.delete("/:id_qd", authenticateToken, authorizeRole("business"), quyDoiNPLController.remove);

module.exports = router;
