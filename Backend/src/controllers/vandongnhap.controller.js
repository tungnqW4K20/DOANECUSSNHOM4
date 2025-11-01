'use strict';
const service = require('../services/vandongnhap.service');

const create = async (req, res) => {
  try {
    const result = await service.createVDN(req.body);
    res.status(201).json({ message: 'Tạo vận đơn nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const list = await service.getAllVDN();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await service.getVDNById(req.params.id_vd);
    if (!data) return res.status(404).json({ error: 'Không tìm thấy vận đơn nhập' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await service.updateVDN(req.params.id_vd, req.body);
    res.json({ message: 'Cập nhật vận đơn nhập thành công', data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.deleteVDN(req.params.id_vd);
    res.json({ message: 'Xóa vận đơn nhập thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
