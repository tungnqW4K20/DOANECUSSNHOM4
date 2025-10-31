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
    thoi_gian_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tong_npl_nhap: {
      type: DataTypes.DECIMAL(18,3)
    },
    tong_npl_su_dung: {
      type: DataTypes.DECIMAL(18,3)
    },
    tong_npl_ton: {
      type: DataTypes.DECIMAL(18,3)
    },
    tong_sp_xuat: {
      type: DataTypes.DECIMAL(18,3)
    },
    ket_luan: {
      type: DataTypes.ENUM('HopLe','ThieuSP','DuNPL','ViPham'),
      defaultValue: 'HopLe'
    },
    file_bao_cao: {
      type: DataTypes.STRING
    },
    trang_thai: {
      type: DataTypes.ENUM('HopLe','TamKhoa','Huy'),
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
