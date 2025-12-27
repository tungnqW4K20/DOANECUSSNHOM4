'use strict';
const db = require('../models');
const NhapKhoNPL = db.NhapKhoNPL;
const NhapKhoNPLChiTiet = db.NhapKhoNPLChiTiet;
const Kho = db.Kho;
const HoaDonNhap = db.HoaDonNhap;
const HoaDonNhapChiTiet = db.HoaDonNhapChiTiet;
const NguyenPhuLieu = db.NguyenPhuLieu;
const TonKhoNPL = db.TonKhoNPL;

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

  // 2.5️⃣ Kiểm tra số lượng có thể nhập
  const soLuongCoTheNhap = await getSoLuongCoTheNhap(id_hd_nhap);
  
  for (const ct of chi_tiets) {
    const { id_npl, so_luong_nhap, so_luong } = ct;
    const qty = so_luong_nhap || so_luong;
    
    // Kiểm tra số lượng > 0
    if (!qty || qty <= 0) {
      throw new Error(`NPL ID=${id_npl}: Số lượng nhập phải lớn hơn 0`);
    }
    
    const nplInfo = soLuongCoTheNhap.find(item => item.id_npl === id_npl);
    if (!nplInfo) {
      throw new Error(`NPL ID=${id_npl} không có trong hóa đơn nhập này`);
    }
    
    if (qty > nplInfo.co_the_nhap) {
      throw new Error(
        `NPL "${nplInfo.ten_npl}": Số lượng nhập (${qty}) vượt quá số lượng có thể nhập (${nplInfo.co_the_nhap}). ` +
        `Tổng theo HĐ: ${nplInfo.so_luong_hd}, Đã nhập: ${nplInfo.da_nhap}`
      );
    }
  }

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

const getAllNhapNPL = async (id_dn) => {
  return await NhapKhoNPL.findAll({
    include: [
      { 
        model: Kho, 
        as: 'kho',
        where: { id_dn },
        required: true
      },
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
  const { id_kho, id_hd_nhap, ngay_nhap, file_phieu, chi_tiets } = data;
  
  const rec = await NhapKhoNPL.findByPk(id_nhap, {
    include: [{ model: NhapKhoNPLChiTiet, as: 'chiTiets' }]
  });
  if (!rec) throw new Error(`Không tìm thấy phiếu nhập ID=${id_nhap}`);

  const t = await db.sequelize.transaction();

  try {
    // Hoàn trả tồn kho cũ trước khi cập nhật
    const oldChiTiets = rec.chiTiets || [];
    for (const oldCt of oldChiTiets) {
      const tonKho = await TonKhoNPL.findOne({ 
        where: { id_kho: rec.id_kho, id_npl: oldCt.id_npl }, 
        transaction: t 
      });
      if (tonKho) {
        await tonKho.decrement('so_luong_ton', { by: oldCt.so_luong, transaction: t });
      }
    }

    // Cập nhật thông tin phiếu nhập
    await rec.update({ id_kho, id_hd_nhap, ngay_nhap, file_phieu }, { transaction: t });

    // Xóa chi tiết cũ
    await NhapKhoNPLChiTiet.destroy({ where: { id_nhap }, transaction: t });

    // Thêm chi tiết mới và cập nhật tồn kho
    if (Array.isArray(chi_tiets)) {
      for (const ct of chi_tiets) {
        const { id_npl, so_luong_nhap, so_luong } = ct;
        const qty = so_luong_nhap || so_luong;
        if (!id_npl || !qty) continue;

        const npl = await NguyenPhuLieu.findByPk(id_npl, { transaction: t });
        if (!npl) throw new Error(`Không tìm thấy nguyên phụ liệu ID=${id_npl}`);

        await NhapKhoNPLChiTiet.create(
          { id_nhap, id_npl, so_luong: qty },
          { transaction: t }
        );

        // Cập nhật tồn kho mới
        const id_kho_new = id_kho || rec.id_kho;
        const tonKho = await TonKhoNPL.findOne({ 
          where: { id_kho: id_kho_new, id_npl }, 
          transaction: t 
        });
        if (tonKho) {
          await tonKho.increment('so_luong_ton', { by: qty, transaction: t });
        } else {
          await TonKhoNPL.create({ id_kho: id_kho_new, id_npl, so_luong_ton: qty }, { transaction: t });
        }
      }
    }

    await t.commit();

    return await NhapKhoNPL.findByPk(id_nhap, {
      include: [
        { model: Kho, as: 'kho' },
        { model: HoaDonNhap, as: 'hoaDonNhap' },
        { model: NhapKhoNPLChiTiet, as: 'chiTiets' }
      ]
    });
  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
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

// Lấy số lượng NPL có thể nhập theo hóa đơn nhập
const getSoLuongCoTheNhap = async (id_hd_nhap) => {
  if (!id_hd_nhap) throw new Error('Thiếu id_hd_nhap');

  // 1. Lấy chi tiết hóa đơn nhập (tổng số lượng theo tờ khai)
  const hoaDon = await HoaDonNhap.findByPk(id_hd_nhap, {
    include: [{
      model: HoaDonNhapChiTiet,
      as: 'chiTiets',
      include: [{ model: NguyenPhuLieu, as: 'nguyenPhuLieu' }]
    }]
  });

  if (!hoaDon) throw new Error(`Không tìm thấy hóa đơn nhập ID=${id_hd_nhap}`);

  // 2. Lấy tổng số lượng đã nhập kho từ hóa đơn này
  const daNhapKho = await NhapKhoNPL.findAll({
    where: { id_hd_nhap },
    include: [{
      model: NhapKhoNPLChiTiet,
      as: 'chiTiets'
    }]
  });

  // 3. Tính tổng số lượng đã nhập cho từng NPL
  const tongDaNhap = {};
  daNhapKho.forEach(phieu => {
    (phieu.chiTiets || []).forEach(ct => {
      const id_npl = ct.id_npl;
      tongDaNhap[id_npl] = (tongDaNhap[id_npl] || 0) + parseFloat(ct.so_luong || 0);
    });
  });

  // 4. Tính số lượng có thể nhập = Tổng HĐ - Đã nhập
  const result = (hoaDon.chiTiets || []).map(ct => {
    const id_npl = ct.id_npl;
    const so_luong_hd = parseFloat(ct.so_luong || 0);
    const da_nhap = tongDaNhap[id_npl] || 0;
    const co_the_nhap = Math.max(0, so_luong_hd - da_nhap);

    return {
      id_npl,
      ten_npl: ct.nguyenPhuLieu?.ten_npl || 'N/A',
      so_luong_hd,
      da_nhap,
      co_the_nhap
    };
  });

  return result;
};

module.exports = {
  createNhapNPL, getAllNhapNPL, getNhapNPLById, updateNhapNPL, deleteNhapNPL,
  addChiTiet, getChiTietByPhieu, deleteChiTiet,
  getSoLuongCoTheNhap
};
