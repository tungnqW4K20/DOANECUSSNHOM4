'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HopDong extends Model {
    static associate(models) {
      HopDong.belongsTo(models.DoanhNghiep, { foreignKey: 'id_dn', as: 'doanhNghiep' });
      HopDong.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
      HopDong.hasMany(models.LoHang, { foreignKey: 'id_hd', as: 'loHangs' });
    }
  }
  HopDong.init({
    id_hd: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dn: { type: DataTypes.INTEGER, allowNull: false },
    so_hd: { type: DataTypes.STRING(50), allowNull: false },
    ngay_ky: { type: DataTypes.DATEONLY, allowNull: false },
    ngay_hieu_luc: { type: DataTypes.DATEONLY, allowNull: true },
    ngay_het_han: { type: DataTypes.DATEONLY, allowNull: true },
    gia_tri: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    id_tt: { type: DataTypes.INTEGER, allowNull: true },
    file_hop_dong: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'HopDong',
    tableName: 'HopDong',
    timestamps: false
  });
  return HopDong;
};
