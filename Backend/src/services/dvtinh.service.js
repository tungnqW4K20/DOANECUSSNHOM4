'use strict';

const db = require('../models');
const DonViTinhHQ = db.DonViTinhHQ;
const { Op } = db.Sequelize;

const createDVT = async ({ ma_dvt, ten_dvt, mo_ta }) => {
  if (!ma_dvt || !ten_dvt) {
    throw new Error("Mã và tên đơn vị tính là bắt buộc");
  }

  const exists = await DonViTinhHQ.findOne({ where: { ma_dvt } });
  if (exists) throw new Error(`Mã đơn vị tính "${ma_dvt}" đã tồn tại`);

  return await DonViTinhHQ.create({ ma_dvt, ten_dvt, mo_ta });
};

const getAllDVT = async () => {
  return await DonViTinhHQ.findAll();
};

const getDVTById = async (id_dvt_hq) => {
  return await DonViTinhHQ.findByPk(id_dvt_hq);
};

const updateDVT = async (id_dvt_hq, { ma_dvt, ten_dvt, mo_ta }) => {
  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error(`Không tìm thấy đơn vị tính ID=${id_dvt_hq}`);

  if (ma_dvt) {
    const exists = await DonViTinhHQ.findOne({
      where: { ma_dvt, id_dvt_hq: { [Op.ne]: id_dvt_hq } }
    });
    if (exists) throw new Error(`Mã đơn vị tính "${ma_dvt}" đã tồn tại`);
  }

  await dvt.update({
    ma_dvt: ma_dvt || dvt.ma_dvt,
    ten_dvt: ten_dvt || dvt.ten_dvt,
    mo_ta: mo_ta !== undefined ? mo_ta : dvt.mo_ta
  });

  return dvt;
};

const deleteDVT = async (id_dvt_hq) => {
  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error(`Không tìm thấy đơn vị tính ID=${id_dvt_hq}`);
  await dvt.destroy();
};

module.exports = { 
    createDVT,
    getAllDVT, 
    getDVTById, 
    updateDVT, 
    deleteDVT
 };
