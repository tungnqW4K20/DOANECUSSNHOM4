'use strict';
const db = require('../models');
const HopDong = db.HopDong;
const LoHang = db.LoHang;
const HoaDonNhap = db.HoaDonNhap;
const HoaDonNhapChiTiet = db.HoaDonNhapChiTiet;
const HoaDonXuat = db.HoaDonXuat;
const HoaDonXuatChiTiet = db.HoaDonXuatChiTiet;
const DinhMucSanPham = db.DinhMucSanPham;
const NhapKhoNPLChiTiet = db.NhapKhoNPLChiTiet;
const XuatKhoNPLChiTiet = db.XuatKhoNPLChiTiet;
const BaoCaoThanhKhoan = db.BaoCaoThanhKhoan;

const { Op } = require("sequelize");

const thanhKhoanService = {};

// -----------------------------------------
// API 1 – Lấy hợp đồng
// -----------------------------------------
thanhKhoanService.getHopDongByDoanhNghiep = async (id_dn) => {
  return await HopDong.findAll({
    where: { id_dn },
    attributes: ["id_hd", "so_hd", "ngay_ky"]
  });
};
// -----------------------------------------
// API 2 – Tính toán thanh khoản
// -----------------------------------------
thanhKhoanService.calculateBaoCao = async ({ id_hd, tu_ngay, den_ngay }) => {
  if (!id_hd || !tu_ngay || !den_ngay)
    throw new Error("Thiếu dữ liệu bắt buộc");

  // lấy lô hàng của hợp đồng
  const loHangs = await LoHang.findAll({ where: { id_hd } });
  const id_lhs = loHangs.map(l => l.id_lh);

  if (id_lhs.length === 0) {
    throw new Error("Hợp đồng chưa có lô hàng nào");
  }

  // ======================================
  // 1. TỔNG NPL NHẬP
  // ======================================
  const hdNhap = await HoaDonNhap.findAll({
    where: {
      id_lh: id_lhs,
      ngay_hd: { [Op.between]: [tu_ngay, den_ngay] }
    },
    include: [{ model: HoaDonNhapChiTiet, as: "chiTiets" }]
  });

  let tong_npl_nhap = 0;

  hdNhap.forEach(hd => {
    hd.chiTiets.forEach(ct => {
      tong_npl_nhap += Number(ct.so_luong || 0);
    });
  });

  // ======================================
  // 2. TỔNG SẢN PHẨM XUẤT KHẨU
  // ======================================
  const hdXuat = await HoaDonXuat.findAll({
    where: {
      id_lh: id_lhs,
      ngay_hd: { [Op.between]: [tu_ngay, den_ngay] }
    },
    include: [{ model: HoaDonXuatChiTiet, as: "chiTiets" }]
  });

  let tong_sp_xuat = 0;

  hdXuat.forEach(hd => {
    hd.chiTiets.forEach(ct => {
      tong_sp_xuat += Number(ct.so_luong || 0);
    });
  });

  // ======================================
  // 3. NPL SỬ DỤNG = SUM( định mức * số SP xuất)
  // ======================================
  const id_sps = [...new Set(
    hdXuat.flatMap(hd => hd.chiTiets.map(ct => ct.id_sp))
  )];

  const dinhMuc = await DinhMucSanPham.findAll({
    where: { id_sp: id_sps }
  });

  let tong_npl_su_dung = 0;

  hdXuat.forEach(hd => {
    hd.chiTiets.forEach(ct => {
      const dm = dinhMuc.filter(x => x.id_sp === ct.id_sp);
      dm.forEach(x => {
        tong_npl_su_dung += Number(x.so_luong) * Number(ct.so_luong);
      });
    });
  });

  // ======================================
  // 4. TỒN NPL = NPL NHẬP - NPL ĐÃ DÙNG
  // ======================================
  const tong_npl_ton = tong_npl_nhap - tong_npl_su_dung;

  // ======================================
  // 5. KẾT LUẬN
  // ======================================
  let ket_luan = 'HopLe';

  if (tong_npl_ton < 0) {
    ket_luan = 'ViPham';
  }
  else if (tong_sp_xuat <= 0) {
    ket_luan = 'ThieuSP';
  }
  else if (tong_npl_su_dung > tong_npl_nhap) {
    ket_luan = 'DuNPL';
  }

  return {
    id_hd,
    tong_npl_nhap,
    tong_npl_su_dung,
    tong_npl_ton,
    tong_sp_xuat,
    ket_luan
  };
};
// -----------------------------------------
// API 3 – Lưu báo cáo
// -----------------------------------------
thanhKhoanService.saveBaoCaoThanhKhoan = async (data) => {
  const { id_hd, tong_npl_nhap, tong_npl_su_dung, tong_npl_ton, tong_sp_xuat, ket_luan } = data;

  if (!id_hd) throw new Error("Thiếu id_hd");

  const bc = await BaoCaoThanhKhoan.create({
    id_hd,
    tong_npl_nhap,
    tong_npl_su_dung,
    tong_npl_ton,
    tong_sp_xuat,
    ket_luan,
    trang_thai: ket_luan
  });

  return bc;
};

module.exports = thanhKhoanService;
