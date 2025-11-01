'use strict';
const db = require('../models');
const NhapKhoSP = db.NhapKhoSP;
const NhapKhoSPChiTiet = db.NhapKhoSPChiTiet;
const Kho = db.Kho;
const SanPham = db.SanPham;

const createNhapSP = async ({ id_kho, ngay_nhap, file_phieu }) => {
  if (!id_kho || !ngay_nhap) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_nhap)');
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);
  const created = await NhapKhoSP.create({ id_kho, ngay_nhap, file_phieu });
  return created;
};

const getAllNhapSP = async () => {
  return await NhapKhoSP.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: NhapKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ],
    order: [['id_nhap', 'DESC']]
  });
};

const getNhapSPById = async (id_nhap) => {
  const rec = await NhapKhoSP.findByPk(id_nhap, {
    include: [
      { model: Kho, as: 'kho' },
      { model: NhapKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);
  return rec;
};

const updateNhapSP = async (id_nhap, data) => {
  const rec = await NhapKhoSP.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);
  await rec.update(data);
  return rec;
};

const deleteNhapSP = async (id_nhap) => {
  const rec = await NhapKhoSP.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);
  await NhapKhoSPChiTiet.destroy({ where: { id_nhap } });
  await rec.destroy();
};

// chi tiết
const addChiTiet = async ({ id_nhap, id_sp, so_luong }) => {
  if (!id_nhap || !id_sp || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_nhap, id_sp, so_luong)');
  const phieu = await NhapKhoSP.findByPk(id_nhap);
  if (!phieu) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp}`);

  return await NhapKhoSPChiTiet.create({ id_nhap, id_sp, so_luong });
};

const getChiTietByPhieu = async (id_nhap) => {
  return await NhapKhoSPChiTiet.findAll({
    where: { id_nhap },
    include: [{ model: SanPham, as: 'sanPham' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await NhapKhoSPChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createNhapSP, getAllNhapSP, getNhapSPById, updateNhapSP, deleteNhapSP,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
