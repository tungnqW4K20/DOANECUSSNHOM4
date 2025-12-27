'use strict';

const quyDoiDNService = require('../services/quydoi_dn.service');

const create = async (req, res) => {
  try {
    const { id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so } = req.body;
    const result = await quyDoiDNService.createQD({ id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so });
    res.status(201).json({ success: true, message: "Tạo quy đổi DN thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id_dn || req.user?.id;
    const role = req.user?.role;
    const result = await quyDoiDNService.getAllQD(id_dn, role);
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const result = await quyDoiDNService.getQDById(id_qd);
    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy" });
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const { id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so } = req.body;
    const userId = req.user?.id_dn || req.user?.id;
    const role = req.user?.role;
    const result = await quyDoiDNService.updateQD(id_qd, { id_dn, id_mat_hang, ten_dvt_dn, id_dvt_hq, he_so }, userId, role);
    res.status(200).json({ success: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) 
      return res.status(error.message.includes("không có quyền") ? 403 : 404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const remove = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const id_dn = req.user?.id_dn || req.user?.id;
    const role = req.user?.role;
    await quyDoiDNService.deleteQD(id_qd, id_dn, role);
    res.status(200).json({ success: true, message: "Xóa quy đổi thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) 
      return res.status(error.message.includes("không có quyền") ? 403 : 404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
