'use strict';
const db = require('../models');
const XuatKhoNPL = db.XuatKhoNPL;
const XuatKhoNPLChiTiet = db.XuatKhoNPLChiTiet;
const Kho = db.Kho;
const NguyenPhuLieu = db.NguyenPhuLieu;

// const createXuatNPL = async ({ id_kho, ngay_xuat, file_phieu }) => {
//   if (!id_kho || !ngay_xuat) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_xuat)');
//   const kho = await Kho.findByPk(id_kho);
//   if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

//   const created = await XuatKhoNPL.create({ id_kho, ngay_xuat, file_phieu });
//   return created;
// };

const createXuatNPL = async ({ id_kho, ngay_xuat, file_phieu, chi_tiets }) => {
  if (!id_kho || !ngay_xuat) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_xuat)');
  if (!Array.isArray(chi_tiets) || chi_tiets.length === 0)
    throw new Error('Danh sách chi tiết xuất kho không hợp lệ');

  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

  const t = await db.sequelize.transaction();
  try {
    // Tạo phiếu xuất chính
    const phieu = await XuatKhoNPL.create({ id_kho, ngay_xuat, file_phieu }, { transaction: t });

    // Tạo chi tiết phiếu xuất
    for (const ct of chi_tiets) {
      const { id_npl, so_luong } = ct;
      if (!id_npl || !so_luong) throw new Error('Thiếu id_npl hoặc so_luong trong chi tiết');

      const npl = await NguyenPhuLieu.findByPk(id_npl);
      if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);
      //  Kiểm tra đủ tồn kho hay không
      // if (npl.so_luong_ton < so_luong)
      //   throw new Error(
      //     `Nguyên phụ liệu ID=${id_npl} không đủ tồn kho (còn ${npl.so_luong_ton})`
      //   );
      await XuatKhoNPLChiTiet.create(
        { id_xuat: phieu.id_xuat, id_npl, so_luong },
        { transaction: t }
      );

      // Trừ tồn kho
      // await npl.decrement('so_luong_ton', {
      //   by: so_luong,
      //   transaction: t
      // });

    }

    await t.commit();

    // Trả kết quả đầy đủ (có chi tiết)
    return await XuatKhoNPL.findByPk(phieu.id_xuat, {
      include: [{ model: XuatKhoNPLChiTiet, as: 'chiTiets' }, { model: Kho, as: 'kho' }]
    });
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAllXuatNPL = async () => {
  return await XuatKhoNPL.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: XuatKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_xuat', 'DESC']]
  });
};

const getXuatNPLById = async (id_xuat) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat, {
    include: [
      { model: Kho, as: 'kho' },
      { model: XuatKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  return rec;
};

const updateXuatNPL = async (id_xuat, data) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  await rec.update(data);
  return rec;
};

const deleteXuatNPL = async (id_xuat) => {
  const rec = await XuatKhoNPL.findByPk(id_xuat);
  if (!rec) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  await XuatKhoNPLChiTiet.destroy({ where: { id_xuat } });
  await rec.destroy();
};

// chi tiết
const addChiTiet = async ({ id_xuat, id_npl, so_luong }) => {
  if (!id_xuat || !id_npl || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_xuat, id_npl, so_luong)');
  const phieu = await XuatKhoNPL.findByPk(id_xuat);
  if (!phieu) throw new Error(`Không tìm thấy phiếu xuất ID=${id_xuat}`);
  const npl = await NguyenPhuLieu.findByPk(id_npl);
  if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

  return await XuatKhoNPLChiTiet.create({ id_xuat, id_npl, so_luong });
};

const getChiTietByPhieu = async (id_xuat) => {
  return await XuatKhoNPLChiTiet.findAll({
    where: { id_xuat },
    include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await XuatKhoNPLChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createXuatNPL, getAllXuatNPL, getXuatNPLById, updateXuatNPL, deleteXuatNPL,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
