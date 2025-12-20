'use strict';

const hopDongService = require('../services/hopdong.service');

const create = async (req, res) => {
  try {
    const { id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong } = req.body;
    const result = await hopDongService.createHD({
      id_dn, so_hd, ngay_ky, ngay_hieu_luc, ngay_het_han, gia_tri, id_tt, file_hop_dong
    });
    res.status(201).json({ success: true, message: 'Tạo hợp đồng thành công', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await hopDongService.getAllHD();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getById = async (req, res) => {
  try {
    const { id_hd } = req.params;
    const result = await hopDongService.getHDById(id_hd);
    if (!result) return res.status(404).json({ success: false, message: 'Không tìm thấy hợp đồng' });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [PUT] /api/hopdong/:id_hd
// Mô tả: Cập nhật thông tin hợp đồng theo ID
// Body (JSON):
/*
{
  "so_hd": "HD0023",                 // (string) Số hiệu hợp đồng
  "ngay_ky": "2025-01-15",          // (date) Ngày ký hợp đồng
  "ngay_hieu_luc": "2025-01-20",    // (date) Ngày bắt đầu có hiệu lực
  "ngay_het_han": "2025-12-31",     // (date) Ngày hết hạn hợp đồng
  "gia_tri": 1200000,                // (number) Tổng giá trị hợp đồng
  "id_tt": 1,                        // (int) Mã trạng thái hợp đồng (VD: 1 = Đang hiệu lực, 2 = Hết hạn)
  "file_hop_dong": "uploads/hopdong/HD001.pdf" // (string) Đường dẫn file hợp đồng (upload)
}
*/

const update = async (req, res) => {
  try {
    const { id_hd } = req.params;
    const data = req.body;
    const result = await hopDongService.updateHD(id_hd, data);
    res.status(200).json({ success: true, message: 'Cập nhật hợp đồng thành công', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id_hd } = req.params;
    await hopDongService.deleteHD(id_hd);
    res.status(200).json({ success: true, message: 'Xóa hợp đồng thành công' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
