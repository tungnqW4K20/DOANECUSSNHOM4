'use strict';
const db = require('../models');
const ToKhaiNhap = db.ToKhaiNhap;
const LoHang = db.LoHang;
const TienTe = db.TienTe;
const HopDong = db.HopDong;

const createTKN = async (data, id_dn, role) => {
  const { id_lh, so_tk, ngay_tk, tong_tri_gia, id_tt, file_to_khai, trang_thai } = data;
  if (!id_lh || !so_tk || !ngay_tk) throw new Error('Thiếu dữ liệu bắt buộc');

  // Kiểm tra lô hàng thuộc doanh nghiệp
  const whereLoHang = role === 'Admin' ? { id_lh } : { id_lh };
  const includeHopDong = role === 'Admin' ? [] : [{
    model: HopDong,
    as: 'hopDong',
    where: { id_dn },
    required: true
  }];

  const lh = await LoHang.findOne({
    where: whereLoHang,
    include: includeHopDong
  });

  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh} hoặc bạn không có quyền truy cập`);

  // Kiểm tra số tờ khai trùng
  const exists = await ToKhaiNhap.findOne({ where: { so_tk } });
  if (exists) throw new Error(`Số tờ khai "${so_tk}" đã tồn tại`);

  return await ToKhaiNhap.create({ id_lh, so_tk, ngay_tk, tong_tri_gia, id_tt, file_to_khai, trang_thai });
};

const getAllTKN = async (id_dn, role) => {
  if (role === 'Admin') {
    return await ToKhaiNhap.findAll({
      include: [
        { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
        { model: TienTe, as: 'tienTe' }
      ],
      order: [['id_tkn', 'DESC']]
    });
  }

  // Lọc theo doanh nghiệp qua LoHang → HopDong
  return await ToKhaiNhap.findAll({
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
    order: [['id_tkn', 'DESC']]
  });
};

const getTKNById = async (id_tkn, id_dn, role) => {
  if (role === 'Admin') {
    return await ToKhaiNhap.findByPk(id_tkn, {
      include: [
        { model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] },
        { model: TienTe, as: 'tienTe' }
      ]
    });
  }

  return await ToKhaiNhap.findOne({
    where: { id_tkn },
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
};

const updateTKN = async (id_tkn, data, id_dn, role) => {
  let record;

  if (role === 'Admin') {
    record = await ToKhaiNhap.findByPk(id_tkn);
  } else {
    record = await ToKhaiNhap.findOne({
      where: { id_tkn },
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

  if (!record) throw new Error('Không tìm thấy tờ khai nhập hoặc bạn không có quyền truy cập');

  // Không cho phép thay đổi id_lh
  delete data.id_lh;

  await record.update(data);
  return record;
};

const deleteTKN = async (id_tkn, id_dn, role) => {
  let record;

  if (role === 'Admin') {
    record = await ToKhaiNhap.findByPk(id_tkn);
  } else {
    record = await ToKhaiNhap.findOne({
      where: { id_tkn },
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

  if (!record) throw new Error('Không tìm thấy tờ khai nhập hoặc bạn không có quyền truy cập');
  await record.destroy();
};

module.exports = { createTKN, getAllTKN, getTKNById, updateTKN, deleteTKN };
