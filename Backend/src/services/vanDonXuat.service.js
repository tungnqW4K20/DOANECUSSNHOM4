const { VanDonXuat, LoHang, HopDong } = require('../models');

const vanDonXuatService = {
  async getAll(id_dn, role) {
    if (role === 'Admin') {
      return await VanDonXuat.findAll({
        include: [{ model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] }],
        order: [['id_vd', 'DESC']]
      });
    }

    return await VanDonXuat.findAll({
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
      }],
      order: [['id_vd', 'DESC']]
    });
  },

  async getById(id, id_dn, role) {
    if (role === 'Admin') {
      return await VanDonXuat.findByPk(id, {
        include: [{ model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] }]
      });
    }

    return await VanDonXuat.findOne({
      where: { id_vd: id },
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
      }]
    });
  },

  async create(data, id_dn, role) {
    const { id_lh } = data;
    if (!id_lh) throw new Error('Thiếu id_lh');

    const includeHopDong = role === 'Admin' ? [] : [{
      model: HopDong,
      as: 'hopDong',
      where: { id_dn },
      required: true
    }];

    const lh = await LoHang.findOne({ where: { id_lh }, include: includeHopDong });
    if (!lh) throw new Error('Không tìm thấy lô hàng hoặc bạn không có quyền truy cập');

    return await VanDonXuat.create(data);
  },

  async update(id, data, id_dn, role) {
    let vd;
    if (role === 'Admin') {
      vd = await VanDonXuat.findByPk(id);
    } else {
      vd = await VanDonXuat.findOne({
        where: { id_vd: id },
        include: [{
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
        }]
      });
    }

    if (!vd) throw new Error('Không tìm thấy vận đơn hoặc bạn không có quyền truy cập');
    delete data.id_lh;
    return await vd.update(data);
  },

  async delete(id, id_dn, role) {
    let vd;
    if (role === 'Admin') {
      vd = await VanDonXuat.findByPk(id);
    } else {
      vd = await VanDonXuat.findOne({
        where: { id_vd: id },
        include: [{
          model: LoHang,
          as: 'loHang',
          required: true,
          include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
        }]
      });
    }

    if (!vd) throw new Error('Không tìm thấy vận đơn hoặc bạn không có quyền truy cập');
    await vd.destroy();
    return { message: 'Đã xóa vận đơn' };
  }
};

module.exports = vanDonXuatService;
