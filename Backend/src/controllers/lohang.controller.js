'use strict';

const loHangService = require('../services/lohang.service');

// =============================
// 📦 TẠO LÔ HÀNG MỚI
// =============================
const create = async (req, res) => {
  try {
    const { id_hd, ngay_dong_goi, ngay_xuat_cang, cang_xuat, cang_nhap, file_chung_tu } = req.body;

    const result = await loHangService.createLH({
      id_hd,
      ngay_dong_goi,
      ngay_xuat_cang,
      cang_xuat,
      cang_nhap,
      file_chung_tu
    });

    res.status(201).json({
      success: true,
      message: 'Tạo lô hàng thành công',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// =============================
// 📋 LẤY TOÀN BỘ LÔ HÀNG
// =============================
const getAll = async (req, res) => {
  try {
    const result = await loHangService.getAllLH();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// 🔍 LẤY LÔ HÀNG THEO ID
// =============================
const getById = async (req, res) => {
  try {
    const { id_lh } = req.params;
    const result = await loHangService.getLHById(id_lh);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// =============================
// 🔍 LẤY LÔ HÀNG THEO HỢP ĐỒNG
// =============================
const getByHopDong = async (req, res) => {
  try {
    const { id_hd } = req.params;
    const result = await loHangService.getLHByHopDong(id_hd);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// =============================
// ✏️ CẬP NHẬT LÔ HÀNG
// =============================
const update = async (req, res) => {
  try {
    const { id_lh } = req.params;
    const result = await loHangService.updateLH(id_lh, req.body);
    res.status(200).json({
      success: true,
      message: 'Cập nhật lô hàng thành công',
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// =============================
// ❌ XÓA LÔ HÀNG
// =============================
const remove = async (req, res) => {
  try {
    const { id_lh } = req.params;
    await loHangService.deleteLH(id_lh);
    res.status(200).json({
      success: true,
      message: 'Xóa lô hàng thành công'
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, getByHopDong, update, remove };