'use strict';

const dvtHQService = require('../services/donvitinhHaiQuan.service');

// Create
const create = async (req, res) => {
  try {
    const { ten_dvt, mo_ta } = req.body;
    const result = await dvtHQService.createDVT_HQ({ ten_dvt, mo_ta });

    res.status(201).json({ success: true, message: "Tạo đơn vị tính HQ thành công", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all
const getAll = async (req, res) => {
  try {
    const result = await dvtHQService.getAllDVT_HQ();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // In lỗi ra terminal (màn hình đen lúc chạy node)
    console.error("DEBUG LOG:", error); 

    // Trả chi tiết lỗi về Postman để bạn đọc được
    res.status(500).json({ 
      success: false, 
      message: error.message, // Lỗi gì nó sẽ hiện ở đây
      detail: "Kiểm tra Terminal để xem chi tiết hơn" 
    });
  }
};

// Get by ID
const getById = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    const result = await dvtHQService.getDVT_HQById(id_dvt_hq);
    if (!result) return res.status(404).json({ success: false, message: "Không tìm thấy" });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Update
const update = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    const { ten_dvt, mo_ta } = req.body;
    const result = await dvtHQService.updateDVT_HQ(id_dvt_hq, { ten_dvt, mo_ta });

    res.status(200).json({ success: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Delete
const remove = async (req, res) => {
  try {
    const { id_dvt_hq } = req.params;
    await dvtHQService.deleteDVT_HQ(id_dvt_hq);
    res.status(200).json({ success: true, message: "Xóa đơn vị tính HQ thành công" });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) return res.status(404).json({ success: false, message: error.message });
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

module.exports = { create, getAll, getById, update, remove };
