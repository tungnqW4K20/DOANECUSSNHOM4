'use strict';
const db = require('../models');
const NhapKhoSP = db.NhapKhoSP;
const NhapKhoSPChiTiet = db.NhapKhoSPChiTiet;
const Kho = db.Kho;
const SanPham = db.SanPham;
const TonKhoSP = db.TonKhoSP;

// const createNhapSP = async ({ id_kho, ngay_nhap, file_phieu }) => {
//   if (!id_kho || !ngay_nhap) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_nhap)');
//   const kho = await Kho.findByPk(id_kho);
//   if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);
//   const created = await NhapKhoSP.create({ id_kho, ngay_nhap, file_phieu });
//   return created;
// };
const createNhapSP = async ({ id_kho, ngay_nhap, file_phieu, chi_tiets }) => {
  if (!id_kho || !ngay_nhap) throw new Error('Thiếu dữ liệu bắt buộc (id_kho, ngay_nhap)');
  if (!Array.isArray(chi_tiets) || chi_tiets.length === 0)
    throw new Error('Danh sách chi tiết nhập kho không hợp lệ');

  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

  const t = await db.sequelize.transaction();

  try {
    const phieu = await NhapKhoSP.create({ id_kho, ngay_nhap, file_phieu }, { transaction: t });

    for (const ct of chi_tiets) {
      const { id_sp, so_luong } = ct;
      if (!id_sp || !so_luong) throw new Error('Thiếu id_sp hoặc so_luong');

      const sp = await SanPham.findByPk(id_sp, { transaction: t });
      if (!sp) throw new Error(`Không tìm thấy SP ID=${id_sp}`);

      await NhapKhoSPChiTiet.create(
        { id_nhap: phieu.id_nhap, id_sp, so_luong },
        { transaction: t }
      );

      const tonKho = await TonKhoSP.findOne({ where: { id_kho, id_sp }, transaction: t });
      if (tonKho) {
        await tonKho.increment('so_luong_ton', { by: so_luong, transaction: t });
      } else {
        await TonKhoSP.create({ id_kho, id_sp, so_luong_ton: so_luong }, { transaction: t });
      }
    }

    await t.commit();

    return await NhapKhoSP.findByPk(phieu.id_nhap, {
      include: [
        { model: NhapKhoSPChiTiet, as: 'chiTiets' },
        { model: Kho, as: 'kho' }
      ]
    });
  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
};
const getAllNhapSP = async (id_dn) => {
  return await NhapKhoSP.findAll({
    include: [
      { 
        model: Kho, 
        as: 'kho',
        where: { id_dn },
        required: true
      },
      { model: NhapKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ],
    order: [['id_nhap', 'DESC']]
  });
};

const getNhapSPById = async (id_nhap) => {
  const rec = await NhapKhoSP.findByPk(id_nhap, {
    include: [
      { model: Kho, as: 'kho' },
      { model: NhapKhoSPChiTiet, as: 'chiTiets', include: [{ model: SanPham, as: 'sanPham' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);
  return rec;
};

const updateNhapSP = async (id_nhap, data) => {
  const { id_kho, ngay_nhap, file_phieu, chi_tiets } = data;
  
  const rec = await NhapKhoSP.findByPk(id_nhap, {
    include: [{ model: NhapKhoSPChiTiet, as: 'chiTiets' }]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);

  const t = await db.sequelize.transaction();

  try {
    // Hoàn trả tồn kho cũ trước khi cập nhật
    const oldChiTiets = rec.chiTiets || [];
    for (const oldCt of oldChiTiets) {
      const tonKho = await TonKhoSP.findOne({ 
        where: { id_kho: rec.id_kho, id_sp: oldCt.id_sp }, 
        transaction: t 
      });
      if (tonKho) {
        await tonKho.decrement('so_luong_ton', { by: oldCt.so_luong, transaction: t });
      }
    }

    // Cập nhật thông tin phiếu nhập
    await rec.update({ id_kho, ngay_nhap, file_phieu }, { transaction: t });

    // Xóa chi tiết cũ
    await NhapKhoSPChiTiet.destroy({ where: { id_nhap }, transaction: t });

    // Thêm chi tiết mới và cập nhật tồn kho
    if (Array.isArray(chi_tiets)) {
      for (const ct of chi_tiets) {
        const { id_sp, so_luong } = ct;
        if (!id_sp || !so_luong) continue;

        const sp = await SanPham.findByPk(id_sp, { transaction: t });
        if (!sp) throw new Error(`Không tìm thấy SP ID=${id_sp}`);

        await NhapKhoSPChiTiet.create(
          { id_nhap, id_sp, so_luong },
          { transaction: t }
        );

        // Cập nhật tồn kho mới
        const id_kho_new = id_kho || rec.id_kho;
        const tonKho = await TonKhoSP.findOne({ 
          where: { id_kho: id_kho_new, id_sp }, 
          transaction: t 
        });
        if (tonKho) {
          await tonKho.increment('so_luong_ton', { by: so_luong, transaction: t });
        } else {
          await TonKhoSP.create({ id_kho: id_kho_new, id_sp, so_luong_ton: so_luong }, { transaction: t });
        }
      }
    }

    await t.commit();

    return await NhapKhoSP.findByPk(id_nhap, {
      include: [
        { model: NhapKhoSPChiTiet, as: 'chiTiets' },
        { model: Kho, as: 'kho' }
      ]
    });
  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
};

const deleteNhapSP = async (id_nhap) => {
  const rec = await NhapKhoSP.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập SP ID=${id_nhap}`);
  await NhapKhoSPChiTiet.destroy({ where: { id_nhap } });
  await rec.destroy();
};

// chi tiết
const addChiTiet = async ({ id_nhap, id_sp, so_luong }) => {
  if (!id_nhap || !id_sp || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_nhap, id_sp, so_luong)');
  const phieu = await NhapKhoSP.findByPk(id_nhap);
  if (!phieu) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  const sp = await SanPham.findByPk(id_sp);
  if (!sp) throw new Error(`Không tìm thấy sản phẩm ID=${id_sp}`);

  return await NhapKhoSPChiTiet.create({ id_nhap, id_sp, so_luong });
};

const getChiTietByPhieu = async (id_nhap) => {
  return await NhapKhoSPChiTiet.findAll({
    where: { id_nhap },
    include: [{ model: SanPham, as: 'sanPham' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await NhapKhoSPChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createNhapSP, getAllNhapSP, getNhapSPById, updateNhapSP, deleteNhapSP,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
