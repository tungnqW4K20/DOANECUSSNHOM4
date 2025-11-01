'use strict';
const khoService = require('../services/kho.service');

exports.create = async (req, res) => {
  try {
    const data = await khoService.createKho(req.body);
    res.status(201).json({ message: 'Tạo kho thành công', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await khoService.getAllKho();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await khoService.getKhoById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Không tìm thấy kho' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await khoService.updateKho(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await khoService.deleteKho(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
