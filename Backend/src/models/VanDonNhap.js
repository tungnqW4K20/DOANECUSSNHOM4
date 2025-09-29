'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VanDonNhap extends Model {
    static associate(models) {
      VanDonNhap.belongsTo(models.LoHang, { foreignKey: 'id_lh', as: 'loHang' });
    }
  }
  VanDonNhap.init({
    id_vd: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lh: { type: DataTypes.INTEGER, allowNull: false },
    so_vd: { type: DataTypes.STRING(50), allowNull: false },
    ngay_phat_hanh: { type: DataTypes.DATEONLY, allowNull: false },
    cang_xuat: { type: DataTypes.STRING(255), allowNull: true },
    cang_nhap: { type: DataTypes.STRING(255), allowNull: true },
    file_van_don: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'VanDonNhap',
    tableName: 'VanDonNhap',
    timestamps: false
  });
  return VanDonNhap;
};
