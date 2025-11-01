const hoaDonXuatChiTietService = require('../services/hoaDonXuatChiTiet.service');

const hoaDonXuatChiTietController = {
  async getByHoaDon(req, res) {
    try {
      const data = await hoaDonXuatChiTietService.getByHoaDon(req.params.id_hd_xuat);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const newCt = await hoaDonXuatChiTietService.create(req.body);
      res.json(newCt);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const result = await hoaDonXuatChiTietService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = hoaDonXuatChiTietController;
