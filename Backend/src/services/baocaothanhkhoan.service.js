'use strict';

const db = require('../models');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

const HopDong = db.HopDong;
const DoanhNghiep = db.DoanhNghiep;
const LoHang = db.LoHang;
const HoaDonNhap = db.HoaDonNhap;
const HoaDonNhapChiTiet = db.HoaDonNhapChiTiet;
const HoaDonXuat = db.HoaDonXuat;
const HoaDonXuatChiTiet = db.HoaDonXuatChiTiet;
const NhapKhoSP = db.NhapKhoSP;
const NhapKhoSPChiTiet = db.NhapKhoSPChiTiet;
const XuatKhoSP = db.XuatKhoSP;
const XuatKhoSPChiTiet = db.XuatKhoSPChiTiet;
const NhapKhoNPL = db.NhapKhoNPL;
const NhapKhoNPLChiTiet = db.NhapKhoNPLChiTiet;
const XuatKhoNPL = db.XuatKhoNPL;
const XuatKhoNPLChiTiet = db.XuatKhoNPLChiTiet;
const DinhMucSanPham = db.DinhMucSanPham;
const SanPham = db.SanPham;
const NguyenPhuLieu = db.NguyenPhuLieu;
const BaoCaoThanhKhoan = db.BaoCaoThanhKhoan;


// ========== Helper functions ==========
const sumNhapSPBefore = async (id_sp, ngay) => {
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM NhapKhoSPChiTiet ct
    JOIN NhapKhoSP p ON p.id_nhap = ct.id_nhap
    WHERE ct.id_sp = ?
      AND p.ngay_nhap < ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_sp, ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};

// SP: tổng xuất trước kỳ
const sumXuatSPBefore = async (id_sp, ngay) => {
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM XuatKhoSPChiTiet ct
    JOIN XuatKhoSP p ON p.id_xuat = ct.id_xuat
    WHERE ct.id_sp = ?
      AND p.ngay_xuat < ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_sp, ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};

// SP: tổng nhập trong kỳ
const sumNhapSPInPeriod = async (id_sp, tu_ngay, den_ngay) => {
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM NhapKhoSPChiTiet ct
    JOIN NhapKhoSP p ON p.id_nhap = ct.id_nhap
    WHERE ct.id_sp = ?
      AND p.ngay_nhap BETWEEN ? AND ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_sp, tu_ngay, den_ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};

// NPL: tổng nhập trước kỳ
const sumNhapNPLBefore = async (id_npl, ngay) => {
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM NhapKhoNPLChiTiet ct
    JOIN NhapKhoNPL p ON p.id_nhap = ct.id_nhap
    WHERE ct.id_npl = ?
      AND p.ngay_nhap < ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_npl, ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};

// NPL: tổng xuất trước kỳ
const sumXuatNPLBefore = async (id_npl, ngay) => {
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM XuatKhoNPLChiTiet ct
    JOIN XuatKhoNPL p ON p.id_xuat = ct.id_xuat
    WHERE ct.id_npl = ?
      AND p.ngay_xuat < ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_npl, ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};

// NPL: tổng nhập trong kỳ (theo hợp đồng → theo lô hàng)
const sumNhapNPLInPeriod = async (id_npl, id_lhs, tu_ngay, den_ngay) => {
  // id_lhs là array → dùng IN (?)
  const sql = `
    SELECT SUM(ct.so_luong) AS total
    FROM HoaDonNhapChiTiet ct
    JOIN HoaDonNhap hd ON hd.id_hd_nhap = ct.id_hd_nhap
    WHERE ct.id_npl = ?
      AND hd.id_lh IN (?)
      AND hd.ngay_hd BETWEEN ? AND ?
  `;
  const rows = await db.sequelize.query(sql, {
    replacements: [id_npl, id_lhs, tu_ngay, den_ngay],
    type: QueryTypes.SELECT
  });
  return Number(rows[0]?.total || 0);
};
// ========== API 1: Lấy HĐ theo DN ==========
const getHopDongByDN = async (id_dn) => {
  return await HopDong.findAll({
    where: { id_dn },
    attributes: ['id_hd', 'so_hd']
  });
};

