'use strict';
const service = require('../services/hoadonnhap.service');

const create = async (req, res) => {
  try {
    const result = await service.createHDN(req.body);
    res.status(201).json({ message: 'Tạo hóa đơn nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const list = await service.getAllHDN();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await service.getHDNById(req.params.id_hd_nhap);
    if (!data) return res.status(404).json({ error: 'Không tìm thấy hóa đơn nhập' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await service.deleteHDN(req.params.id_hd_nhap);
    res.json({ message: 'Xóa hóa đơn nhập thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { create, getAll, getById, remove };
