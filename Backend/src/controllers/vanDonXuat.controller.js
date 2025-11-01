const vanDonXuatService = require('../services/vanDonXuat.service');

const vanDonXuatController = {
  async getAll(req, res) {
    try {
      const data = await vanDonXuatService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const vd = await vanDonXuatService.create(req.body);
      res.json(vd);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const vd = await vanDonXuatService.update(req.params.id, req.body);
      res.json(vd);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const result = await vanDonXuatService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = vanDonXuatController;
