'use strict';
const thanhKhoanService = require('../services/baocaothanhkhoan.service');

const getHopDong = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ error: 'Thiếu id_dn trong token' });
    }

    const data = await thanhKhoanService.getHopDongByDN(id_dn);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const calculate = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    if (!id_dn) {
      return res.status(400).json({ error: 'Thiếu id_dn trong token' });
    }

    const data = await thanhKhoanService.calculateBaoCao(req.body, id_dn);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const saveBaoCao = async (req, res) => {
  try {
    const data = await thanhKhoanService.saveBaoCao(req.body);
    res.status(201).json({
      message: 'Lưu báo cáo thành công!',
      id_bc: data.id_bc
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id_bc } = req.params;
    const { trang_thai } = req.body;

    await thanhKhoanService.updateTrangThaiBaoCao(id_bc, trang_thai);

    res.json({
      message: 'Cập nhật trạng thái báo cáo thành công!'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getThanhKhoanReports = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const q = req.query.q || '';
    const ket_luan = req.query.ket_luan;
    const trang_thai = req.query.trang_thai;

    const data = await thanhKhoanService.getThanhKhoanReports({
      page,
      limit,
      q,
      ket_luan,
      trang_thai
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getHopDong, calculate, saveBaoCao, updateStatus, getThanhKhoanReports };
