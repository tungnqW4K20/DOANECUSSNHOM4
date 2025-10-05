'use strict';

const express = require('express');
const quyDoiDNController = require('../controllers/quydoi_dn.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole("HaiQuan"), quyDoiDNController.create);
router.get("/", quyDoiDNController.getAll);
router.get("/:id_qd", quyDoiDNController.getById);
router.put("/:id_qd", authenticateToken, authorizeRole("HaiQuan"), quyDoiDNController.update);
router.delete("/:id_qd", authenticateToken, authorizeRole("HaiQuan"), quyDoiDNController.remove);

module.exports = router;
