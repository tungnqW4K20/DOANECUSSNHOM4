'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class XuatKhoSP extends Model {
    static associate(models) {
      XuatKhoSP.belongsTo(models.Kho, { foreignKey: 'id_kho', as: 'kho' });
      XuatKhoSP.belongsTo(models.HoaDonXuat, { foreignKey: 'id_hd_xuat', as: 'hoaDonXuat' });
      XuatKhoSP.hasMany(models.XuatKhoSPChiTiet, { foreignKey: 'id_xuat', as: 'chiTiets' });
    }
  }

  XuatKhoSP.init({
    id_xuat: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_kho: { type: DataTypes.INTEGER, allowNull: false },
    id_hd_xuat: { type: DataTypes.INTEGER, allowNull: true },
    ngay_xuat: { type: DataTypes.DATEONLY, allowNull: false },
    file_phieu: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'XuatKhoSP',
    tableName: 'XuatKhoSP',
    timestamps: false
  });

  return XuatKhoSP;
};
