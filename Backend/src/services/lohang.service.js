'use strict';

const db = require('../models');
const LoHang = db.LoHang;
const HopDong = db.HopDong;

/**
 * ===============================
 *  DỊCH VỤ (SERVICE) LÔ HÀNG
 * ===============================
 */
const createLH = async ({ id_hd, ngay_dong_goi, ngay_xuat_cang, cang_xuat, cang_nhap, file_chung_tu }) => {
  // --- Kiểm tra dữ liệu bắt buộc ---
  if (!id_hd) throw new Error('Thiếu ID hợp đồng');

  // --- Kiểm tra hợp đồng có tồn tại không ---
  const hopDong = await HopDong.findByPk(id_hd);
  if (!hopDong) throw new Error('Hợp đồng không tồn tại');

  // --- Tạo lô hàng ---
  const loHang = await LoHang.create({
    id_hd,
    ngay_dong_goi,
    ngay_xuat_cang,
    cang_xuat,
    cang_nhap,
    file_chung_tu
  });

  return loHang;
};

// ====================
// Lấy toàn bộ lô hàng
// ====================
const getAllLH = async () => {
  return await LoHang.findAll({
    include: [
      { model: HopDong, as: 'hopDong' }
    ],
    order: [['id_lh', 'DESC']]
  });
};

// ======================
// Lấy lô hàng theo ID
// ======================
const getLHById = async (id_lh) => {
  const loHang = await LoHang.findByPk(id_lh, {
    include: [
      { model: HopDong, as: 'hopDong' }
    ]
  });

  if (!loHang) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);
  return loHang;
};

// ====================================
// Lấy danh sách lô hàng theo hợp đồng
// ====================================
const getLHByHopDong = async (id_hd) => {
  const hopDong = await HopDong.findByPk(id_hd, {
    include: [{ model: LoHang, as: 'loHangs' }]
  });

  if (!hopDong) throw new Error(`Không tìm thấy hợp đồng ID=${id_hd}`);
  return hopDong.loHangs;
};

// ==========================
// Cập nhật thông tin lô hàng
// ==========================
const updateLH = async (id_lh, data) => {
  const loHang = await LoHang.findByPk(id_lh);
  if (!loHang) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);

  await loHang.update(data);
  return loHang;
};

// ==================
// Xóa lô hàng
// ==================
const deleteLH = async (id_lh) => {
  const loHang = await LoHang.findByPk(id_lh);
  if (!loHang) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);

  await loHang.destroy();
};

module.exports = { createLH, getAllLH, getLHById, getLHByHopDong, updateLH, deleteLH };
