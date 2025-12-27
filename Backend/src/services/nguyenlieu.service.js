'use strict';

const db = require('../models');
const NguyenPhuLieu = db.NguyenPhuLieu;
const DonViTinhHQ = db.DonViTinhHQ;
const DoanhNghiep = db.DoanhNghiep;

const createNguyenLieu = async ({ ten_npl, mo_ta, id_dvt_hq, id_dn }) => {
  if (!ten_npl || !id_dvt_hq) throw new Error("Tên nguyên liệu và đơn vị tính là bắt buộc");
  if (!id_dn) throw new Error("Thiếu thông tin doanh nghiệp");

  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error("Đơn vị tính hải quan không tồn tại");

  // Kiểm tra trùng tên trong cùng doanh nghiệp
  const exists = await NguyenPhuLieu.findOne({ where: { ten_npl, id_dn } });
  if (exists) throw new Error(`Nguyên liệu "${ten_npl}" đã tồn tại trong doanh nghiệp này`);

  return await NguyenPhuLieu.create({ ten_npl, mo_ta, id_dvt_hq, id_dn });
};

const getAllNguyenLieu = async (id_dn, role) => {
  const whereClause = role === 'Admin' ? {} : { id_dn };

  return await NguyenPhuLieu.findAll({
    where: whereClause,
    include: [
      { model: DonViTinhHQ, as: 'donViTinhHQ', attributes: ['id_dvt_hq', 'ten_dvt'] },
      { model: DoanhNghiep, as: 'doanhNghiep', attributes: ['id_dn', 'ten_dn'] }
    ],
    order: [['id_npl', 'DESC']]
  });
};

const getNguyenLieuById = async (id_npl, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_npl } : { id_npl, id_dn };

  return await NguyenPhuLieu.findOne({
    where: whereClause,
    include: [
      { model: DonViTinhHQ, as: 'donViTinhHQ', attributes: ['id_dvt_hq', 'ten_dvt'] },
      { model: DoanhNghiep, as: 'doanhNghiep', attributes: ['id_dn', 'ten_dn'] }
    ]
  });
};

const updateNguyenLieu = async (id_npl, data, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_npl } : { id_npl, id_dn };

  const npl = await NguyenPhuLieu.findOne({ where: whereClause });
  if (!npl) throw new Error(`Không tìm thấy nguyên liệu ID=${id_npl} hoặc bạn không có quyền truy cập`);

  if (data.id_dvt_hq) {
    const dvt = await DonViTinhHQ.findByPk(data.id_dvt_hq);
    if (!dvt) throw new Error("Đơn vị tính hải quan không tồn tại");
  }

  // Không cho phép thay đổi id_dn
  delete data.id_dn;

  await npl.update({
    ten_npl: data.ten_npl || npl.ten_npl,
    mo_ta: data.mo_ta !== undefined ? data.mo_ta : npl.mo_ta,
    id_dvt_hq: data.id_dvt_hq || npl.id_dvt_hq
  });

  return npl;
};

const deleteNguyenLieu = async (id_npl, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_npl } : { id_npl, id_dn };

  const npl = await NguyenPhuLieu.findOne({ where: whereClause });
  if (!npl) throw new Error(`Không tìm thấy nguyên liệu ID=${id_npl} hoặc bạn không có quyền truy cập`);
  await npl.destroy();
};

module.exports = { createNguyenLieu, getAllNguyenLieu, getNguyenLieuById, updateNguyenLieu, deleteNguyenLieu };
