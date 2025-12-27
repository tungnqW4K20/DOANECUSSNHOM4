'use strict';

const loHangService = require('../services/lohang.service');

// =============================
// 📦 TẠO LÔ HÀNG MỚI
// =============================
const create = async (req, res) => {
  try {
    const { id_hd, ngay_dong_goi, ngay_xuat_cang, cang_xuat, cang_nhap, file_chung_tu } = req.body;
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await loHangService.createLH({
      id_hd,
      ngay_dong_goi,
      ngay_xuat_cang,
      cang_xuat,
      cang_nhap,
      file_chung_tu
    }, id_dn, role);

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
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await loHangService.getAllLH(id_dn, role);
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
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await loHangService.getLHById(id_lh, id_dn, role);
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
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await loHangService.getLHByHopDong(id_hd, id_dn, role);
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
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await loHangService.updateLH(id_lh, req.body, id_dn, role);
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
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    await loHangService.deleteLH(id_lh, id_dn, role);
    res.status(200).json({
      success: true,
      message: 'Xóa lô hàng thành công'
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, getByHopDong, update, remove };