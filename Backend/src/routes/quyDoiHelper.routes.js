'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/quyDoiHelper.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

// Middleware xác thực cho tất cả routes
router.use(authenticateToken);
router.use(authorizeRole(['business', 'Admin']));

// Lấy danh sách quy đổi
router.get('/npl/:id_npl', controller.getQuyDoiListNPL);
router.get('/sp/:id_sp', controller.getQuyDoiListSP);

// Tính toán quy đổi DN -> HQ
router.post('/npl/dn-to-hq', controller.calculateNPL_DN_to_HQ);
router.post('/sp/dn-to-hq', controller.calculateSP_DN_to_HQ);

// Tính toán quy đổi HQ -> DN
router.post('/npl/hq-to-dn', controller.calculateNPL_HQ_to_DN);
router.post('/sp/hq-to-dn', controller.calculateSP_HQ_to_DN);

module.exports = router;
