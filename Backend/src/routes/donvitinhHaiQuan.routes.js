'use strict';

const express = require('express');
const dvtHQController = require('../controllers/donvitinhHaiQuan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// CRUD DonViTinhHQ
router.post("/", authenticateToken, authorizeRole("Admin"), dvtHQController.create);
router.get("/", dvtHQController.getAll);
router.get("/:id_dvt_hq", dvtHQController.getById);
router.put("/:id_dvt_hq", authenticateToken, authorizeRole("Admin"), dvtHQController.update);
router.delete("/:id_dvt_hq", authenticateToken, authorizeRole("Admin"), dvtHQController.remove);

module.exports = router;
