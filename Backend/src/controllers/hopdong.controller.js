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
