'use strict';

const db = require('../models');
const { QueryTypes } = require('sequelize');

/**
 * API 5 – Lấy danh sách Tờ khai Nhập + Xuất
 */
const getToKhaiList = async ({ page, limit, q }) => {
  const offset = (page - 1) * limit;
  const replacements = [];

  // ===== SQL UNION ALL gốc =====
  let baseSql = `
    SELECT 
      tkn.id_tkn AS id,
      tkn.so_tk,
      dn.ten_dn,
      tkn.ngay_tk,
      tkn.tong_tri_gia,
      'Nhập' AS loai_tk,
      tkn.trang_thai
    FROM ToKhaiNhap tkn
    JOIN LoHang lh ON tkn.id_lh = lh.id_lh
    JOIN HopDong hd ON lh.id_hd = hd.id_hd
    JOIN DoanhNghiep dn ON hd.id_dn = dn.id_dn

    UNION ALL

    SELECT 
      tkx.id_tkx AS id,
      tkx.so_tk,
      dn.ten_dn,
      tkx.ngay_tk,
      tkx.tong_tri_gia,
      'Xuất' AS loai_tk,
      tkx.trang_thai
    FROM ToKhaiXuat tkx
    JOIN LoHang lh ON tkx.id_lh = lh.id_lh
    JOIN HopDong hd ON lh.id_hd = hd.id_hd
    JOIN DoanhNghiep dn ON hd.id_dn = dn.id_dn
  `;

  // ===== Tìm kiếm =====
  if (q) {
    baseSql = `
      SELECT * FROM (${baseSql}) t
      WHERE t.so_tk LIKE ?
         OR t.ten_dn LIKE ?
    `;
    replacements.push(`%${q}%`, `%${q}%`);
  }

  // ===== Query data =====
  const dataSql = `
    ${baseSql}
    ORDER BY ngay_tk DESC
    LIMIT ? OFFSET ?
  `;
  replacements.push(limit, offset);

  const data = await db.sequelize.query(dataSql, {
    replacements,
    type: QueryTypes.SELECT
  });

  // ===== Query count =====
  const countSql = `
    SELECT COUNT(*) AS total
    FROM (${baseSql}) c
  `;

  const countResult = await db.sequelize.query(countSql, {
    replacements: q ? [`%${q}%`, `%${q}%`] : [],
    type: QueryTypes.SELECT
  });

  const total = Number(countResult[0]?.total || 0);

  return {
    data,
    pagination: {
      total,
      page,
      limit
    }
  };
};

module.exports = { getToKhaiList };
