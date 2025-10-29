'use strict';
const db = require('../models');
const HoaDonNhap = db.HoaDonNhap;
const HoaDonNhapChiTiet = db.HoaDonNhapChiTiet;
const LoHang = db.LoHang;
const TienTe = db.TienTe;
const NguyenPhuLieu = db.NguyenPhuLieu;

const createHDN = async (data) => {
  const { id_lh, so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don, chi_tiets } = data;

  if (!id_lh || !so_hd || !ngay_hd) throw new Error('Thiếu dữ liệu bắt buộc');
  const lh = await LoHang.findByPk(id_lh);
  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);

  const exists = await HoaDonNhap.findOne({ where: { so_hd } });
  if (exists) throw new Error(`Số hóa đơn "${so_hd}" đã tồn tại`);

  const hoaDon = await HoaDonNhap.create({ id_lh, so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don });

  if (Array.isArray(chi_tiets)) {
    for (const ct of chi_tiets) {
      await HoaDonNhapChiTiet.create({
        id_hd_nhap: hoaDon.id_hd_nhap,
        id_npl: ct.id_npl,
        so_luong: ct.so_luong,
        don_gia: ct.don_gia,
        tri_gia: ct.tri_gia
      });
    }
  }

  return await HoaDonNhap.findByPk(hoaDon.id_hd_nhap, {
    include: [{ model: HoaDonNhapChiTiet, as: 'chiTiets' }]
  });
};

const getAllHDN = async () => {
  return await HoaDonNhap.findAll({
    include: [
      { model: LoHang, as: 'loHang' },
      { model: TienTe, as: 'tienTe' },
      { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_hd_nhap', 'DESC']]
  });
};

const getHDNById = async (id_hd_nhap) => {
  return await HoaDonNhap.findByPk(id_hd_nhap, {
    include: [
      { model: LoHang, as: 'loHang' },
      { model: TienTe, as: 'tienTe' },
      { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
};

const deleteHDN = async (id_hd_nhap) => {
  const record = await HoaDonNhap.findByPk(id_hd_nhap);
  if (!record) throw new Error('Không tìm thấy hóa đơn nhập');
  await HoaDonNhapChiTiet.destroy({ where: { id_hd_nhap } });
  await record.destroy();
};

module.exports = { createHDN, getAllHDN, getHDNById, deleteHDN };
