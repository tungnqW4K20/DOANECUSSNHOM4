'use strict';

const db = require('../models');
const HopDong = db.HopDong;
const DoanhNghiep = db.DoanhNghiep;
const TienTe = db.TienTe;
const { Op } = db.Sequelize;

const createHD = async ({ id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong }) => {
  if (!id_dn || !so_hd || !ngay_ky) throw new Error("Thiếu dữ liệu bắt buộc");

  const exists = await HopDong.findOne({ where: { so_hd } });
  if (exists) throw new Error(`Số hợp đồng "${so_hd}" đã tồn tại`);

  return await HopDong.create({
    id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong
  });
};

const getAllHD = async () => {
  return await HopDong.findAll({
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: TienTe, as: 'tienTe' }
    ]
  });
};

const getHDById = async (id_hd) => {
  return await HopDong.findByPk(id_hd, {
    include: [
      { model: DoanhNghiep, as: 'doanhNghiep' },
      { model: TienTe, as: 'tienTe' }
    ]
  });
};

const updateHD = async (id_hd, data) => {
  const hd = await HopDong.findByPk(id_hd);
  if (!hd) throw new Error(`Không tìm thấy hợp đồng ID=${id_hd}`);
  await hd.update(data);
  return hd;
};

const deleteHD = async (id_hd) => {
  const hd = await HopDong.findByPk(id_hd);
  if (!hd) throw new Error(`Không tìm thấy hợp đồng ID=${id_hd}`);
  await hd.destroy();
};

module.exports = { createHD, getAllHD, getHDById, updateHD, deleteHD };
