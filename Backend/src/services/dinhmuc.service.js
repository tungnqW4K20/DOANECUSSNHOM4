'use strict';
const db = require('../models');
const DinhMucSanPham = db.DinhMucSanPham;
const NguyenPhuLieu = db.NguyenPhuLieu;
const SanPham = db.SanPham;

const createDinhMucSanPham = async ({ id_sp, dinh_muc_chi_tiet }) => {
  if (!id_sp || !Array.isArray(dinh_muc_chi_tiet) || dinh_muc_chi_tiet.length === 0)
    throw new Error("Thiếu dữ liệu định mức");

  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error("Sản phẩm không tồn tại");

  const records = [];
  for (const item of dinh_muc_chi_tiet) {
    const { id_nguyen_lieu, so_luong, ghi_chu } = item;
    const nl = await NguyenPhuLieu.findByPk(id_nguyen_lieu);
    if (!nl) throw new Error(`Nguyên liệu ID=${id_nguyen_lieu} không tồn tại`);
    const created = await DinhMucSanPham.create({ id_sp, id_nguyenlieu: id_nguyen_lieu, so_luong, ghi_chu });
    records.push(created);
  }

  return records;
};

const getAllDinhMuc = async () => {
  return await DinhMucSanPham.findAll({ include: ['sanPham', 'nguyenPhuLieu'] });
};

const getDinhMucByProduct = async (id_sp) => {
  return await DinhMucSanPham.findAll({
    where: { id_sp },
    include: ['nguyenPhuLieu']
  });
};

const deleteDinhMuc = async (id) => {
  const dm = await DinhMucSanPham.findByPk(id);
  if (!dm) throw new Error("Không tìm thấy định mức");
  await dm.destroy();
};

module.exports = { createDinhMucSanPham, getAllDinhMuc, getDinhMucByProduct, deleteDinhMuc };
