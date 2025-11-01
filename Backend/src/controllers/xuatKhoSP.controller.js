'use strict';
const service = require('../services/xuatKhoSP.service');

exports.create = async (req, res) => {
  try {
    const result = await service.createXuatSP(req.body);
    res.status(201).json({ success: true, message: 'Tạo phiếu xuất SP thành công', data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await service.getAllXuatSP();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const rec = await service.getXuatSPById(req.params.id);
    res.json({ success: true, data: rec });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await service.updateXuatSP(req.params.id, req.body);
    res.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await service.deleteXuatSP(req.params.id);
    res.json({ success: true, message: 'Xóa phiếu xuất SP thành công' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// chi tiết
exports.addChiTiet = async (req, res) => {
  try {
    const ct = await service.addChiTiet(req.body);
    res.status(201).json({ success: true, data: ct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getChiTiet = async (req, res) => {
  try {
    const list = await service.getChiTietByPhieu(req.params.id);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteChiTiet = async (req, res) => {
  try {
    await service.deleteChiTiet(req.params.id);
    res.json({ success: true, message: 'Xóa chi tiết thành công' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
