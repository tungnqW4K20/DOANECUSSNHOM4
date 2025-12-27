'use strict';
const khoService = require('../services/kho.service');

exports.create = async (req, res) => {
  try {
    const data = await khoService.createKho(req.body);
    res.status(201).json({ message: 'Tạo kho thành công', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const id_dn = req.user?.id;   
 if (!id_dn) {
      return res.status(400).json({
        success: false,
        message: "Thiếu id_dn trong token!"
      });
    }
    const data = await khoService.getAllKho(id_dn);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await khoService.getKhoById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Không tìm thấy kho' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await khoService.updateKho(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await khoService.deleteKho(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tồn kho NPL theo kho
exports.getTonKhoNPLByKho = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin xác thực" });
    }

    const { id_kho } = req.params;
    const data = await khoService.getTonKhoNPLByKho(id_kho, id_dn);
    
    // Format response cho frontend
    const result = data.map(item => ({
      id_npl: item.id_npl,
      ten_npl: item.nguyenPhuLieu?.ten_npl || 'N/A',
      so_luong_ton: parseFloat(item.so_luong_ton) || 0,
      don_vi: item.nguyenPhuLieu?.donViTinhHQ?.ten_dvt || ''
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Lấy tồn kho SP theo kho
exports.getTonKhoSPByKho = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const { id_kho } = req.params;
    
    console.log('getTonKhoSPByKho - id_kho:', id_kho, 'id_dn:', id_dn);
    
    if (!id_dn) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin xác thực" });
    }

    const data = await khoService.getTonKhoSPByKho(id_kho, id_dn);
    console.log('Raw data from service:', JSON.stringify(data, null, 2));
    
    // Format response cho frontend
    const result = data.map(item => ({
      id_sp: item.id_sp,
      ten_sp: item.sanPham?.ten_sp || 'N/A',
      so_luong_ton: parseFloat(item.so_luong_ton) || 0,
      don_vi: item.sanPham?.donViTinhHQ?.ten_dvt || ''
    }));

    console.log('Formatted result:', result);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error getTonKhoSPByKho:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};
