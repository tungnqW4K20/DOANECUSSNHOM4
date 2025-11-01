'use strict';
const nglService = require('../services/nguyenlieu.service');

const create = async (req, res) => {
  try {
    const { ten_npl, mo_ta, id_dvt_hq } = req.body;
    const result = await nglService.createNguyenLieu({ ten_npl, mo_ta, id_dvt_hq });
    res.status(201).json({ success: true, message: "Tạo nguyên liệu thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await nglService.getAllNguyenLieu();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const data = await nglService.getNguyenLieuById(req.params.id_nguyenlieu);
    if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy" });
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const data = await nglService.updateNguyenLieu(req.params.id_nguyenlieu, req.body);
    res.status(200).json({ success: true, message: "Cập nhật thành công", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await nglService.deleteNguyenLieu(req.params.id_nguyenlieu);
    res.status(200).json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
