'use strict';
const db = require('../models');

const BaoCaoThanhKhoanService = {
  async create(data) {
    return await db.BaoCaoThanhKhoan.create(data);
  },

  async getAll() {
    return await db.BaoCaoThanhKhoan.findAll({
      include: [{ model: db.HopDong, as: 'hopdong' }]
    });
  },

  async getById(id_bc) {
    return await db.BaoCaoThanhKhoan.findByPk(id_bc, {
      include: [{ model: db.HopDong, as: 'hopdong' }]
    });
  },

  async getByHopDong(id_hd) {
    return await db.BaoCaoThanhKhoan.findAll({
      where: { id_hd },
      include: [{ model: db.HopDong, as: 'hopdong' }]
    });
  },

  async update(id_bc, data) {
    const bc = await db.BaoCaoThanhKhoan.findByPk(id_bc);
    if (!bc) throw new Error('Không tìm thấy báo cáo thanh khoản');
    return await bc.update(data);
  },

  async remove(id_bc) {
    const bc = await db.BaoCaoThanhKhoan.findByPk(id_bc);
    if (!bc) throw new Error('Không tìm thấy báo cáo thanh khoản');
    return await bc.destroy();
  }
};

module.exports = BaoCaoThanhKhoanService;
