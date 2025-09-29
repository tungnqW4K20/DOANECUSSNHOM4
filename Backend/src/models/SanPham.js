'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SanPham extends Model {
    static associate(models) {
      SanPham.belongsTo(models.DonViTinhHQ, { foreignKey: 'id_dvt_hq', as: 'donViTinhHQ' });
      SanPham.hasMany(models.DinhMucSanPham, { foreignKey: 'id_sp', as: 'dinhMucs' });
      SanPham.hasMany(models.QuyDoiDonViSP, { foreignKey: 'id_sp', as: 'quyDoiDonViSPs' });
      SanPham.hasMany(models.HoaDonXuatChiTiet, { foreignKey: 'id_sp', as: 'hoaDonXuatChiTiets' });
    }
  }
  SanPham.init({
    id_sp: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING(255), allowNull: false },
    mo_ta: { type: DataTypes.TEXT, allowNull: true },
    id_dvt_hq: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'SanPham',
    tableName: 'SanPham',
    timestamps: false
  });
  return SanPham;
};
