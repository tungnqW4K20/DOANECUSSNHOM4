const { HoaDonXuatChiTiet, SanPham } = require('../models');

const hoaDonXuatChiTietService = {
  async getByHoaDon(id_hd_xuat) {
    return await HoaDonXuatChiTiet.findAll({
      where: { id_hd_xuat },
      include: [{ model: SanPham, as: 'sanPham' }]
    });
  },
  async create(data) {
    return await HoaDonXuatChiTiet.create(data);
  },
  async delete(id) {
    const ct = await HoaDonXuatChiTiet.findByPk(id);
    if (!ct) throw new Error('Không tìm thấy chi tiết hóa đơn');
    await ct.destroy();
    return { message: 'Đã xóa chi tiết' };
  }
};

module.exports = hoaDonXuatChiTietService;
