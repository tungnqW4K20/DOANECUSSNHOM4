'use strict';

const express = require('express');
const quyDoiDNController = require('../controllers/quydoi_dn.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole("Admin"), quyDoiDNController.create);
router.get("/", quyDoiDNController.getAll);
router.get("/:id_qd", quyDoiDNController.getById);
router.put("/:id_qd", authenticateToken, authorizeRole("Admin"), quyDoiDNController.update);
router.delete("/:id_qd", authenticateToken, authorizeRole("Admin"), quyDoiDNController.remove);

module.exports = router;
