'use strict';

const db = require('../models');
const DinhMucSanPham = db.DinhMucSanPham;
const NguyenPhuLieu = db.NguyenPhuLieu;
const SanPham = db.SanPham;
const DoanhNghiep = db.DoanhNghiep;

const createDinhMucSanPham = async ({ id_sp, dinh_muc_chi_tiet }, id_dn, role) => {
  if (!id_sp || !Array.isArray(dinh_muc_chi_tiet) || dinh_muc_chi_tiet.length === 0)
    throw new Error("Thiếu dữ liệu định mức");

  // Kiểm tra sản phẩm thuộc doanh nghiệp
  const whereClauseSP = role === 'Admin' ? { id_sp } : { id_sp, id_dn };
  const sp = await SanPham.findOne({ where: whereClauseSP });
  if (!sp) throw new Error("Sản phẩm không tồn tại hoặc bạn không có quyền truy cập");

  const records = [];
  for (const item of dinh_muc_chi_tiet) {
    const { id_nguyen_lieu, so_luong, ghi_chu } = item;

    // Kiểm tra nguyên liệu thuộc doanh nghiệp
    const whereClauseNPL = role === 'Admin' ? { id_npl: id_nguyen_lieu } : { id_npl: id_nguyen_lieu, id_dn };
    const nl = await NguyenPhuLieu.findOne({ where: whereClauseNPL });
    if (!nl) throw new Error(`Nguyên liệu ID=${id_nguyen_lieu} không tồn tại hoặc bạn không có quyền truy cập`);

    const created = await DinhMucSanPham.create({ id_sp, id_npl: id_nguyen_lieu, so_luong, ghi_chu });
    records.push(created);
  }

  return records;
};

const getAllDinhMuc = async (id_dn, role) => {
  if (role === 'Admin') {
    return await DinhMucSanPham.findAll({
      include: [
        { model: SanPham, as: 'sanPham', include: [{ model: DoanhNghiep, as: 'doanhNghiep' }] },
        { model: NguyenPhuLieu, as: 'nguyenPhuLieu' }
      ],
      order: [['id_dm', 'DESC']]
    });
  }

  // Lọc định mức theo sản phẩm của doanh nghiệp
  return await DinhMucSanPham.findAll({
    include: [
      {
        model: SanPham,
        as: 'sanPham',
        where: { id_dn },
        required: true,
        include: [{ model: DoanhNghiep, as: 'doanhNghiep' }]
      },
      { model: NguyenPhuLieu, as: 'nguyenPhuLieu' }
    ],
    order: [['id_dm', 'DESC']]
  });
};

const getDinhMucByProduct = async (id_sp, id_dn, role) => {
  // Kiểm tra sản phẩm thuộc doanh nghiệp
  const whereClauseSP = role === 'Admin' ? { id_sp } : { id_sp, id_dn };
  const sp = await SanPham.findOne({ where: whereClauseSP });
  if (!sp) throw new Error("Sản phẩm không tồn tại hoặc bạn không có quyền truy cập");

  return await DinhMucSanPham.findAll({
    where: { id_sp },
    include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
  });
};

const deleteDinhMuc = async (id_dm, id_dn, role) => {
  let dm;

  if (role === 'Admin') {
    dm = await DinhMucSanPham.findByPk(id_dm);
  } else {
    // Kiểm tra định mức thuộc sản phẩm của doanh nghiệp
    dm = await DinhMucSanPham.findOne({
      where: { id_dm },
      include: [{
        model: SanPham,
        as: 'sanPham',
        where: { id_dn },
        required: true
      }]
    });
  }

  if (!dm) throw new Error("Không tìm thấy định mức hoặc bạn không có quyền truy cập");
  await dm.destroy();
};

// Lấy danh sách sản phẩm theo doanh nghiệp (để dropdown)
const getSanPhamByDN = async (id_dn, role) => {
  const whereClause = role === 'Admin' ? {} : { id_dn };
  return await SanPham.findAll({
    where: whereClause,
    attributes: ['id_sp', 'ten_sp'],
    order: [['ten_sp', 'ASC']]
  });
};

// Lấy danh sách nguyên liệu theo doanh nghiệp (để dropdown)
const getNguyenLieuByDN = async (id_dn, role) => {
  const whereClause = role === 'Admin' ? {} : { id_dn };
  return await NguyenPhuLieu.findAll({
    where: whereClause,
    attributes: ['id_npl', 'ten_npl'],
    order: [['ten_npl', 'ASC']]
  });
};

module.exports = {
  createDinhMucSanPham,
  getAllDinhMuc,
  getDinhMucByProduct,
  deleteDinhMuc,
  getSanPhamByDN,
  getNguyenLieuByDN
};
