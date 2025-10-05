'use strict';

const express = require('express');
const dvtHQController = require('../controllers/donvitinhHaiQuan.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// CRUD DonViTinhHQ
router.post("/", authenticateToken, authorizeRole("HaiQuan"), dvtHQController.create);
router.get("/", dvtHQController.getAll);
router.get("/:id_dvt_hq", dvtHQController.getById);
router.put("/:id_dvt_hq", authenticateToken, authorizeRole("HaiQuan"), dvtHQController.update);
router.delete("/:id_dvt_hq", authenticateToken, authorizeRole("HaiQuan"), dvtHQController.remove);

module.exports = router;
