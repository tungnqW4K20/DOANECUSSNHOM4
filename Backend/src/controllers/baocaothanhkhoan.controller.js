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




module.exports = { getHopDong, calculate, saveBaoCao };
