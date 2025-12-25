'use strict';

const express = require('express');
const quyDoiSPController = require('../controllers/quydoi_sp.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole("business"), quyDoiSPController.create);
router.get("/", authenticateToken, quyDoiSPController.getAll);
router.get("/:id_qd", authenticateToken, quyDoiSPController.getById);
router.put("/:id_qd", authenticateToken, authorizeRole("business"), quyDoiSPController.update);
router.delete("/:id_qd", authenticateToken, authorizeRole("business"), quyDoiSPController.remove);

module.exports = router;
