'use strict';

const nglService = require('../services/nguyenlieu.service');

const create = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const { ten_npl, mo_ta, id_dvt_hq } = req.body;
    const result = await nglService.createNguyenLieu({ ten_npl, mo_ta, id_dvt_hq, id_dn });

    res.status(201).json({ success: true, message: "Tạo nguyên liệu thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const data = await nglService.getAllNguyenLieu(id_dn, role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const data = await nglService.getNguyenLieuById(req.params.id_nguyenlieu, id_dn, role);
    if (!data) return res.status(404).json({ success: false, message: "Không tìm thấy nguyên liệu hoặc bạn không có quyền truy cập" });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const data = await nglService.updateNguyenLieu(req.params.id_nguyenlieu, req.body, id_dn, role);
    res.status(200).json({ success: true, message: "Cập nhật nguyên liệu thành công", data });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const role = req.user?.role;

    if (!id_dn && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    await nglService.deleteNguyenLieu(req.params.id_nguyenlieu, id_dn, role);
    res.status(200).json({ success: true, message: "Xóa nguyên liệu thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
