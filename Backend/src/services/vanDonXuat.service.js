const { VanDonXuat, LoHang } = require('../models');

const vanDonXuatService = {
  async getAll() {
    return await VanDonXuat.findAll({ include: [{ model: LoHang, as: 'loHang' }] });
  },
  async create(data) {
    return await VanDonXuat.create(data);
  },
  async update(id, data) {
    const vd = await VanDonXuat.findByPk(id);
    if (!vd) throw new Error('Không tìm thấy vận đơn');
    return await vd.update(data);
  },
  async delete(id) {
    const vd = await VanDonXuat.findByPk(id);
    if (!vd) throw new Error('Không tìm thấy vận đơn');
    await vd.destroy();
    return { message: 'Đã xóa vận đơn' };
  }
};

module.exports = vanDonXuatService;
