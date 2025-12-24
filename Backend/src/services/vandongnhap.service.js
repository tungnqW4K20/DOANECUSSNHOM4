'use strict';
const db = require('../models');
const VanDonNhap = db.VanDonNhap;
const LoHang = db.LoHang;
const HopDong = db.HopDong;

const createVDN = async (data, id_dn, role) => {
  const { id_lh, so_vd, ngay_phat_hanh, cang_xuat, cang_nhap, file_van_don } = data;
  if (!id_lh || !so_vd || !ngay_phat_hanh) throw new Error('Thiếu dữ liệu bắt buộc');

  const includeHopDong = role === 'Admin' ? [] : [{
    model: HopDong,
    as: 'hopDong',
    where: { id_dn },
    required: true
  }];

  const lh = await LoHang.findOne({ where: { id_lh }, include: includeHopDong });
  if (!lh) throw new Error(`Không tìm thấy lô hàng ID=${id_lh} hoặc bạn không có quyền truy cập`);

  const exists = await VanDonNhap.findOne({ where: { so_vd } });
  if (exists) throw new Error(`Số vận đơn "${so_vd}" đã tồn tại`);

  return await VanDonNhap.create({ id_lh, so_vd, ngay_phat_hanh, cang_xuat, cang_nhap, file_van_don });
};

const getAllVDN = async (id_dn, role) => {
  if (role === 'Admin') {
    return await VanDonNhap.findAll({
      include: [{ model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] }],
      order: [['id_vd', 'DESC']]
    });
  }

  return await VanDonNhap.findAll({
    include: [{
      model: LoHang,
      as: 'loHang',
      required: true,
      include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
    }],
    order: [['id_vd', 'DESC']]
  });
};

const getVDNById = async (id_vd, id_dn, role) => {
  if (role === 'Admin') {
    return await VanDonNhap.findByPk(id_vd, {
      include: [{ model: LoHang, as: 'loHang', include: [{ model: HopDong, as: 'hopDong' }] }]
    });
  }

  return await VanDonNhap.findOne({
    where: { id_vd },
    include: [{
      model: LoHang,
      as: 'loHang',
      required: true,
      include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
    }]
  });
};

const updateVDN = async (id_vd, data, id_dn, role) => {
  let record;
  if (role === 'Admin') {
    record = await VanDonNhap.findByPk(id_vd);
  } else {
    record = await VanDonNhap.findOne({
      where: { id_vd },
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
      }]
    });
  }
  if (!record) throw new Error('Không tìm thấy vận đơn nhập hoặc bạn không có quyền truy cập');
  delete data.id_lh;
  await record.update(data);
  return record;
};

const deleteVDN = async (id_vd, id_dn, role) => {
  let record;
  if (role === 'Admin') {
    record = await VanDonNhap.findByPk(id_vd);
  } else {
    record = await VanDonNhap.findOne({
      where: { id_vd },
      include: [{
        model: LoHang,
        as: 'loHang',
        required: true,
        include: [{ model: HopDong, as: 'hopDong', where: { id_dn }, required: true }]
      }]
    });
  }
  if (!record) throw new Error('Không tìm thấy vận đơn nhập hoặc bạn không có quyền truy cập');
  await record.destroy();
};

module.exports = { createVDN, getAllVDN, getVDNById, updateVDN, deleteVDN };
