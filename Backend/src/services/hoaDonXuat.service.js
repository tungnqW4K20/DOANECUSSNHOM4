const { HoaDonXuat, HoaDonXuatChiTiet, LoHang, TienTe, HopDong, SanPham, DonViTinhHQ } = require('../models');

const hoaDonXuatService = {
  async getAll(id_dn, role) {
    if (role === 'Admin') {
      return await HoaDonXuat.findAll({
        include: [
          { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
          { model: TienTe, as: 'tienTe' },
          { model: HoaDonXuatChiTiet, as: 'chiTiets', include: [{ 
            model: SanPham, 
            as: 'sanPham',
            include: [{ model: DonViTinhHQ, as: 'donViTinhHQ', attributes: ['ten_dvt'] }]
          }] }
        ],
        order: [['id_hd_xuat', 'DESC']]
      });
    }

    return await HoaDonXuat.findAll({
      include: [
        {
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{
            model: HopDong,
            as: 'hopDong',
            where: { id_dn },
            required: true
          }]
        },
        { model: TienTe, as: 'tienTe' },
        { model: HoaDonXuatChiTiet, as: 'chiTiets', include: [{ 
          model: SanPham, 
          as: 'sanPham',
          include: [{ model: DonViTinhHQ, as: 'donViTinhHQ', attributes: ['ten_dvt'] }]
        }] }
      ],
      order: [['id_hd_xuat', 'DESC']]
    });
  },

  async getById(id, id_dn, role) {
    if (role === 'Admin') {
      return await HoaDonXuat.findByPk(id, {
        include: [
          { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
          { model: TienTe, as: 'tienTe' },
          { model: HoaDonXuatChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
        ]
      });
    }

    return await HoaDonXuat.findOne({
      where: { id_hd_xuat: id },
      include: [
        {
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{
            model: HopDong,
            as: 'hopDong',
            where: { id_dn },
            required: true
          }]
        },
        { model: TienTe, as: 'tienTe' },
        { model: HoaDonXuatChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
      ]
    });
  },

  async create(data, id_dn, role) {
    const { id_lh, so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don, chi_tiets } = data;
    if (!id_lh || !so_hd || !ngay_hd) throw new Error('Thiếu dữ liệu bắt buộc');

    const includeHopDong = role === 'Admin' ? [] : [{
      model: HopDong,
      as: 'hopDong',
      where: { id_dn },
      required: true
    }];

    const lh = await LoHang.findOne({ where: { id_lh }, include: includeHopDong });
    if (!lh) throw new Error('Không tìm thấy lô hàng hoặc bạn không có quyền truy cập');

    const hoaDon = await HoaDonXuat.create({ id_lh, so_hd, ngay_hd, id_tt, tong_tien, file_hoa_don });

    if (Array.isArray(chi_tiets)) {
      for (const ct of chi_tiets) {
        await HoaDonXuatChiTiet.create({
          id_hd_xuat: hoaDon.id_hd_xuat,
          id_sp: ct.id_sp,
          so_luong: ct.so_luong,
          don_gia: ct.don_gia,
          tri_gia: ct.tri_gia
        });
      }
    }

    return await HoaDonXuat.findByPk(hoaDon.id_hd_xuat, {
      include: [{ model: HoaDonXuatChiTiet, as: 'chiTiets' }]
    });
  },

  async update(id, data, id_dn, role) {
    let hd;
    if (role === 'Admin') {
      hd = await HoaDonXuat.findByPk(id);
    } else {
      hd = await HoaDonXuat.findOne({
        where: { id_hd_xuat: id },
        include: [{
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{
            model: HopDong,
            as: 'hopDong',
            where: { id_dn },
            required: true
          }]
        }]
      });
    }

    if (!hd) throw new Error('Không tìm thấy hóa đơn xuất hoặc bạn không có quyền truy cập');
    delete data.id_lh;
    return await hd.update(data);
  },

  async delete(id, id_dn, role) {
    let hd;
    if (role === 'Admin') {
      hd = await HoaDonXuat.findByPk(id);
    } else {
      hd = await HoaDonXuat.findOne({
        where: { id_hd_xuat: id },
        include: [{
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{
            model: HopDong,
            as: 'hopDong',
            where: { id_dn },
            required: true
          }]
        }]
      });
    }

    if (!hd) throw new Error('Không tìm thấy hóa đơn xuất hoặc bạn không có quyền truy cập');
    await HoaDonXuatChiTiet.destroy({ where: { id_hd_xuat: id } });
    await hd.destroy();
    return { message: 'Đã xóa hóa đơn xuất khẩu' };
  }
};

module.exports = hoaDonXuatService;
