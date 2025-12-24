'use strict';
const service = require('../services/hoadonnhap.service');

const create = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const result = await service.createHDN(req.body, id_dn, role);
    res.status(201).json({ success: true, message: 'Tạo hóa đơn nhập thành công', data: result });
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

    const list = await service.getAllHDN(id_dn, role);
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

    const data = await service.getHDNById(req.params.id_hd_nhap, id_dn, role);
    if (!data) return res.status(404).json({ success: false, error: 'Không tìm thấy hóa đơn nhập hoặc bạn không có quyền truy cập' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    await service.deleteHDN(req.params.id_hd_nhap, id_dn, role);
    res.json({ success: true, message: 'Xóa hóa đơn nhập thành công' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { create, getAll, getById, remove };
