'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class XuatKhoSPChiTiet extends Model {
    static associate(models) {
      XuatKhoSPChiTiet.belongsTo(models.XuatKhoSP, { foreignKey: 'id_xuat', as: 'phieuXuat' });
      XuatKhoSPChiTiet.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
    }
  }

  XuatKhoSPChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_xuat: { type: DataTypes.INTEGER, allowNull: false },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'XuatKhoSPChiTiet',
    tableName: 'XuatKhoSPChiTiet',
    timestamps: false
  });

  return XuatKhoSPChiTiet;
};
