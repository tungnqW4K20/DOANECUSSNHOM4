'use strict';
const db = require('../models');
const NhapKhoNPL = db.NhapKhoNPL;
const NhapKhoNPLChiTiet = db.NhapKhoNPLChiTiet;
const Kho = db.Kho;
const HoaDonNhap = db.HoaDonNhap;
const NguyenPhuLieu = db.NguyenPhuLieu;
const TonKhoNPL = db.TonKhoNPL

// const createNhapNPL = async ({ id_kho, id_hd_nhap, ngay_nhap, file_phieu, chi_tiets }) => {
//   // 1️⃣ Kiểm tra dữ liệu đầu vào
//   if (!id_kho || !id_hd_nhap || !ngay_nhap)
//     throw new Error('Thiếu dữ liệu bắt buộc (id_kho, id_hd_nhap, ngay_nhap)');
//   if (!Array.isArray(chi_tiets) || chi_tiets.length === 0)
//     throw new Error('Danh sách chi tiết nhập kho không hợp lệ');

//   // 2️⃣ Kiểm tra kho và hóa đơn tồn tại
//   const kho = await Kho.findByPk(id_kho);
//   if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

//   const hoaDon = await HoaDonNhap.findByPk(id_hd_nhap);
//   if (!hoaDon) throw new Error(`Không tìm thấy hóa đơn nhập ID=${id_hd_nhap}`);

//   // 3️⃣ Mở transaction để đảm bảo toàn vẹn dữ liệu
//   const t = await db.sequelize.transaction();

//   try {
//     // 4️⃣ Tạo phiếu nhập chính
//     const phieu = await NhapKhoNPL.create(
//       { id_kho, id_hd_nhap, ngay_nhap, file_phieu },
//       { transaction: t }
//     );

//     // 5️⃣ Xử lý từng chi tiết nhập
//     for (const ct of chi_tiets) {
//       const { id_npl, so_luong } = ct;

//       if (!id_npl || !so_luong)
//         throw new Error('Thiếu id_npl hoặc so_luong trong chi tiết');

//       // 5.1️⃣ Kiểm tra nguyên phụ liệu tồn tại
//       const npl = await NguyenPhuLieu.findByPk(id_npl, { transaction: t });
//       if (!npl)
//         throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

//       // 5.2️⃣ Tạo chi tiết phiếu nhập
//       await NhapKhoNPLChiTiet.create(
//         {
//           id_nhap: phieu.id_nhap,
//           id_npl,
//           so_luong
//         },
//         { transaction: t }
//       );

//       // 5.3️⃣ Cộng tồn kho
//       // await npl.increment('so_luong_ton', { by: so_luong, transaction: t });
//     }

//     // 6️⃣ Commit transaction nếu mọi thứ OK
//     await t.commit();

//     // 7️⃣ Trả về phiếu nhập kèm chi tiết + kho + hóa đơn
//     const result = await NhapKhoNPL.findByPk(phieu.id_nhap, {
//       include: [
//         { model: Kho, as: 'kho' },
//         { model: HoaDonNhap, as: 'hoaDonNhap' },
//         { model: NhapKhoNPLChiTiet, as: 'chiTiets' }
//       ]
//     });

//     return result;
//   } catch (err) {
//     await t.rollback();
//     throw err;
//   }
// };