// ========== API 2: Tính toán báo cáo ==========
const calculateBaoCao = async ({ id_hd, tu_ngay, den_ngay }, id_dn) => {
  if (!id_hd || !tu_ngay || !den_ngay) {
    throw new Error('Thiếu dữ liệu!');
  }

  const hopDong = await HopDong.findByPk(id_hd);
  if (!hopDong) throw new Error('Hợp đồng không tồn tại');

  // 1. Thông tin chung
  const dn = await DoanhNghiep.findByPk(hopDong.id_dn);
  const thongTinChung = {
    ten_dn: dn?.ten_dn,
    dia_chi: dn?.dia_chi,
    ma_so_thue: dn?.ma_so_thue
  };

  const kyBaoCao = { id_hd, tu_ngay, den_ngay };

  // Lấy lô hàng của hợp đồng
  const loHangs = await LoHang.findAll({ where: { id_hd } });
  const id_lhs = loHangs.map((x) => x.id_lh);
  if (id_lhs.length === 0) {
    return { thongTinChung, kyBaoCao, baoCaoNXT_SP: [], baoCaoSD_NPL: [], dinhMucThucTe: [] };
  }

  // ====== 15a – NXT Sản phẩm ======
  const hoaDonXuatList = await HoaDonXuat.findAll({
    where: {
      id_lh: id_lhs,
      ngay_hd: { [Op.between]: [tu_ngay, den_ngay] }
    },
    include: [{ model: HoaDonXuatChiTiet, as: 'chiTiets' }]
  });

  // tổng SP xuất theo id_sp
  const sanPhamXuatMap = {}; // { id_sp: so_luong_xuat }
  hoaDonXuatList.forEach((hd) => {
    hd.chiTiets.forEach((ct) => {
      if (!sanPhamXuatMap[ct.id_sp]) sanPhamXuatMap[ct.id_sp] = 0;
      sanPhamXuatMap[ct.id_sp] += Number(ct.so_luong || 0);
    });
  });

  const baoCaoNXT_SP = [];

  for (const id_sp_str of Object.keys(sanPhamXuatMap)) {
    const id_sp = Number(id_sp_str);

    // tồn đầu kỳ = nhập < tu_ngay – xuất < tu_ngay
    const nhapTruoc = await sumNhapSPBefore(id_sp, tu_ngay);
    const xuatTruoc = await sumXuatSPBefore(id_sp, tu_ngay);
    const ton_dau_ky = nhapTruoc - xuatTruoc;

    // nhập trong kỳ
    const nhapTrongKy = await sumNhapSPInPeriod(id_sp, tu_ngay, den_ngay);

    const xuatTrongKy = sanPhamXuatMap[id_sp];

    const ton_cuoi_ky = ton_dau_ky + nhapTrongKy - xuatTrongKy;
    const ghiChu = ton_cuoi_ky < 0 ? 'Cảnh báo: Tồn kho âm. Kiểm tra lại số liệu xuất/nhập.' : '';

    baoCaoNXT_SP.push({
      id_sp,
      ton_dau_ky,
      nhap_trong_ky: nhapTrongKy,
      thay_doi_muc_dich: 0,
      xuat_khau: xuatTrongKy,
      xuat_khac: 0,
      ton_cuoi_ky,
      ghi_chu: ghiChu
    });
  }

  // ====== 15b – Sử dụng NPL ======
  const nplIdSet = new Set();

  // NPL nhập theo hợp đồng
  const hoaDonNhapList = await HoaDonNhap.findAll({
    where: { id_lh: id_lhs },
    include: [{ model: HoaDonNhapChiTiet, as: 'chiTiets' }]
  });
  hoaDonNhapList.forEach((hd) => {
    hd.chiTiets.forEach((ct) => nplIdSet.add(ct.id_npl));
  });

  // NPL từ định mức của SP đã xuất
  const dmList = await DinhMucSanPham.findAll({
    where: { id_sp: Object.keys(sanPhamXuatMap) }
  });
  dmList.forEach((dm) => nplIdSet.add(dm.id_npl));

  const baoCaoSD_NPL = [];

  for (const id_npl of nplIdSet) {
    // tồn đầu kỳ NPL
    const tonNhapTruoc = await sumNhapNPLBefore(id_npl, tu_ngay);
    const tonXuatTruoc = await sumXuatNPLBefore(id_npl, tu_ngay);
    const ton_dau_ky = tonNhapTruoc - tonXuatTruoc;

    // nhập NPL trong kỳ – theo hợp đồng (id_lhs)
    const nhapTrongKy = await sumNhapNPLInPeriod(id_npl, id_lhs, tu_ngay, den_ngay);

    // Xuất cho sản xuất (dùng định mức * lượng SP xuất)
    let xuat_san_pham = 0;
    for (const spRow of baoCaoNXT_SP) {
      const dmRow = dmList.find((x) => x.id_sp === spRow.id_sp && x.id_npl === Number(id_npl));
      if (dmRow) {
        xuat_san_pham += Number(dmRow.so_luong || 0) * Number(spRow.xuat_khau || 0);
      }
    }

    const ton_cuoi_ky = ton_dau_ky + nhapTrongKy - xuat_san_pham;

    const ghiChuList = [];
    if (ton_cuoi_ky < 0) {
      ghiChuList.push('Cảnh báo: Tồn kho âm. Kiểm tra định mức hoặc phiếu xuất/nhập.');
    }
    const tongNPLNhapTrongKy = nhapTrongKy;
    if (xuat_san_pham > tongNPLNhapTrongKy) {
      ghiChuList.push(
        'Cảnh báo: Lượng NPL sử dụng cho sản xuất lớn hơn lượng nhập trong kỳ theo hợp đồng.'
      );
    }

    baoCaoSD_NPL.push({
      id_npl: Number(id_npl),
      ton_dau_ky,
      tai_nhap: 0,
      nhap_khac: nhapTrongKy,
      xuat_san_pham,
      thay_doi_muc_dich: 0,
      ton_cuoi_ky,
      ghi_chu: ghiChuList.join(' ')
    });
  }

  // ====== 16 – Định mức thực tế ======
  const dinhMucThucTe = await DinhMucSanPham.findAll({
    where: { id_sp: Object.keys(sanPhamXuatMap) },
    include: [
      { model: SanPham, as: 'sanPham' },
      { model: NguyenPhuLieu, as: 'nguyenPhuLieu' }
    ]
  });

  return {
    thongTinChung,
    kyBaoCao,
    baoCaoNXT_SP,
    baoCaoSD_NPL,
    dinhMucThucTe
  };
};


// ========== API 3: Lưu báo cáo ==========
const saveBaoCao = async ({ id_hd, tu_ngay, den_ngay, ket_luan_tong_the, data_snapshot }) => {
  if (!id_hd || !tu_ngay || !den_ngay) {
    throw new Error('Thiếu dữ liệu để lưu báo cáo');
  }

  // TODO: đảm bảo model BaoCaoThanhKhoan có các cột tu_ngay, den_ngay, data_snapshot (JSON)
  const record = await BaoCaoThanhKhoan.create({
    id_hd,
    thoi_gian_tao: new Date(),
    tong_npl_nhap: data_snapshot?.tong_npl_nhap || null,
    tong_npl_su_dung: data_snapshot?.tong_npl_su_dung || null,
    tong_npl_ton: data_snapshot?.tong_npl_ton || null,
    tong_sp_xuat: data_snapshot?.tong_sp_xuat || null,
    ket_luan: ket_luan_tong_the || 'HopLe',
    trang_thai: ket_luan_tong_the || 'HopLe',
    data_snapshot, // cột JSON trong DB
    tu_ngay,
    den_ngay
  });

  return record;
};

module.exports = { getHopDongByDN, calculateBaoCao, saveBaoCao };
