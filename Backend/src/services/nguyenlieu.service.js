'use strict';
const db = require('../models');
const NguyenPhuLieu = db.NguyenPhuLieu;
const DonViTinhHQ = db.DonViTinhHQ;

const createNguyenLieu = async ({ ten_npl, mo_ta, id_dvt_hq }) => {
  if (!ten_npl || !id_dvt_hq) throw new Error("Tên nguyên liệu và đơn vị tính là bắt buộc");
  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error("Đơn vị tính hải quan không tồn tại");
  return await NguyenPhuLieu.create({ ten_npl, mo_ta, id_dvt_hq });
};

const getAllNguyenLieu = async () => {
  return await NguyenPhuLieu.findAll({ include: ['donViTinhHQ'] });
};

const getNguyenLieuById = async (id) => {
  return await NguyenPhuLieu.findByPk(id, { include: ['donViTinhHQ'] });
};

const updateNguyenLieu = async (id, { ten_npl, mo_ta, id_dvt_hq }) => {
  const ngl = await NguyenPhuLieu.findByPk(id);
  if (!ngl) throw new Error("Không tìm thấy nguyên liệu");
  await ngl.update({ ten_npl, mo_ta, id_dvt_hq });
  return ngl;
};

const deleteNguyenLieu = async (id) => {
  const ngl = await NguyenPhuLieu.findByPk(id);
  if (!ngl) throw new Error("Không tìm thấy nguyên liệu");
  await ngl.destroy();
};

module.exports = { createNguyenLieu, getAllNguyenLieu, getNguyenLieuById, updateNguyenLieu, deleteNguyenLieu };
