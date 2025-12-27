const vanDonXuatService = require('../services/vanDonXuat.service');

const vanDonXuatController = {
  async getAll(req, res) {
    try {
      const id_dn = req.user?.id;
      const role = req.user?.role;
      if (!id_dn && role !== 'Admin') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
      }
      const data = await vanDonXuatService.getAll(id_dn, role);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id_dn = req.user?.id;
      const role = req.user?.role;
      if (!id_dn && role !== 'Admin') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
      }
      const data = await vanDonXuatService.getById(req.params.id, id_dn, role);
      if (!data) return res.status(404).json({ success: false, error: 'Không tìm thấy' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const id_dn = req.user?.id;
      const role = req.user?.role;
      if (!id_dn && role !== 'Admin') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
      }
      const vd = await vanDonXuatService.create(req.body, id_dn, role);
      res.json({ success: true, data: vd });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id_dn = req.user?.id;
      const role = req.user?.role;
      if (!id_dn && role !== 'Admin') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
      }
      const vd = await vanDonXuatService.update(req.params.id, req.body, id_dn, role);
      res.json({ success: true, data: vd });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id_dn = req.user?.id;
      const role = req.user?.role;
      if (!id_dn && role !== 'Admin') {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
      }
      const result = await vanDonXuatService.delete(req.params.id, id_dn, role);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};

module.exports = vanDonXuatController;
