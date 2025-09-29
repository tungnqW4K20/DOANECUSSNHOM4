'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TienTe extends Model {
    static associate(models) {
      TienTe.hasMany(models.TyGia, { foreignKey: 'id_tt', as: 'tyGias' });
      TienTe.hasMany(models.HopDong, { foreignKey: 'id_tt', as: 'hopDongs' });
      TienTe.hasMany(models.HoaDonNhap, { foreignKey: 'id_tt', as: 'hoaDonNhaps' });
      TienTe.hasMany(models.HoaDonXuat, { foreignKey: 'id_tt', as: 'hoaDonXuats' });
      TienTe.hasMany(models.ToKhaiNhap, { foreignKey: 'id_tt', as: 'toKhaiNhaps' });
      TienTe.hasMany(models.ToKhaiXuat, { foreignKey: 'id_tt', as: 'toKhaiXuats' });
    }
  }
  TienTe.init({
    id_tt: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ma_tt: { type: DataTypes.STRING(10), unique: true, allowNull: false },
    ten_tt: { type: DataTypes.STRING(50), allowNull: false },
  }, {
    sequelize,
    modelName: 'TienTe',
    tableName: 'TienTe',
    timestamps: false,
  });
  return TienTe;
};
