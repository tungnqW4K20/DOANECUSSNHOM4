'use strict';

const express = require('express');
const dvtController = require('../controllers/dvtinh.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole("Admin"), dvtController.create);
router.get("/", dvtController.getAll);
router.get("/:id_dvt_hq", dvtController.getById);
router.put("/:id_dvt_hq", authenticateToken, authorizeRole("Admin"), dvtController.update);
router.delete("/:id_dvt_hq", authenticateToken, authorizeRole("Admin"), dvtController.remove);

module.exports = router;

