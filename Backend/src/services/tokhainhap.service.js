'use strict';
const db = require('../models');
const ToKhaiNhap = db.ToKhaiNhap;
const LoHang = db.LoHang;
const TienTe = db.TienTe;

const createTKN = async (data) => {
  const { id_lh, so_tk, ngay_tk, tong_tri_gia, id_tt, file_to_khai, trang_thai } = data;
  if (!id_lh || !so_tk || !ngay_tk) throw new Error('Thiếu dữ liệu bắt buộc');

  const lh = await LoHang.findByPk(id_lh);
  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);

  const exists = await ToKhaiNhap.findOne({ where: { so_tk } });
  if (exists) throw new Error(`Số tờ khai "${so_tk}" đã tồn tại`);

  return await ToKhaiNhap.create({ id_lh, so_tk, ngay_tk, tong_tri_gia, id_tt, file_to_khai, trang_thai });
};

const getAllTKN = async () => {
  return await ToKhaiNhap.findAll({
    include: [
      { model: LoHang, as: 'loHang' },
      { model: TienTe, as: 'tienTe' }
    ],
    order: [['id_tkn', 'DESC']]
  });
};

const getTKNById = async (id_tkn) => {
  return await ToKhaiNhap.findByPk(id_tkn, {
    include: [
      { model: LoHang, as: 'loHang' },
      { model: TienTe, as: 'tienTe' }
    ]
  });
};

const updateTKN = async (id_tkn, data) => {
  const record = await ToKhaiNhap.findByPk(id_tkn);
  if (!record) throw new Error('Không tìm thấy tờ khai nhập');
  await record.update(data);
  return record;
};

const deleteTKN = async (id_tkn) => {
  const record = await ToKhaiNhap.findByPk(id_tkn);
  if (!record) throw new Error('Không tìm thấy tờ khai nhập');
  await record.destroy();
};

module.exports = { createTKN, getAllTKN, getTKNById, updateTKN, deleteTKN };
