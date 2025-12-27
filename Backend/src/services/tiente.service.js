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

const getAllCurrencies = async ({ page = 1, limit = 10, search = '' } = {}) => {
    const offset = (page - 1) * limit;
    
    // Điều kiện tìm kiếm
    const whereCondition = {};
    if (search) {
        whereCondition[Op.or] = [
            { ma_tt: { [Op.like]: `%${search}%` } },
            { ten_tt: { [Op.like]: `%${search}%` } }
        ];
    }
    
    const { rows, count } = await TienTe.findAndCountAll({
        where: whereCondition,
        order: [['id_tt', 'DESC']],
        offset,
        limit
    });
    
    return {
        data: rows,
        pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

const getCurrencyById = async (id_tt) => {
  return await db.TienTe.findByPk(id_tt);
};


const updateCurrency = async (id_tt, updateData) => {
  const { ma_tt, ten_tt } = updateData;

  if (!ma_tt && !ten_tt) {
    throw new Error("Cần cung cấp ít nhất mã hoặc tên tiền tệ để cập nhật");
  }

  const currency = await TienTe.findByPk(id_tt);
  if (!currency) {
    throw new Error(`Không tìm thấy tiền tệ với ID ${id_tt}`);
  }

  if (ma_tt) {
    const exists = await TienTe.findOne({
      where: {
        ma_tt,
        id_tt: { [Op.ne]: id_tt }
      }
    });
    if (exists) {
      throw new Error(`Mã tiền tệ "${ma_tt}" đã tồn tại`);
    }
  }

  await currency.update({
    ma_tt: ma_tt || currency.ma_tt,
    ten_tt: ten_tt || currency.ten_tt
  });

  return currency;
};


module.exports = {
   createCurrency,
   getAllCurrencies,
   getCurrencyById,
   updateCurrency
};