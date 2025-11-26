'use strict';

const express = require('express');
const currencyController = require('../controllers/tiente.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/",authenticateToken, authorizeRole("Admin"), currencyController.createCurrency);
router.get("/", currencyController.getAllCurrencies);
router.get("/:id_tt", currencyController.getCurrencyById);

router.put("/:id_tt", authenticateToken, authorizeRole("Admin"), currencyController.updateCurrency);

module.exports = router;


