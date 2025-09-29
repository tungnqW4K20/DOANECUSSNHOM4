'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDonNhapChiTiet extends Model {
    static associate(models) {
      HoaDonNhapChiTiet.belongsTo(models.HoaDonNhap, { foreignKey: 'id_hd_nhap', as: 'hoaDonNhap' });
      HoaDonNhapChiTiet.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
    }
  }
  HoaDonNhapChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_hd_nhap: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    don_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    tri_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true }
  }, {
    sequelize,
    modelName: 'HoaDonNhapChiTiet',
    tableName: 'HoaDonNhapChiTiet',
    timestamps: false
  });
  return HoaDonNhapChiTiet;
};
