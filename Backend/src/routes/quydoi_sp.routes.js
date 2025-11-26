'use strict';

const express = require('express');
const quyDoiSPController = require('../controllers/quydoi_sp.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole("Admin"), quyDoiSPController.create);
router.get("/", quyDoiSPController.getAll);
router.get("/:id_qd", quyDoiSPController.getById);
router.put("/:id_qd", authenticateToken, authorizeRole("Admin"), quyDoiSPController.update);
router.delete("/:id_qd", authenticateToken, authorizeRole("Admin"), quyDoiSPController.remove);

module.exports = router;
