'use strict';

const dvtService = require('../services/dvtinh.service');

const create = async (req, res) => {
  try {
    const { ma_dvt, ten_dvt, mo_ta } = req.body;
    const result = await dvtService.createDVT({ ma_dvt, ten_dvt, mo_ta });

    res.status(201).json({ success: true, message: "Tạo đơn vị tính thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await dvtService.getAllDVT();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getById = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    const result = await dvtService.getDVTById(id_dvt_hq);
    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy" });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const update = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    const { ma_dvt, ten_dvt, mo_ta } = req.body;
    const result = await dvtService.updateDVT(id_dvt_hq, { ma_dvt, ten_dvt, mo_ta });

    res.status(200).json({ success: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) return res.status(404).json({ success: false, message: error.message });
    if (error.message.includes("đã tồn tại")) return res.status(409).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const remove = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    await dvtService.deleteDVT(id_dvt_hq);
    res.status(200).json({ success: true, message: "Xóa đơn vị tính thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
