'use strict';
const db = require('../models');
const NhapKhoNPL = db.NhapKhoNPL;
const NhapKhoNPLChiTiet = db.NhapKhoNPLChiTiet;
const Kho = db.Kho;
const HoaDonNhap = db.HoaDonNhap;
const NguyenPhuLieu = db.NguyenPhuLieu;

const createNhapNPL = async ({ id_kho, id_hd_nhap, ngay_nhap, file_phieu }) => {
  if (!id_kho || !id_hd_nhap || !ngay_nhap) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, id_hd_nhap, ngay_nhap)');
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);
  const hd = await HoaDonNhap.findByPk(id_hd_nhap);
  if (!hd) throw new Error(`Không tìm thấy hóa đơn nhập ID=${id_hd_nhap}`);

  const created = await NhapKhoNPL.create({ id_kho, id_hd_nhap, ngay_nhap, file_phieu });
  return created;
};

const getAllNhapNPL = async () => {
  return await NhapKhoNPL.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonNhap, as: 'hoaDonNhap' },
      { model: NhapKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_nhap', 'DESC']]
  });
};

const getNhapNPLById = async (id_nhap) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap, {
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonNhap, as: 'hoaDonNhap' },
      { model: NhapKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  return rec;
};

const updateNhapNPL = async (id_nhap, data) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  await rec.update(data);
  return rec;
};

const deleteNhapNPL = async (id_nhap) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  // xóa chi tiết trước (ràng buộc)
  await NhapKhoNPLChiTiet.destroy({ where: { id_nhap } });
  await rec.destroy();
};

//
// Chi tiết
//
const addChiTiet = async ({ id_nhap, id_npl, so_luong }) => {
  if (!id_nhap || !id_npl || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_nhap, id_npl, so_luong)');
  const phieu = await NhapKhoNPL.findByPk(id_nhap);
  if (!phieu) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  const npl = await NguyenPhuLieu.findByPk(id_npl);
  if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

  return await NhapKhoNPLChiTiet.create({ id_nhap, id_npl, so_luong });
};

const getChiTietByPhieu = async (id_nhap) => {
  return await NhapKhoNPLChiTiet.findAll({
    where: { id_nhap },
    include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await NhapKhoNPLChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createNhapNPL, getAllNhapNPL, getNhapNPLById, updateNhapNPL, deleteNhapNPL,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
