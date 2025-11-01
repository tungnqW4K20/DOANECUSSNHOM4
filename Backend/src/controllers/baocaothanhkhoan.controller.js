'use strict';
const BaoCaoThanhKhoanService = require('../services/baocaothanhkhoan.service');

const BaoCaoThanhKhoanController = {
  async create(req, res) {
    try {
      const data = await BaoCaoThanhKhoanService.create(req.body);
      res.status(201).json({ message: 'Tạo báo cáo thanh khoản thành công', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const data = await BaoCaoThanhKhoanService.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await BaoCaoThanhKhoanService.getById(req.params.id_bc);
      if (!data) return res.status(404).json({ message: 'Không tìm thấy báo cáo thanh khoản' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getByHopDong(req, res) {
    try {
      const data = await BaoCaoThanhKhoanService.getByHopDong(req.params.id_hd);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await BaoCaoThanhKhoanService.update(req.params.id_bc, req.body);
      res.json({ message: 'Cập nhật thành công', data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async remove(req, res) {
    try {
      await BaoCaoThanhKhoanService.remove(req.params.id_bc);
      res.json({ message: 'Xóa báo cáo thanh khoản thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = BaoCaoThanhKhoanController;
