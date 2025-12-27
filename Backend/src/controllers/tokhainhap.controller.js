'use strict';
const tknService = require('../services/tokhainhap.service');

const create = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await tknService.createTKN(req.body, id_dn, role);
    res.status(201).json({ success: true, message: 'Tạo tờ khai nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const list = await tknService.getAllTKN(id_dn, role);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const data = await tknService.getTKNById(req.params.id_tkn, id_dn, role);
    if (!data) return res.status(404).json({ success: false, error: 'Không tìm thấy tờ khai nhập hoặc bạn không có quyền truy cập' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await tknService.updateTKN(req.params.id_tkn, req.body, id_dn, role);
    res.json({ success: true, message: 'Cập nhật tờ khai nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    await tknService.deleteTKN(req.params.id_tkn, id_dn, role);
    res.json({ success: true, message: 'Xóa tờ khai nhập thành công' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
