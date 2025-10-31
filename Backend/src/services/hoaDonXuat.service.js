const { HoaDonXuat, HoaDonXuatChiTiet, LoHang, TienTe } = require('../models');

const hoaDonXuatService = {
  async getAll() {
    return await HoaDonXuat.findAll({
      include: [
        { model: LoHang, as: 'loHang' },
        { model: TienTe, as: 'tienTe' },
        { model: HoaDonXuatChiTiet, as: 'chiTiets' }
      ]
    });
  },

  async getById(id) {
    return await HoaDonXuat.findByPk(id, {
      include: [{ model: HoaDonXuatChiTiet, as: 'chiTiets' }]
    });
  },

  async create(data) {
    return await HoaDonXuat.create(data);
  },

  async update(id, data) {
    const hd = await HoaDonXuat.findByPk(id);
    if (!hd) throw new Error('Không tìm thấy hóa đơn xuất');
    return await hd.update(data);
  },

  async delete(id) {
    const hd = await HoaDonXuat.findByPk(id);
    if (!hd) throw new Error('Không tìm thấy hóa đơn xuất');
    await hd.destroy();
    return { message: 'Đã xóa hóa đơn xuất khẩu' };
  }
};

module.exports = hoaDonXuatService;
