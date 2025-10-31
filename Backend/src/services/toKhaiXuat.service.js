const { ToKhaiXuat, LoHang, TienTe } = require('../models');

const toKhaiXuatService = {
  async getAll() {
    return await ToKhaiXuat.findAll({
      include: [
        { model: LoHang, as: 'loHang' },
        { model: TienTe, as: 'tienTe' }
      ]
    });
  },
  async create(data) {
    return await ToKhaiXuat.create(data);
  },
  async update(id, data) {
    const tk = await ToKhaiXuat.findByPk(id);
    if (!tk) throw new Error('Không tìm thấy tờ khai xuất');
    return await tk.update(data);
  },
  async delete(id) {
    const tk = await ToKhaiXuat.findByPk(id);
    if (!tk) throw new Error('Không tìm thấy tờ khai xuất');
    await tk.destroy();
    return { message: 'Đã xóa tờ khai xuất' };
  }
};

module.exports = toKhaiXuatService;
