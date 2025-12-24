'use strict';

const db = require('../models');
const HopDong = db.HopDong;
const DoanhNghiep = db.DoanhNghiep;
const TienTe = db.TienTe;
const { Op } = db.Sequelize;

const createHD = async ({ id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong }) => {
  if (!id_dn || !so_hd || !ngay_ky) throw new Error("Thiếu dữ liệu bắt buộc");

  // Kiểm tra số hợp đồng trùng trong cùng doanh nghiệp
  const exists = await HopDong.findOne({ where: { so_hd, id_dn } });
  if (exists) throw new Error(`Số hợp đồng "${so_hd}" đã tồn tại trong doanh nghiệp này`);

  return await HopDong.create({
    id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong
  });
};

const getAllHD = async (id_dn, role) => {
  const whereClause = role === 'Admin' ? {} : { id_dn };
  
  return await HopDong.findAll({
    where: whereClause,
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: TienTe, as: 'tienTe' }
    ],
    order: [['id_hd', 'DESC']]
  });
};

const getHDById = async (id_hd, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_hd } : { id_hd, id_dn };
  
  return await HopDong.findOne({
    where: whereClause,
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: TienTe, as: 'tienTe' }
    ]
  });
};

const updateHD = async (id_hd, data, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_hd } : { id_hd, id_dn };
  
  const hd = await HopDong.findOne({ where: whereClause });
  if (!hd) throw new Error(`Không tìm thấy hợp đồng ID=${id_hd} hoặc bạn không có quyền truy cập`);
  
  // Không cho phép thay đổi id_dn
  delete data.id_dn;
  
  await hd.update(data);
  return hd;
};

const deleteHD = async (id_hd, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_hd } : { id_hd, id_dn };
  
  const hd = await HopDong.findOne({ where: whereClause });
  if (!hd) throw new Error(`Không tìm thấy hợp đồng ID=${id_hd} hoặc bạn không có quyền truy cập`);
  await hd.destroy();
};

module.exports = { createHD, getAllHD, getHDById, updateHD, deleteHD };
