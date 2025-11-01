'use strict';

const db = require('../models');
const DonViTinhHQ = db.DonViTinhHQ;

const createDVT_HQ = async ({ ten_dvt, mo_ta }) => {
  if (!ten_dvt) throw new Error("Tên đơn vị tính HQ là bắt buộc");

  // check tồn tại
  const exists = await DonViTinhHQ.findOne({ where: { ten_dvt } });
  if (exists) throw new Error(`Đơn vị tính HQ "${ten_dvt}" đã tồn tại`);

  return await DonViTinhHQ.create({ ten_dvt, mo_ta });
};

const getAllDVT_HQ = async () => {
  return await DonViTinhHQ.findAll({
    include: [
      { model: db.QuyDoiDonViSP, as: 'quyDoiDonViSPs' },
      { model: db.QuyDoiDonViDN, as: 'quyDoiDonVis' }
    ]
  });
};

const getDVT_HQById = async (id_dvt_hq) => {
  return await DonViTinhHQ.findByPk(id_dvt_hq, {
    include: [
      { model: db.QuyDoiDonViSP, as: 'quyDoiDonViSPs' },
      { model: db.QuyDoiDonViDN, as: 'quyDoiDonVis' }
    ]
  });
};

const updateDVT_HQ = async (id_dvt_hq, { ten_dvt, mo_ta }) => {
  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error(`Không tìm thấy đơn vị tính HQ ID=${id_dvt_hq}`);

  await dvt.update({
    ten_dvt: ten_dvt || dvt.ten_dvt,
    mo_ta: mo_ta !== undefined ? mo_ta : dvt.mo_ta
  });

  return dvt;
};

const deleteDVT_HQ = async (id_dvt_hq) => {
  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error(`Không tìm thấy đơn vị tính HQ ID=${id_dvt_hq}`);
  await dvt.destroy();
};

module.exports = { 
  createDVT_HQ,
  getAllDVT_HQ,
  getDVT_HQById,
  updateDVT_HQ,
  deleteDVT_HQ
};
