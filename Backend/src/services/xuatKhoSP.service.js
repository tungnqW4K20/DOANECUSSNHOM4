'use strict';
const db = require('../models');
const XuatKhoSP = db.XuatKhoSP;
const XuatKhoSPChiTiet = db.XuatKhoSPChiTiet;
const Kho = db.Kho;
const SanPham = db.SanPham;
const HoaDonXuat = db.HoaDonXuat;

const createXuatSP = async ({ id_kho, id_hd_xuat, ngay_xuat, file_phieu }) => {
  if (!id_kho || !ngay_xuat) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_xuat)');
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);
  if (id_hd_xuat) {
    const hd = await HoaDonXuat.findByPk(id_hd_xuat);
    if (!hd) throw new Error(`Không tìm thấy hóa đơn xuất ID=${id_hd_xuat}`);
  }
  const created = await XuatKhoSP.create({ id_kho, id_hd_xuat, ngay_xuat, file_phieu });
  return created;
};

const getAllXuatSP = async () => {
  return await XuatKhoSP.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonXuat, as: 'hoaDonXuat' },
      { model: XuatKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ],
    order: [['id_xuat', 'DESC']]
  });
};

const getXuatSPById = async (id_xuat) => {
  const rec = await XuatKhoSP.findByPk(id_xuat, {
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonXuat, as: 'hoaDonXuat' },
      { model: XuatKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất SP ID=${id_xuat}`);
  return rec;
};

const updateXuatSP = async (id_xuat, data) => {
  const rec = await XuatKhoSP.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất SP ID=${id_xuat}`);
  await rec.update(data);
  return rec;
};

const deleteXuatSP = async (id_xuat) => {
  const rec = await XuatKhoSP.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất SP ID=${id_xuat}`);
  await XuatKhoSPChiTiet.destroy({ where: { id_xuat } });
  await rec.destroy();
};

// chi tiết
const addChiTiet = async ({ id_xuat, id_sp, so_luong }) => {
  if (!id_xuat || !id_sp || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_xuat, id_sp, so_luong)');
  const phieu = await XuatKhoSP.findByPk(id_xuat);
  if (!phieu) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp}`);

  return await XuatKhoSPChiTiet.create({ id_xuat, id_sp, so_luong });
};

const getChiTietByPhieu = async (id_xuat) => {
  return await XuatKhoSPChiTiet.findAll({
    where: { id_xuat },
    include: [{ model: SanPham, as: 'sanPham' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await XuatKhoSPChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createXuatSP, getAllXuatSP, getXuatSPById, updateXuatSP, deleteXuatSP,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
