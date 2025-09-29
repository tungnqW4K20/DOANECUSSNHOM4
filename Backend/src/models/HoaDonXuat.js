'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDonXuat extends Model {
    static associate(models) {
      HoaDonXuat.belongsTo(models.LoHang, { foreignKey: 'id_lh', as: 'loHang' });
      HoaDonXuat.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
      HoaDonXuat.hasMany(models.HoaDonXuatChiTiet, { foreignKey: 'id_hd_xuat', as: 'chiTiets' });
    }
  }
  HoaDonXuat.init({
    id_hd_xuat: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lh: { type: DataTypes.INTEGER, allowNull: false },
    so_hd: { type: DataTypes.STRING(50), allowNull: false },
    ngay_hd: { type: DataTypes.DATEONLY, allowNull: false },
    id_tt: { type: DataTypes.INTEGER, allowNull: true },
    tong_tien: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    file_hoa_don: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'HoaDonXuat',
    tableName: 'HoaDonXuat',
    timestamps: false
  });
  return HoaDonXuat;
};