const createNhapNPL = async ({ id_kho, id_hd_nhap, ngay_nhap, file_phieu, chi_tiets }) => {

  // 1️⃣ Kiểm tra dữ liệu đầu vào
  if (!id_kho || !id_hd_nhap || !ngay_nhap)
    throw new Error('Thiếu dữ liệu bắt buộc (id_kho, id_hd_nhap, ngay_nhap)');
  if (!Array.isArray(chi_tiets) || chi_tiets.length === 0)
    throw new Error('Danh sách chi tiết nhập kho không hợp lệ');

  // 2️⃣ Kiểm tra kho & hóa đơn
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error(`Không tìm thấy kho ID=${id_kho}`);

  const hoaDon = await HoaDonNhap.findByPk(id_hd_nhap);
  if (!hoaDon) throw new Error(`Không tìm thấy hóa đơn nhập ID=${id_hd_nhap}`);

  // 3️⃣ Transaction để đảm bảo toàn vẹn dữ liệu
  const t = await db.sequelize.transaction();

  try {
    // 4️⃣ Tạo phiếu nhập
    const phieu = await NhapKhoNPL.create(
      { id_kho, id_hd_nhap, ngay_nhap, file_phieu },
      { transaction: t }
    );

    // 5️⃣ Xử lý từng dòng chi tiết
    for (const ct of chi_tiets) {
      const { id_npl, so_luong_nhap } = ct;

      if (!id_npl || !so_luong_nhap)
        throw new Error('Thiếu id_npl hoặc so_luong_nhap trong chi tiết');

      // 5.1️⃣ Kiểm tra nguyên phụ liệu tồn tại
      const npl = await NguyenPhuLieu.findByPk(id_npl, { transaction: t });
      if (!npl)
        throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

      // 5.2️⃣ Tạo chi tiết phiếu nhập
      await NhapKhoNPLChiTiet.create(
        {
          id_nhap: phieu.id_nhap,
          id_npl,
          so_luong: so_luong_nhap
        },
        { transaction: t }
      );

      // 5.3️⃣ CẬP NHẬT TỒN KHO ↓↓↓ (ĐIỂM QUAN TRỌNG NHẤT)
      let ton = await TonKhoNPL.findOne({
        where: { id_kho, id_npl },
        transaction: t
      });

      if (ton) {
        // Nếu đã có → cộng thêm
        await ton.increment("so_luong_ton", { by: so_luong_nhap, transaction: t });
      } else {
        // Nếu chưa có → tạo mới
        await TonKhoNPL.create(
          {
            id_kho,
            id_npl,
            so_luong_ton: so_luong_nhap
          },
          { transaction: t }
        );
      }
    }

    // 6️⃣ Commit
    await t.commit();

    // 7️⃣ Trả về phiếu nhập đầy đủ
    return await NhapKhoNPL.findByPk(phieu.id_nhap, {
      include: [
        { model: Kho, as: 'kho' },
        { model: HoaDonNhap, as: 'hoaDonNhap' },
        { model: NhapKhoNPLChiTiet, as: 'chiTiets' }
      ]
    });

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAllNhapNPL = async () => {
  return await NhapKhoNPL.findAll({
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonNhap, as: 'hoaDonNhap' },
      { model: NhapKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ],
    order: [['id_nhap', 'DESC']]
  });
};

const getNhapNPLById = async (id_nhap) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap, {
    include: [
      { model: Kho, as: 'kho' },
      { model: HoaDonNhap, as: 'hoaDonNhap' },
      { model: NhapKhoNPLChiTiet, as: 'chiTiets', include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }] }
    ]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  return rec;
};

const updateNhapNPL = async (id_nhap, data) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  await rec.update(data);
  return rec;
};

const deleteNhapNPL = async (id_nhap) => {
  const rec = await NhapKhoNPL.findByPk(id_nhap);
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  // xóa chi tiết trước (ràng buộc)
  await NhapKhoNPLChiTiet.destroy({ where: { id_nhap } });
  await rec.destroy();
};

//
// Chi tiết
//
const addChiTiet = async ({ id_nhap, id_npl, so_luong }) => {
  if (!id_nhap || !id_npl || so_luong == null) throw new Error('Thiếu dữ liệu chi tiết (id_nhap, id_npl, so_luong)');
  const phieu = await NhapKhoNPL.findByPk(id_nhap);
  if (!phieu) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);
  const npl = await NguyenPhuLieu.findByPk(id_npl);
  if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

  return await NhapKhoNPLChiTiet.create({ id_nhap, id_npl, so_luong });
};

const getChiTietByPhieu = async (id_nhap) => {
  return await NhapKhoNPLChiTiet.findAll({
    where: { id_nhap },
    include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
  });
};

const deleteChiTiet = async (id_ct) => {
  const ct = await NhapKhoNPLChiTiet.findByPk(id_ct);
  if (!ct) throw new Error(`Không tìm thấy chi tiết ID=${id_ct}`);
  await ct.destroy();
};

module.exports = {
  createNhapNPL, getAllNhapNPL, getNhapNPLById, updateNhapNPL, deleteNhapNPL,
  addChiTiet, getChiTietByPhieu, deleteChiTiet
};
