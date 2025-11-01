'use strict';

const db = require('../models');
const QuyDoiDonViSP = db.QuyDoiDonViSP;
const DonViTinhHQ = db.DonViTinhHQ;

const createQD = async ({ id_sp, ten_dvt_sp, id_dvt_hq, he_so }) => {
  if (!id_sp || !ten_dvt_sp || !id_dvt_hq || !he_so) throw new Error("Thiếu dữ liệu bắt buộc");
  const exists = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!exists) throw new Error("Đơn vị tính hải quan không tồn tại");
  return await QuyDoiDonViSP.create({ id_sp, ten_dvt_sp, id_dvt_hq, he_so });
};

const getAllQD = async () => {
  return await QuyDoiDonViSP.findAll({
    include: [{ model: db.DonViTinhHQ, as: 'donViTinhHQ' }]
  });
};

const getQDById = async (id_qd) => {
  return await QuyDoiDonViSP.findByPk(id_qd, {
    include: [{ model: db.DonViTinhHQ, as: 'donViTinhHQ' }]
  });
};

const updateQD = async (id_qd, data) => {
  const qd = await QuyDoiDonViSP.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  await qd.update(data);
  return qd;
};

const deleteQD = async (id_qd) => {
  const qd = await QuyDoiDonViSP.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  await qd.destroy();
};

module.exports = { createQD, getAllQD, getQDById, updateQD, deleteQD };
