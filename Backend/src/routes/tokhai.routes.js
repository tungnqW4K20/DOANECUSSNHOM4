'use strict';
const express = require('express');
const router = express.Router();
const toKhaiController = require('../controllers/to-khai.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

router.get(
  '/',
  authenticateToken,
  authorizeRole('business'),
  toKhaiController.getToKhaiList
);

module.exports = router;
