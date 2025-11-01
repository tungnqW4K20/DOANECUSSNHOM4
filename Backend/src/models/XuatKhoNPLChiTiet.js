'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class XuatKhoNPLChiTiet extends Model {
    static associate(models) {
      XuatKhoNPLChiTiet.belongsTo(models.XuatKhoNPL, { foreignKey: 'id_xuat', as: 'phieuXuat' });
      XuatKhoNPLChiTiet.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
    }
  }

  XuatKhoNPLChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_xuat: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'XuatKhoNPLChiTiet',
    tableName: 'XuatKhoNPLChiTiet',
    timestamps: false
  });

  return XuatKhoNPLChiTiet;
};
