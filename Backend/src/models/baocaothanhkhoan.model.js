'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BaoCaoThanhKhoan extends Model {
    static associate(models) {
      BaoCaoThanhKhoan.belongsTo(models.HopDong, { foreignKey: 'id_hd', as: 'hopdong' });
    }
  }

  BaoCaoThanhKhoan.init({
    id_bc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_hd: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tu_ngay: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Kỳ báo cáo: Từ ngày'
    },
    den_ngay: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Kỳ báo cáo: Đến ngày'
    },
    thoi_gian_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ket_luan_tong_the: {
      type: DataTypes.ENUM('HopLe', 'CanhBao', 'ViPham'),
      defaultValue: 'HopLe'
    },
    data_snapshot: {
      type: DataTypes.JSON,
      comment: 'Lưu toàn bộ dữ liệu JSON của 3 mẫu báo cáo'
    },
    file_bao_cao: {
      type: DataTypes.STRING(255)
    },
    trang_thai: {
      type: DataTypes.ENUM('HopLe', 'TamKhoa', 'Huy'),
      defaultValue: 'HopLe'
    }
  }, {
    sequelize,
    modelName: 'BaoCaoThanhKhoan',
    tableName: 'BaoCaoThanhKhoan',
    timestamps: false
  });

  return BaoCaoThanhKhoan;
};
