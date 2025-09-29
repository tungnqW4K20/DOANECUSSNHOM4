'use strict';

const express = require('express');
const currencyController = require('../controllers/tiente.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/",authenticateToken, authorizeRole("HaiQuan"), currencyController.createCurrency);
router.get("/", currencyController.getAllCurrencies);
router.get("/:id_tt", currencyController.getCurrencyById);


module.exports = router;


