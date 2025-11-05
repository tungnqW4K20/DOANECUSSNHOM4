'use strict';

const express = require('express');
const tygiaController = require('../controllers/tygia.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// 📌 Cập nhật tỷ giá tự động từ API (free)
// router.post('/updateFromAPI', authenticateToken, authorizeRole("HaiQuan"), tygiaController.updateFromAPI);
router.post('/updateFromAPI', authenticateToken, tygiaController.updateFromAPI);

module.exports = router;