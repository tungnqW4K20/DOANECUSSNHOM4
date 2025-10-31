'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhapKhoSPChiTiet extends Model {
    static associate(models) {
      NhapKhoSPChiTiet.belongsTo(models.NhapKhoSP, { foreignKey: 'id_nhap', as: 'phieuNhap' });
      NhapKhoSPChiTiet.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
    }
  }

  NhapKhoSPChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_nhap: { type: DataTypes.INTEGER, allowNull: false },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'NhapKhoSPChiTiet',
    tableName: 'NhapKhoSPChiTiet',
    timestamps: false
  });

  return NhapKhoSPChiTiet;
};
