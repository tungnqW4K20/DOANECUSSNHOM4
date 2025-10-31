const hoaDonXuatService = require('../services/hoaDonXuat.service');

const hoaDonXuatController = {
  async getAll(req, res) {
    try {
      const data = await hoaDonXuatService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await hoaDonXuatService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newHd = await hoaDonXuatService.create(req.body);
      res.json(newHd);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await hoaDonXuatService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await hoaDonXuatService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = hoaDonXuatController;
