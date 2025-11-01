'use strict';

const spService = require('../services/sanpham.service');

const create = async (req, res) => {
  try {
    const { ten_sp, mo_ta, id_dvt_hq } = req.body;
    const result = await spService.createSanPham({ ten_sp, mo_ta, id_dvt_hq });

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await spService.getAllSanPham();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const { id_sp } = req.params;
    const result = await spService.getSanPhamById(id_sp);

    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const { id_sp } = req.params;
    const { ten_sp, mo_ta, id_dvt_hq } = req.body;

    const result = await spService.updateSanPham(id_sp, { ten_sp, mo_ta, id_dvt_hq });

    res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công", data: result });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id_sp } = req.params;
    await spService.deleteSanPham(id_sp);

    res.status(200).json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
