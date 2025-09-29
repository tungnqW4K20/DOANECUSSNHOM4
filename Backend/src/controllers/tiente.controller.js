'use strict';

const currencyService = require('../services/tiente.service');

const createCurrency = async (req, res) => {
  try {
    const { ma_tt, ten_tt } = req.body;
    const result = await currencyService.createCurrency(ma_tt, ten_tt);

    res.status(201).json({
      success: true,
      message: "Tạo tiền tệ thành công",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const result = await currencyService.getAllCurrencies();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getCurrencyById = async (req, res) => {
  try {
    const { id_tt } = req.params;
    const result = await currencyService.getCurrencyById(id_tt);

    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = {
    createCurrency,
    getAllCurrencies,
    getCurrencyById
};