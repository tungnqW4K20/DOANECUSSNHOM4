'use strict';
const service = require('../services/nhapKhoNPL.service');

exports.create = async (req, res) => {
  try {
    const result = await service.createNhapNPL(req.body);
    res.status(201).json({ success: true, message: 'Tạo phiếu nhập NPL thành công', data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin xác thực" });
    }
    const list = await service.getAllNhapNPL(id_dn);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const rec = await service.getNhapNPLById(req.params.id);
    res.json({ success: true, data: rec });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await service.updateNhapNPL(req.params.id, req.body);
    res.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await service.deleteNhapNPL(req.params.id);
    res.json({ success: true, message: 'Xóa phiếu nhập thành công' });
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

// Lấy số lượng NPL có thể nhập theo hóa đơn nhập
exports.getSoLuongCoTheNhap = async (req, res) => {
  try {
    const { id_hd_nhap } = req.params;
    const result = await service.getSoLuongCoTheNhap(id_hd_nhap);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
