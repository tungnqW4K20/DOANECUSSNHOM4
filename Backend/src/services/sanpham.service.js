'use strict';

const db = require('../models');
const SanPham = db.SanPham;
const DonViTinhHQ = db.DonViTinhHQ;

const createSanPham = async ({ ten_sp, mo_ta, id_dvt_hq }) => {
  if (!ten_sp) throw new Error("Tên sản phẩm là bắt buộc");
  if (!id_dvt_hq) throw new Error("Phải chọn đơn vị tính HQ");

  const existsDVT = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!existsDVT) throw new Error("Đơn vị tính HQ không hợp lệ");

  const existsSP = await SanPham.findOne({ where: { ten_sp } });
  if (existsSP) throw new Error(`Sản phẩm "${ten_sp}" đã tồn tại`);

  return await SanPham.create({ ten_sp, mo_ta, id_dvt_hq });
};

const getAllSanPham = async () => {
  return await SanPham.findAll({
    include: [{ model: DonViTinhHQ, as: "donViTinhHQ", attributes: ["id_dvt_hq", "ten_dvt"] }]
  });
};

const getSanPhamById = async (id_sp) => {
  return await SanPham.findByPk(id_sp, {
    include: [{ model: DonViTinhHQ, as: "donViTinhHQ", attributes: ["id_dvt_hq", "ten_dvt"] }]
  });
};

const updateSanPham = async (id_sp, { ten_sp, mo_ta, id_dvt_hq }) => {
  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp}`);

  if (id_dvt_hq) {
    const existsDVT = await DonViTinhHQ.findByPk(id_dvt_hq);
    if (!existsDVT) throw new Error("Đơn vị tính HQ không hợp lệ");
  }

  await sp.update({
    ten_sp: ten_sp || sp.ten_sp,
    mo_ta: mo_ta !== undefined ? mo_ta : sp.mo_ta,
    id_dvt_hq: id_dvt_hq || sp.id_dvt_hq
  });

  return sp;
};

const deleteSanPham = async (id_sp) => {
  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp}`);
  await sp.destroy();
};

module.exports = {
  createSanPham,
  getAllSanPham,
  getSanPhamById,
  updateSanPham,
  deleteSanPham
};
