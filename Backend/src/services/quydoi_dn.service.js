'use strict';

const db = require('../models');
const QuyDoiDonViDN = db.QuyDoiDonViDN;
const DonViTinhHQ = db.DonViTinhHQ;
const DoanhNghiep = db.DoanhNghiep;

const createQD = async ({ id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so }) => {
  if (!id_dn || !id_mat_hang || !ten_dvt_dn || !id_dvt_hq || !he_so)
    throw new Error("Thiếu dữ liệu bắt buộc");

  const dn = await DoanhNghiep.findByPk(id_dn);
  if (!dn) throw new Error("Doanh nghiệp không tồn tại");

  const dvt = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!dvt) throw new Error("Đơn vị tính hải quan không tồn tại");

  return await QuyDoiDonViDN.create({ id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so });
};

const getAllQD = async (id_dn, role) => {
  // Admin xem tất cả, doanh nghiệp chỉ xem của mình
  const whereClause = role === 'Admin' ? {} : { id_dn };
  
  return await QuyDoiDonViDN.findAll({
    where: whereClause,
    include: [
      { model: db.DoanhNghiep, as: 'doanhNghiep' },
      { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
    ]
  });
};

const getQDById = async (id_qd) => {
  return await QuyDoiDonViDN.findByPk(id_qd, {
    include: [
      { model: db.DoanhNghiep, as: 'doanhNghiep' },
      { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
    ]
  });
};

const updateQD = async (id_qd, data, id_dn, role) => {
  const qd = await QuyDoiDonViDN.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  
  // Kiểm tra quyền sở hữu (trừ Admin)
  if (role !== 'Admin' && qd.id_dn !== id_dn) {
    throw new Error('Bạn không có quyền cập nhật quy đổi này');
  }
  
  await qd.update(data);
  return qd;
};

const deleteQD = async (id_qd, id_dn, role) => {
  const qd = await QuyDoiDonViDN.findByPk(id_qd);
  if (!qd) throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
  
  // Kiểm tra quyền sở hữu (trừ Admin)
  if (role !== 'Admin' && qd.id_dn !== id_dn) {
    throw new Error('Bạn không có quyền xóa quy đổi này');
  }
  
  await qd.destroy();
};

module.exports = { createQD, getAllQD, getQDById, updateQD, deleteQD };
