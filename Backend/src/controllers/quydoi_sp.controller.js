'use strict';

const quyDoiSPService = require('../services/quydoi_sp.service');

const create = async (req, res) => {
  try {
    const { id_sp, ten_dvt_sp, id_dvt_hq, he_so } = req.body;
    
    // Lấy id_dn từ user đang đăng nhập (có thể là id_dn hoặc id)
    const id_dn = req.user?.id_dn || req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ success: false, message: "Không xác định được doanh nghiệp" });
    }
    
    const result = await quyDoiSPService.createQD({ id_sp, ten_dvt_sp, id_dvt_hq, he_so, id_dn });
    res.status(201).json({ success: true, message: "Tạo quy đổi sản phẩm thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id_dn || req.user?.id;
    const role = req.user?.role;
    const result = await quyDoiSPService.getAllQD(id_dn, role);
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const result = await quyDoiSPService.getQDById(id_qd);
    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy" });
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const { id_sp, ten_dvt_sp, id_dvt_hq, he_so } = req.body;
    const id_dn = req.user?.id_dn || req.user?.id;
    const role = req.user?.role;
    const result = await quyDoiSPService.updateQD(id_qd, { id_sp, ten_dvt_sp, id_dvt_hq, he_so }, id_dn, role);
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
    await quyDoiSPService.deleteQD(id_qd, id_dn, role);
    res.status(200).json({ success: true, message: "Xóa quy đổi thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy") || error.message.includes("không có quyền")) 
      return res.status(error.message.includes("không có quyền") ? 403 : 404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
