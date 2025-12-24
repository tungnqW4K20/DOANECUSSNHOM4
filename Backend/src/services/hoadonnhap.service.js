'use strict';
const db = require('../models');
const HoaDonNhap = db.HoaDonNhap;
const HoaDonNhapChiTiet = db.HoaDonNhapChiTiet;
const LoHang = db.LoHang;
const TienTe = db.TienTe;
const NguyenPhuLieu = db.NguyenPhuLieu;
const HopDong = db.HopDong;

const createHDN = async (data, id_dn, role) => {
  const { id_lh, so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don, chi_tiets } = data;

  if (!id_lh || !so_hd || !ngay_hd) throw new Error('Thiếu dữ liệu bắt buộc');

  // Kiểm tra lô hàng thuộc doanh nghiệp
  const includeHopDong = role === 'Admin' ? [] : [{
    model: HopDong,
    as: 'hopDong',
    where: { id_dn },
    required: true
  }];

  const lh = await LoHang.findOne({
    where: { id_lh },
    include: includeHopDong
  });

  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh} hoặc bạn không có quyền truy cập`);

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

const getAllHDN = async (id_dn, role) => {
  if (role === 'Admin') {
    return await HoaDonNhap.findAll({
      include: [
        { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
        { model: TienTe, as: 'tienTe' },
        { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
      ],
      order: [['id_hd_nhap', 'DESC']]
    });
  }

  return await HoaDonNhap.findAll({
    include: [
      {
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{
          model: HopDong,
          as: 'hopDong',
          where: { id_dn },
          required: true
        }]
      },
      { model: TienTe, as: 'tienTe' },
      { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_hd_nhap', 'DESC']]
  });
};

const getHDNById = async (id_hd_nhap, id_dn, role) => {
  if (role === 'Admin') {
    return await HoaDonNhap.findByPk(id_hd_nhap, {
      include: [
        { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
        { model: TienTe, as: 'tienTe' },
        { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
      ]
    });
  }

  return await HoaDonNhap.findOne({
    where: { id_hd_nhap },
    include: [
      {
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{
          model: HopDong,
          as: 'hopDong',
          where: { id_dn },
          required: true
        }]
      },
      { model: TienTe, as: 'tienTe' },
      { model: HoaDonNhapChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
};

const deleteHDN = async (id_hd_nhap, id_dn, role) => {
  let record;

  if (role === 'Admin') {
    record = await HoaDonNhap.findByPk(id_hd_nhap);
  } else {
    record = await HoaDonNhap.findOne({
      where: { id_hd_nhap },
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{
          model: HopDong,
          as: 'hopDong',
          where: { id_dn },
          required: true
        }]
      }]
    });
  }

  if (!record) throw new Error('Không tìm thấy hóa đơn nhập hoặc bạn không có quyền truy cập');
  await HoaDonNhapChiTiet.destroy({ where: { id_hd_nhap } });
  await record.destroy();
};

const updateHDN = async (id_hd_nhap, data, id_dn, role) => {
  const { so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don, chi_tiets } = data;

  let record;
  if (role === 'Admin') {
    record = await HoaDonNhap.findByPk(id_hd_nhap);
  } else {
    record = await HoaDonNhap.findOne({
      where: { id_hd_nhap },
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{
          model: HopDong,
          as: 'hopDong',
          where: { id_dn },
          required: true
        }]
      }]
    });
  }

  if (!record) throw new Error('Không tìm thấy hóa đơn nhập hoặc bạn không có quyền truy cập');

  // Cập nhật thông tin hóa đơn
  await record.update({ so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don });

  // Cập nhật chi tiết nếu có
  if (Array.isArray(chi_tiets)) {
    await HoaDonNhapChiTiet.destroy({ where: { id_hd_nhap } });
    for (const ct of chi_tiets) {
      await HoaDonNhapChiTiet.create({
        id_hd_nhap,
        id_npl: ct.id_npl,
        so_luong: ct.so_luong,
        don_gia: ct.don_gia,
        tri_gia: ct.tri_gia
      });
    }
  }

  return await HoaDonNhap.findByPk(id_hd_nhap, {
    include: [{ model: HoaDonNhapChiTiet, as: 'chiTiets' }]
  });
};

module.exports = { createHDN, getAllHDN, getHDNById, deleteHDN, updateHDN };
