const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/register', authController.registerBusiness);
router.post('/login', authController.loginBusiness);
router.post('/login-haiquan', authController.loginHaiQuan);
router.post('/refresh', authController.refreshToken);
module.exports = router;

