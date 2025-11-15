'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDonNhap extends Model {
    static associate(models) {
      HoaDonNhap.belongsTo(models.LoHang, { foreignKey: 'id_lh', as: 'loHang' });
      HoaDonNhap.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
      HoaDonNhap.hasMany(models.HoaDonNhapChiTiet, { foreignKey: 'id_hd_nhap', as: 'chiTiets' });
    }
  }
  HoaDonNhap.init({
    id_hd_nhap: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lh: { type: DataTypes.INTEGER, allowNull: false },
    so_hd: { type: DataTypes.STRING(50), allowNull: false },
    ngay_hd: { type: DataTypes.DATEONLY, allowNull: false },
    id_tt: { type: DataTypes.INTEGER, allowNull: true },
    tong_tien: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    file_hoa_don: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'HoaDonNhap',
    tableName: 'HoaDonNhap',
    timestamps: false
  });
  return HoaDonNhap;
};
