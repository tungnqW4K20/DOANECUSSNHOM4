'use strict';
const dmService = require('../services/dinhmuc.service');

const create = async (req, res) => {
  try {
    const { id_sp, dinh_muc_chi_tiet } = req.body;
    const result = await dmService.createDinhMucSanPham({ id_sp, dinh_muc_chi_tiet });
    res.status(201).json({ success: true, message: "Tạo định mức sản phẩm thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await dmService.getAllDinhMuc();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getByProduct = async (req, res) => {
  try {
    const data = await dmService.getDinhMucByProduct(req.params.id_sp);
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const remove = async (req, res) => {
  try {
    await dmService.deleteDinhMuc(req.params.id_dinhmuc);
    res.status(200).json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getByProduct, remove };
