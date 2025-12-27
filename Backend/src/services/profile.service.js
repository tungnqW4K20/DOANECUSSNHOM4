'use strict';

const db = require('../models');
const DoanhNghiep = db.DoanhNghiep;

// Lấy thông tin profile doanh nghiệp
const getProfile = async (id_dn) => {
  try {
    const doanhNghiep = await DoanhNghiep.findByPk(id_dn, {
      attributes: { exclude: ['mat_khau'] } // Không trả về mật khẩu
    });

    if (!doanhNghiep) {
      throw new Error('Không tìm thấy thông tin doanh nghiệp');
    }

    return doanhNghiep;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin profile doanh nghiệp
const updateProfile = async (id_dn, updateData) => {
  try {
    const doanhNghiep = await DoanhNghiep.findByPk(id_dn);

    if (!doanhNghiep) {
      throw new Error('Không tìm thấy thông tin doanh nghiệp');
    }

    // Các trường được phép cập nhật
    const allowedFields = ['ten_dn', 'email', 'sdt', 'dia_chi', 'file_giay_phep'];
    
    // Lọc chỉ lấy các trường được phép
    const filteredData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    // Cập nhật
    await doanhNghiep.update(filteredData);

    // Lấy lại thông tin sau khi cập nhật (không bao gồm mật khẩu)
    const updatedDoanhNghiep = await DoanhNghiep.findByPk(id_dn, {
      attributes: { exclude: ['mat_khau'] }
    });

    return updatedDoanhNghiep;
  } catch (error) {
    throw error;
  }
};

// Đổi mật khẩu
const changePassword = async (id_dn, { mat_khau_cu, mat_khau_moi }) => {
  try {
    const doanhNghiep = await DoanhNghiep.findByPk(id_dn);

    if (!doanhNghiep) {
      throw new Error('Không tìm thấy thông tin doanh nghiệp');
    }

    // Kiểm tra mật khẩu cũ
    if (doanhNghiep.mat_khau !== mat_khau_cu) {
      throw new Error('Mật khẩu cũ không chính xác');
    }

    // Cập nhật mật khẩu mới
    await doanhNghiep.update({ mat_khau: mat_khau_moi });

    return { message: 'Đổi mật khẩu thành công' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
