'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDonXuatChiTiet extends Model {
    static associate(models) {
      HoaDonXuatChiTiet.belongsTo(models.HoaDonXuat, { foreignKey: 'id_hd_xuat', as: 'hoaDonXuat' });
      HoaDonXuatChiTiet.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
    }
  }
  HoaDonXuatChiTiet.init({
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_hd_xuat: { type: DataTypes.INTEGER, allowNull: false },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    don_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    tri_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true }
  }, {
    sequelize,
    modelName: 'HoaDonXuatChiTiet',
    tableName: 'HoaDonXuatChiTiet',
    timestamps: false
  });
  return HoaDonXuatChiTiet;
};
