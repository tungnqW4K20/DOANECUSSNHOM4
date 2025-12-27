'use strict';
const thanhKhoanService = require('../services/baocaothanhkhoan.service');

// API 1: Lấy danh sách Hợp đồng của Doanh nghiệp
const getHopDong = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(401).json({ error: 'Không xác định được doanh nghiệp từ token' });
    }

    const data = await thanhKhoanService.getHopDongByDN(id_dn);
    res.json(data);
  } catch (err) {
    console.error('Error in getHopDong:', err);
    res.status(500).json({ error: err.message });
  }
};

// API 2: Tính toán và tạo dữ liệu Báo cáo Thanh khoản
const calculate = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(401).json({ error: 'Không xác định được doanh nghiệp từ token' });
    }

    const { id_hd, tu_ngay, den_ngay } = req.body;
    
    if (!id_hd || !tu_ngay || !den_ngay) {
      return res.status(400).json({ 
        error: 'Thiếu dữ liệu: id_hd, tu_ngay, den_ngay là bắt buộc' 
      });
    }

    const data = await thanhKhoanService.calculateBaoCao(req.body, id_dn);
    res.json(data);
  } catch (err) {
    console.error('Error in calculate:', err);
    res.status(400).json({ error: err.message });
  }
};

// API 3: Lưu Báo cáo Thanh khoản
const saveBaoCao = async (req, res) => {
  try {
    const { id_hd, tu_ngay, den_ngay, ket_luan_tong_the, data_snapshot } = req.body;

    if (!id_hd || !tu_ngay || !den_ngay) {
      return res.status(400).json({ 
        error: 'Thiếu dữ liệu: id_hd, tu_ngay, den_ngay là bắt buộc' 
      });
    }

    const data = await thanhKhoanService.saveBaoCao(req.body);
    res.status(201).json({
      message: 'Lưu báo cáo thành công!',
      id_bc: data.id_bc
    });
  } catch (err) {
    console.error('Error in saveBaoCao:', err);
    res.status(400).json({ error: err.message });
  }
};

// API bổ sung: Cập nhật trạng thái báo cáo
const updateStatus = async (req, res) => {
  try {
    const { id_bc } = req.params;
    const { trang_thai } = req.body;

    if (!trang_thai) {
      return res.status(400).json({ error: 'Thiếu trạng thái mới' });
    }

    const data = await thanhKhoanService.updateTrangThaiBaoCao(id_bc, trang_thai);
    res.json({
      message: 'Cập nhật trạng thái thành công',
      data
    });
  } catch (err) {
    console.error('Error in updateStatus:', err);
    res.status(400).json({ error: err.message });
  }
};

// API bổ sung: Lấy danh sách báo cáo thanh khoản
const getThanhKhoanReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, q, ket_luan_tong_the, trang_thai, id_hd } = req.query;
    
    const data = await thanhKhoanService.getThanhKhoanReports({
      page: Number(page),
      limit: Number(limit),
      q,
      ket_luan_tong_the,
      trang_thai,
      id_hd: id_hd ? Number(id_hd) : undefined
    });
    
    res.json(data);
  } catch (err) {
    console.error('Error in getThanhKhoanReports:', err);
    res.status(500).json({ error: err.message });
  }
};

// API bổ sung: Lấy chi tiết báo cáo theo ID
const getBaoCaoById = async (req, res) => {
  try {
    const { id_bc } = req.params;
    
    if (!id_bc) {
      return res.status(400).json({ error: 'Thiếu id_bc' });
    }

    const data = await thanhKhoanService.getBaoCaoById(id_bc);
    res.json(data);
  } catch (err) {
    console.error('Error in getBaoCaoById:', err);
    res.status(404).json({ error: err.message });
  }
};

// API bổ sung: Cập nhật báo cáo
const updateBaoCao = async (req, res) => {
  try {
    const { id_bc } = req.params;
    const { ket_luan_tong_the, data_snapshot } = req.body;

    if (!id_bc) {
      return res.status(400).json({ error: 'Thiếu id_bc' });
    }

    const data = await thanhKhoanService.updateBaoCao(id_bc, { ket_luan_tong_the, data_snapshot });
    res.json({
      message: 'Cập nhật báo cáo thành công!',
      data
    });
  } catch (err) {
    console.error('Error in updateBaoCao:', err);
    res.status(400).json({ error: err.message });
  }
};

// API bổ sung: Xóa báo cáo thanh khoản
const deleteBaoCao = async (req, res) => {
  try {
    const { id_bc } = req.params;

    if (!id_bc) {
      return res.status(400).json({ error: 'Thiếu id_bc' });
    }

    await thanhKhoanService.deleteBaoCao(id_bc);
    res.json({
      message: 'Xóa báo cáo thành công!'
    });
  } catch (err) {
    console.error('Error in deleteBaoCao:', err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { 
  getHopDong, 
  calculate, 
  saveBaoCao, 
  updateStatus, 
  getThanhKhoanReports,
  getBaoCaoById,
  updateBaoCao,
  deleteBaoCao
};
