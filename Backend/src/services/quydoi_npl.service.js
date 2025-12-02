'use strict';

const db = require('../models');
const QuyDoiNPL = db.QuyDoiNPL;
const DonViTinhHQ = db.DonViTinhHQ;
const DoanhNghiep = db.DoanhNghiep;
const NguyenPhuLieu = db.NguyenPhuLieu;

const create = async ({ id_dn, id_npl, ten_dvt_dn, id_dvt_hq, he_so }) => {
  // kiểm tra dữ liệu bắt buộc
  if (!id_dn || !id_npl || !ten_dvt_dn || !id_dvt_hq || !he_so)
    throw new Error("Thiếu dữ liệu bắt buộc");

  // kiểm tra tồn tại doanh nghiệp
  const dn = await DoanhNghiep.findByPk(id_dn);
  if (!dn) throw new Error("Doanh nghiệp không tồn tại");

  // kiểm tra tồn tại NPL
  const npl = await NguyenPhuLieu.findByPk(id_npl);
  if (!npl) throw new Error("Nguyên phụ liệu không tồn tại");

  // kiểm tra tồn tại đơn vị hải quan
  const hq = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!hq) throw new Error("Đơn vị tính hải quan không tồn tại");

  return await QuyDoiNPL.create({ id_dn, id_npl, ten_dvt_dn, id_dvt_hq, he_so });
};

const getAll = async () => {
  return await QuyDoiNPL.findAll({
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: NguyenPhuLieu, as: 'nguyenPhuLieu' },
      { model: DonViTinhHQ, as: 'donViTinhHQ' }
    ]
  });
};

const getById = async (id_qd) => {
  return await QuyDoiNPL.findByPk(id_qd, {
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: NguyenPhuLieu, as: 'nguyenPhuLieu' },
      { model: DonViTinhHQ, as: 'donViTinhHQ' }
    ]
  });
};

const update = async (id_qd, data) => {
  const qd = await QuyDoiNPL.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  await qd.update(data);
  return qd;
};

const deleteOne = async (id_qd) => {
  const qd = await QuyDoiNPL.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  await qd.destroy();
};

module.exports = { create, getAll, getById, update, deleteOne };
