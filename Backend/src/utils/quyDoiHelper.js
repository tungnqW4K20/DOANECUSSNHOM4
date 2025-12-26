'use strict';

const db = require('../models');
const QuyDoiNPL = db.QuyDoiNPL;
const QuyDoiDonViSP = db.QuyDoiDonViSP;

/**
 * Tính toán quy đổi từ đơn vị DN sang đơn vị HQ cho NPL
 * @param {number} id_dn - ID doanh nghiệp
 * @param {number} id_npl - ID nguyên phụ liệu
 * @param {string} ten_dvt_dn - Tên đơn vị tính DN (VD: "Thùng", "Cây")
 * @param {number} so_luong_dn - Số lượng theo đơn vị DN
 * @returns {Promise<{so_luong_hq: number, id_dvt_hq: number, ten_dvt_hq: string, he_so: number, id_qd: number}>}
 */
const quyDoiNPL_DN_to_HQ = async (id_dn, id_npl, ten_dvt_dn, so_luong_dn) => {
  try {
    // Tìm quy đổi phù hợp
    const quyDoi = await QuyDoiNPL.findOne({
      where: {
        id_dn,
        id_npl,
        ten_dvt_dn: ten_dvt_dn.trim()
      },
      include: [
        { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
      ]
    });

    if (!quyDoi) {
      throw new Error(`Không tìm thấy quy đổi cho NPL ID=${id_npl}, ĐVT DN="${ten_dvt_dn}"`);
    }

    // Tính toán: số lượng HQ = số lượng DN × hệ số
    const so_luong_hq = parseFloat(so_luong_dn) * parseFloat(quyDoi.he_so);

    return {
      so_luong_hq: so_luong_hq,
      id_dvt_hq: quyDoi.id_dvt_hq,
      ten_dvt_hq: quyDoi.donViTinhHQ?.ten_dvt || '',
      he_so: parseFloat(quyDoi.he_so),
      id_qd: quyDoi.id_qd
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Tính toán quy đổi từ đơn vị HQ sang đơn vị DN cho NPL
 * @param {number} id_qd - ID quy đổi
 * @param {number} so_luong_hq - Số lượng theo đơn vị HQ
 * @returns {Promise<{so_luong_dn: number, ten_dvt_dn: string, he_so: number}>}
 */
const quyDoiNPL_HQ_to_DN = async (id_qd, so_luong_hq) => {
  try {
    const quyDoi = await QuyDoiNPL.findByPk(id_qd);
    
    if (!quyDoi) {
      throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
    }

    // Tính toán: số lượng DN = số lượng HQ ÷ hệ số
    const so_luong_dn = parseFloat(so_luong_hq) / parseFloat(quyDoi.he_so);

    return {
      so_luong_dn: so_luong_dn,
      ten_dvt_dn: quyDoi.ten_dvt_dn,
      he_so: parseFloat(quyDoi.he_so)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Tính toán quy đổi từ đơn vị DN sang đơn vị HQ cho SP
 * @param {number} id_dn - ID doanh nghiệp
 * @param {number} id_sp - ID sản phẩm
 * @param {string} ten_dvt_sp - Tên đơn vị tính DN (VD: "Thùng", "Hộp")
 * @param {number} so_luong_dn - Số lượng theo đơn vị DN
 * @returns {Promise<{so_luong_hq: number, id_dvt_hq: number, ten_dvt_hq: string, he_so: number, id_qd: number}>}
 */
const quyDoiSP_DN_to_HQ = async (id_dn, id_sp, ten_dvt_sp, so_luong_dn) => {
  try {
    // Tìm quy đổi phù hợp
    const quyDoi = await QuyDoiDonViSP.findOne({
      where: {
        id_dn,
        id_sp,
        ten_dvt_sp: ten_dvt_sp.trim()
      },
      include: [
        { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
      ]
    });

    if (!quyDoi) {
      throw new Error(`Không tìm thấy quy đổi cho SP ID=${id_sp}, ĐVT DN="${ten_dvt_sp}"`);
    }

    // Tính toán: số lượng HQ = số lượng DN × hệ số
    const so_luong_hq = parseFloat(so_luong_dn) * parseFloat(quyDoi.he_so);

    return {
      so_luong_hq: so_luong_hq,
      id_dvt_hq: quyDoi.id_dvt_hq,
      ten_dvt_hq: quyDoi.donViTinhHQ?.ten_dvt || '',
      he_so: parseFloat(quyDoi.he_so),
      id_qd: quyDoi.id_qd
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Tính toán quy đổi từ đơn vị HQ sang đơn vị DN cho SP
 * @param {number} id_qd - ID quy đổi
 * @param {number} so_luong_hq - Số lượng theo đơn vị HQ
 * @returns {Promise<{so_luong_dn: number, ten_dvt_sp: string, he_so: number}>}
 */
const quyDoiSP_HQ_to_DN = async (id_qd, so_luong_hq) => {
  try {
    const quyDoi = await QuyDoiDonViSP.findByPk(id_qd);
    
    if (!quyDoi) {
      throw new Error(`Không tìm thấy quy đổi ID=${id_qd}`);
    }

    // Tính toán: số lượng DN = số lượng HQ ÷ hệ số
    const so_luong_dn = parseFloat(so_luong_hq) / parseFloat(quyDoi.he_so);

    return {
      so_luong_dn: so_luong_dn,
      ten_dvt_sp: quyDoi.ten_dvt_sp,
      he_so: parseFloat(quyDoi.he_so)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách quy đổi cho NPL theo doanh nghiệp
 * @param {number} id_dn - ID doanh nghiệp
 * @param {number} id_npl - ID nguyên phụ liệu
 * @returns {Promise<Array>}
 */
const getQuyDoiListNPL = async (id_dn, id_npl) => {
  try {
    const list = await QuyDoiNPL.findAll({
      where: { id_dn, id_npl },
      include: [
        { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
      ]
    });

    return list.map(item => ({
      id_qd: item.id_qd,
      ten_dvt_dn: item.ten_dvt_dn,
      ten_dvt_hq: item.donViTinhHQ?.ten_dvt || '',
      id_dvt_hq: item.id_dvt_hq,
      he_so: parseFloat(item.he_so)
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách quy đổi cho SP theo doanh nghiệp
 * @param {number} id_dn - ID doanh nghiệp
 * @param {number} id_sp - ID sản phẩm
 * @returns {Promise<Array>}
 */
const getQuyDoiListSP = async (id_dn, id_sp) => {
  try {
    const list = await QuyDoiDonViSP.findAll({
      where: { id_dn, id_sp },
      include: [
        { model: db.DonViTinhHQ, as: 'donViTinhHQ' }
      ]
    });

    return list.map(item => ({
      id_qd: item.id_qd,
      ten_dvt_sp: item.ten_dvt_sp,
      ten_dvt_hq: item.donViTinhHQ?.ten_dvt || '',
      id_dvt_hq: item.id_dvt_hq,
      he_so: parseFloat(item.he_so)
    }));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  quyDoiNPL_DN_to_HQ,
  quyDoiNPL_HQ_to_DN,
  quyDoiSP_DN_to_HQ,
  quyDoiSP_HQ_to_DN,
  getQuyDoiListNPL,
  getQuyDoiListSP
};
