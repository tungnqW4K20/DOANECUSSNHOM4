'use strict';
const db = require('../models');
const XuatKhoNPL = db.XuatKhoNPL;
const XuatKhoNPLChiTiet = db.XuatKhoNPLChiTiet;
const Kho = db.Kho;
const NguyenPhuLieu = db.NguyenPhuLieu;

const createXuatNPL = async ({ id_kho, ngay_xuat, file_phieu }) => {
  if (!id_kho || !ngay_xuat) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_xuat)');
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

  const created = await XuatKhoNPL.create({ id_kho, ngay_xuat, file_phieu });
  return created;
};

const getAllXuatNPL = async () => {
  return await XuatKhoNPL.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: XuatKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_xuat', 'DESC']]
  });
};

const getXuatNPLById = async (id_xuat) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat, {
    include: [
      { model: Kho, as: 'kho' },
      { model: XuatKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  return rec;
};

const updateXuatNPL = async (id_xuat, data) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  await rec.update(data);
  return rec;
};

const deleteXuatNPL = async (id_xuat) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  await XuatKhoNPLChiTiet.destroy({ where: { id_xuat } });
  await rec.destroy();
};

// chi tiết
const addChiTiet = async ({ id_xuat, id_npl, so_luong }) => {
  if (!id_xuat || !id_npl || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_xuat, id_npl, so_luong)');
  const phieu = await XuatKhoNPL.findByPk(id_xuat);
  if (!phieu) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  const npl = await NguyenPhuLieu.findByPk(id_npl);
  if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

  return await XuatKhoNPLChiTiet.create({ id_xuat, id_npl, so_luong });
};

const getChiTietByPhieu = async (id_xuat) => {
  return await XuatKhoNPLChiTiet.findAll({
    where: { id_xuat },
    include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await XuatKhoNPLChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createXuatNPL, getAllXuatNPL, getXuatNPLById, updateXuatNPL, deleteXuatNPL,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
