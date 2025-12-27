'use strict';

const db = require('../models');
const QuyDoiDonViSP = db.QuyDoiDonViSP;
const DonViTinhHQ = db.DonViTinhHQ;
const DoanhNghiep = db.DoanhNghiep;
const SanPham = db.SanPham;

const createQD = async ({ id_dn, id_sp, ten_dvt_sp, id_dvt_hq, he_so }) => {
  if (!id_dn || !id_sp || !ten_dvt_sp || !id_dvt_hq || !he_so)
    throw new Error("Thiếu dữ liệu bắt buộc");

  const checkDN = await DoanhNghiep.findByPk(id_dn);
  if (!checkDN) throw new Error("Doanh nghiệp không tồn tại");

  const checkHQ = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!checkHQ) throw new Error("Đơn vị tính hải quan không tồn tại");

  const checkSP = await SanPham.findByPk(id_sp);
  if (!checkSP) throw new Error("Sản phẩm không tồn tại");

  return await QuyDoiDonViSP.create({ id_dn, id_sp, ten_dvt_sp, id_dvt_hq, he_so });
};

const getAllQD = async (id_dn, role) => {
  // Admin xem tất cả, doanh nghiệp chỉ xem của mình
  const whereClause = role === 'Admin' ? {} : { id_dn };
  
  return await QuyDoiDonViSP.findAll({
    where: whereClause,
    include: [
      { model: db.DonViTinhHQ, as: 'donViTinhHQ' },
      { model: db.SanPham, as: 'sanPham' }
    ]
  });
};

const getQDById = async (id_qd) => {
  return await QuyDoiDonViSP.findByPk(id_qd, {
    include: [
      { model: db.DonViTinhHQ, as: 'donViTinhHQ' },
      { model: db.SanPham, as: 'sanPham' }
    ]
  });
};

const updateQD = async (id_qd, data, id_dn, role) => {
  const qd = await QuyDoiDonViSP.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  
  // Kiểm tra quyền sở hữu (trừ Admin)
  if (role !== 'Admin' && qd.id_dn !== id_dn) {
    throw new Error('Bạn không có quyền cập nhật quy đổi này');
  }
  
  await qd.update(data);
  return qd;
};

const deleteQD = async (id_qd, id_dn, role) => {
  const qd = await QuyDoiDonViSP.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  
  // Kiểm tra quyền sở hữu (trừ Admin)
  if (role !== 'Admin' && qd.id_dn !== id_dn) {
    throw new Error('Bạn không có quyền xóa quy đổi này');
  }
  
  await qd.destroy();
};

module.exports = { createQD, getAllQD, getQDById, updateQD, deleteQD };

