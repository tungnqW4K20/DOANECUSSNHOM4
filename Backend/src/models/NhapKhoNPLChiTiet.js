'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhapKhoNPLChiTiet extends Model {
    static associate(models) {
      NhapKhoNPLChiTiet.belongsTo(models.NhapKhoNPL, { foreignKey: 'id_nhap', as: 'phieuNhap' });
      NhapKhoNPLChiTiet.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
    }
  }

  NhapKhoNPLChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_nhap: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'NhapKhoNPLChiTiet',
    tableName: 'NhapKhoNPLChiTiet',
    timestamps: false
  });

  return NhapKhoNPLChiTiet;
};
