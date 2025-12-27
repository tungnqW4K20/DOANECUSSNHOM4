'use strict';

const quyDoiHelper = require('../utils/quyDoiHelper');

/**
 * API: Lấy danh sách quy đổi cho NPL
 * GET /api/quy-doi/npl/:id_npl
 */
exports.getQuyDoiListNPL = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const { id_npl } = req.params;

    if (!id_dn) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const list = await quyDoiHelper.getQuyDoiListNPL(id_dn, parseInt(id_npl));
    
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * API: Lấy danh sách quy đổi cho SP
 * GET /api/quy-doi/sp/:id_sp
 */
exports.getQuyDoiListSP = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const { id_sp } = req.params;

    if (!id_dn) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    const list = await quyDoiHelper.getQuyDoiListSP(id_dn, parseInt(id_sp));
    
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * API: Tính toán quy đổi NPL từ DN sang HQ
 * POST /api/quy-doi/npl/dn-to-hq
 * Body: { id_npl, ten_dvt_dn, so_luong_dn }
 */
exports.calculateNPL_DN_to_HQ = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const { id_npl, ten_dvt_dn, so_luong_dn } = req.body;

    if (!id_dn) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    if (!id_npl || !ten_dvt_dn || !so_luong_dn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu dữ liệu: id_npl, ten_dvt_dn, so_luong_dn' 
      });
    }

    const result = await quyDoiHelper.quyDoiNPL_DN_to_HQ(
      id_dn, 
      parseInt(id_npl), 
      ten_dvt_dn, 
      parseFloat(so_luong_dn)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * API: Tính toán quy đổi SP từ DN sang HQ
 * POST /api/quy-doi/sp/dn-to-hq
 * Body: { id_sp, ten_dvt_sp, so_luong_dn }
 */
exports.calculateSP_DN_to_HQ = async (req, res) => {
  try {
    const id_dn = req.user?.id;
    const { id_sp, ten_dvt_sp, so_luong_dn } = req.body;

    if (!id_dn) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin xác thực' });
    }

    if (!id_sp || !ten_dvt_sp || !so_luong_dn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu dữ liệu: id_sp, ten_dvt_sp, so_luong_dn' 
      });
    }

    const result = await quyDoiHelper.quyDoiSP_DN_to_HQ(
      id_dn, 
      parseInt(id_sp), 
      ten_dvt_sp, 
      parseFloat(so_luong_dn)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * API: Tính toán quy đổi NPL từ HQ sang DN
 * POST /api/quy-doi/npl/hq-to-dn
 * Body: { id_qd, so_luong_hq }
 */
exports.calculateNPL_HQ_to_DN = async (req, res) => {
  try {
    const { id_qd, so_luong_hq } = req.body;

    if (!id_qd || !so_luong_hq) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu dữ liệu: id_qd, so_luong_hq' 
      });
    }

    const result = await quyDoiHelper.quyDoiNPL_HQ_to_DN(
      parseInt(id_qd), 
      parseFloat(so_luong_hq)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * API: Tính toán quy đổi SP từ HQ sang DN
 * POST /api/quy-doi/sp/hq-to-dn
 * Body: { id_qd, so_luong_hq }
 */
exports.calculateSP_HQ_to_DN = async (req, res) => {
  try {
    const { id_qd, so_luong_hq } = req.body;

    if (!id_qd || !so_luong_hq) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu dữ liệu: id_qd, so_luong_hq' 
      });
    }

    const result = await quyDoiHelper.quyDoiSP_HQ_to_DN(
      parseInt(id_qd), 
      parseFloat(so_luong_hq)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
