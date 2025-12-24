'use strict';
const db = require('../models');
const Kho = db.Kho;
const DoanhNghiep = db.DoanhNghiep;
const TonKhoNPL = db.TonKhoNPL;
const TonKhoSP = db.TonKhoSP;
const NguyenPhuLieu = db.NguyenPhuLieu;
const SanPham = db.SanPham;
const DonViTinhHQ = db.DonViTinhHQ;

const createKho = async ({ id_dn, ten_kho, dia_chi }) => {
  if (!id_dn || !ten_kho) throw new Error("Thiếu dữ liệu bắt buộc");
  return await Kho.create({ id_dn, ten_kho, dia_chi });
};

const getAllKho = async (id_dn) => {
  return await Kho.findAll({  where: { id_dn }, include: [{ model: DoanhNghiep, as: 'doanhNghiep' }] });
};

const getKhoById = async (id_kho) => {
  return await Kho.findByPk(id_kho, { include: [{ model: DoanhNghiep, as: 'doanhNghiep' }] });
};

const updateKho = async (id_kho, data) => {
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error("Không tìm thấy kho");
  await kho.update(data);
  return kho;
};

const deleteKho = async (id_kho) => {
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error("Không tìm thấy kho");
  await kho.destroy();
};

// Lấy tồn kho NPL theo kho
const getTonKhoNPLByKho = async (id_kho, id_dn) => {
  // Convert sang số để đảm bảo query đúng
  const khoId = parseInt(id_kho, 10);
  const dnId = parseInt(id_dn, 10);
  
  // Kiểm tra kho thuộc doanh nghiệp
  const kho = await Kho.findOne({ where: { id_kho: khoId, id_dn: dnId } });
  if (!kho) throw new Error("Kho không tồn tại hoặc bạn không có quyền truy cập");
  
  return await TonKhoNPL.findAll({
    where: { id_kho: khoId },
    include: [{
      model: NguyenPhuLieu,
      as: 'nguyenPhuLieu',
      attributes: ['id_npl', 'ten_npl', 'id_dvt_hq'],
      include: [{
        model: DonViTinhHQ,
        as: 'donViTinhHQ',
        attributes: ['ten_dvt']
      }]
    }]
  });
};

// Lấy tồn kho SP theo kho
const getTonKhoSPByKho = async (id_kho, id_dn) => {
  const khoId = parseInt(id_kho, 10);
  
  // Kiểm tra kho tồn tại
  const kho = await Kho.findByPk(khoId);
  if (!kho) throw new Error("Kho không tồn tại");
  
  const result = await TonKhoSP.findAll({
    where: { id_kho: khoId },
    include: [{
      model: SanPham,
      as: 'sanPham',
      attributes: ['id_sp', 'ten_sp', 'id_dvt_hq'],
      include: [{
        model: DonViTinhHQ,
        as: 'donViTinhHQ',
        attributes: ['ten_dvt']
      }]
    }]
  });
  
  return result;
};

module.exports = { createKho, getAllKho, getKhoById, updateKho, deleteKho, getTonKhoNPLByKho, getTonKhoSPByKho };
