'use strict';

const quyDoiNPLService = require('../services/quydoi_npl.service');

const create = async (req, res) => {
  try {
    const { id_npl, ten_dvt_dn, id_dvt_hq, he_so } = req.body;
    
    // Lấy id_dn từ user đang đăng nhập (có thể là id_dn hoặc id)
    const id_dn = req.user?.id_dn || req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ success: false, message: "Không xác định được doanh nghiệp" });
    }

    const result = await quyDoiNPLService.create({
      id_dn,
      id_npl,
      ten_dvt_dn,
      id_dvt_hq,
      he_so
    });

    res.status(201).json({
      success: true,
      message: "Tạo quy đổi NPL thành công",
      data: result
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await quyDoiNPLService.getAll();
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const result = await quyDoiNPLService.getById(id_qd);
    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy" });
    res.status(200).json({ success: true, data: result });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const { id_qd } = req.params;
    const { id_npl, ten_dvt_dn, id_dvt_hq, he_so } = req.body;
    
    // Lấy id_dn từ user đang đăng nhập (có thể là id_dn hoặc id)
    const id_dn = req.user?.id_dn || req.user?.id;
    
    const result = await quyDoiNPLService.update(id_qd, { id_dn, id_npl, ten_dvt_dn, id_dvt_hq, he_so });
    res.status(200).json({ success: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message || "Lỗi server" });
  }
};

const remove = async (req, res) => {
  try {
    const { id_qd } = req.params;
    await quyDoiNPLService.deleteOne(id_qd);
    res.status(200).json({ success: true, message: "Xóa quy đổi thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy"))
      return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
