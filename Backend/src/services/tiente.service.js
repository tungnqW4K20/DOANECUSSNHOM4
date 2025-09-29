'use strict';

const db = require('../models');
const TienTe = db.TienTe;
const { Op } = db.Sequelize;

const createCurrency = async (ma_tt, ten_tt) => {
    if (!ma_tt || !ten_tt) {
        throw new Error("Vui lòng nhập mã và tên tiền tệ");
    }

    const exists = await db.TienTe.findOne({ where: { ma_tt } });
    if (exists) throw new Error("Mã tiền tệ đã tồn tại");

    const currency = await db.TienTe.create({ ma_tt, ten_tt });
    return currency;
};

const getAllCurrencies = async () => {
    return await TienTe.findAll();
};

const getCurrencyById = async (id_tt) => {
  return await db.TienTe.findByPk(id_tt);
};






module.exports = {
   createCurrency,
   getAllCurrencies,
   getCurrencyById
};