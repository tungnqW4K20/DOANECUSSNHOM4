const toKhaiXuatService = require('../services/toKhaiXuat.service');

const toKhaiXuatController = {
  async getAll(req, res) {
    try {
      const data = await toKhaiXuatService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const tk = await toKhaiXuatService.create(req.body);
      res.json(tk);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const tk = await toKhaiXuatService.update(req.params.id, req.body);
      res.json(tk);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const result = await toKhaiXuatService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = toKhaiXuatController;
