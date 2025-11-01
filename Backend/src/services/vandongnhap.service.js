'use strict';
const db = require('../models');
const VanDonNhap = db.VanDonNhap;
const LoHang = db.LoHang;

const createVDN = async (data) => {
  const { id_lh, so_vd, ngay_phat_hanh, cang_xuat, cang_nhap, file_van_don } = data;
  if (!id_lh || !so_vd || !ngay_phat_hanh) throw new Error('Thiếu dữ liệu bắt buộc');

  const lh = await LoHang.findByPk(id_lh);
  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh}`);

  const exists = await VanDonNhap.findOne({ where: { so_vd } });
  if (exists) throw new Error(`Số vận đơn "${so_vd}" đã tồn tại`);

  return await VanDonNhap.create({ id_lh, so_vd, ngay_phat_hanh, cang_xuat, cang_nhap, file_van_don });
};

const getAllVDN = async () => {
  return await VanDonNhap.findAll({
    include: [{ model: LoHang, as: 'loHang' }],
    order: [['id_vd', 'DESC']]
  });
};

const getVDNById = async (id_vd) => {
  return await VanDonNhap.findByPk(id_vd, {
    include: [{ model: LoHang, as: 'loHang' }]
  });
};

const updateVDN = async (id_vd, data) => {
  const record = await VanDonNhap.findByPk(id_vd);
  if (!record) throw new Error('Không tìm thấy vận đơn nhập');
  await record.update(data);
  return record;
};

const deleteVDN = async (id_vd) => {
  const record = await VanDonNhap.findByPk(id_vd);
  if (!record) throw new Error('Không tìm thấy vận đơn nhập');
  await record.destroy();
};

module.exports = { createVDN, getAllVDN, getVDNById, updateVDN, deleteVDN };
