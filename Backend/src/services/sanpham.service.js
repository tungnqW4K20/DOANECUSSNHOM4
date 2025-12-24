'use strict';

const db = require('../models');
const SanPham = db.SanPham;
const DonViTinhHQ = db.DonViTinhHQ;
const DoanhNghiep = db.DoanhNghiep;

const createSanPham = async ({ ten_sp, mo_ta, id_dvt_hq, id_dn }) => {
  if (!ten_sp) throw new Error("Tên sản phẩm là bắt buộc");
  if (!id_dvt_hq) throw new Error("Phải chọn đơn vị tính HQ");
  if (!id_dn) throw new Error("Thiếu thông tin doanh nghiệp");

  const existsDVT = await DonViTinhHQ.findByPk(id_dvt_hq);
  if (!existsDVT) throw new Error("Đơn vị tính HQ không hợp lệ");

  // Kiểm tra trùng tên trong cùng doanh nghiệp
  const existsSP = await SanPham.findOne({ where: { ten_sp, id_dn } });
  if (existsSP) throw new Error(`Sản phẩm "${ten_sp}" đã tồn tại trong doanh nghiệp này`);

  return await SanPham.create({ ten_sp, mo_ta, id_dvt_hq, id_dn });
};

const getAllSanPham = async (id_dn, role) => {
  const whereClause = role === 'Admin' ? {} : { id_dn };

  return await SanPham.findAll({
    where: whereClause,
    include: [
      { model: DonViTinhHQ, as: "donViTinhHQ", attributes: ["id_dvt_hq", "ten_dvt"] },
      { model: DoanhNghiep, as: "doanhNghiep", attributes: ["id_dn", "ten_dn"] }
    ],
    order: [['id_sp', 'DESC']]
  });
};

const getSanPhamById = async (id_sp, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_sp } : { id_sp, id_dn };

  return await SanPham.findOne({
    where: whereClause,
    include: [
      { model: DonViTinhHQ, as: "donViTinhHQ", attributes: ["id_dvt_hq", "ten_dvt"] },
      { model: DoanhNghiep, as: "doanhNghiep", attributes: ["id_dn", "ten_dn"] }
    ]
  });
};

const updateSanPham = async (id_sp, data, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_sp } : { id_sp, id_dn };

  const sp = await SanPham.findOne({ where: whereClause });
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp} hoặc bạn không có quyền truy cập`);

  if (data.id_dvt_hq) {
    const existsDVT = await DonViTinhHQ.findByPk(data.id_dvt_hq);
    if (!existsDVT) throw new Error("Đơn vị tính HQ không hợp lệ");
  }

  // Không cho phép thay đổi id_dn
  delete data.id_dn;

  await sp.update({
    ten_sp: data.ten_sp || sp.ten_sp,
    mo_ta: data.mo_ta !== undefined ? data.mo_ta : sp.mo_ta,
    id_dvt_hq: data.id_dvt_hq || sp.id_dvt_hq
  });

  return sp;
};

const deleteSanPham = async (id_sp, id_dn, role) => {
  const whereClause = role === 'Admin' ? { id_sp } : { id_sp, id_dn };

  const sp = await SanPham.findOne({ where: whereClause });
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp} hoặc bạn không có quyền truy cập`);
  await sp.destroy();
};

module.exports = {
  createSanPham,
  getAllSanPham,
  getSanPhamById,
  updateSanPham,
  deleteSanPham
};
