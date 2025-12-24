const { ToKhaiXuat, LoHang, TienTe, HopDong } = require('../models');

const toKhaiXuatService = {
  async getAll(id_dn, role) {
    if (role === 'Admin') {
      return await ToKhaiXuat.findAll({
        include: [
          { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
          { model: TienTe, as: 'tienTe' }
        ],
        order: [['id_tkx', 'DESC']]
      });
    }

    return await ToKhaiXuat.findAll({
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
        { model: TienTe, as: 'tienTe' }
      ],
      order: [['id_tkx', 'DESC']]
    });
  },

  async getById(id, id_dn, role) {
    if (role === 'Admin') {
      return await ToKhaiXuat.findByPk(id, {
        include: [
          { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
          { model: TienTe, as: 'tienTe' }
        ]
      });
    }

    return await ToKhaiXuat.findOne({
      where: { id_tkx: id },
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
        { model: TienTe, as: 'tienTe' }
      ]
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

    return await ToKhaiXuat.create(data);
  },

  async update(id, data, id_dn, role) {
    let tk;
    if (role === 'Admin') {
      tk = await ToKhaiXuat.findByPk(id);
    } else {
      tk = await ToKhaiXuat.findOne({
        where: { id_tkx: id },
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

    if (!tk) throw new Error('Không tìm thấy tờ khai xuất hoặc bạn không có quyền truy cập');
    delete data.id_lh;
    return await tk.update(data);
  },

  async delete(id, id_dn, role) {
    let tk;
    if (role === 'Admin') {
      tk = await ToKhaiXuat.findByPk(id);
    } else {
      tk = await ToKhaiXuat.findOne({
        where: { id_tkx: id },
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

    if (!tk) throw new Error('Không tìm thấy tờ khai xuất hoặc bạn không có quyền truy cập');
    await tk.destroy();
    return { message: 'Đã xóa tờ khai xuất' };
  }
};

module.exports = toKhaiXuatService;
