'use strict';
const tknService = require('../services/tokhainhap.service');

const create = async (req, res) => {
  try {
    const result = await tknService.createTKN(req.body);
    res.status(201).json({ message: 'Tạo tờ khai nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const list = await tknService.getAllTKN();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await tknService.getTKNById(req.params.id_tkn);
    if (!data) return res.status(404).json({ error: 'Không tìm thấy tờ khai nhập' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await tknService.updateTKN(req.params.id_tkn, req.body);
    res.json({ message: 'Cập nhật tờ khai nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await tknService.deleteTKN(req.params.id_tkn);
    res.json({ message: 'Xóa tờ khai nhập thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
