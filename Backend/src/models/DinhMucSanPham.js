'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DinhMucSanPham extends Model {
    static associate(models) {
      DinhMucSanPham.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
      DinhMucSanPham.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
    }
  }
  DinhMucSanPham.init({
    id_dm: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    so_luong: { type: DataTypes.DECIMAL(18,2), allowNull: true }
  }, {
    sequelize,
    modelName: 'DinhMucSanPham',
    tableName: 'DinhMucSanPham',
    timestamps: false
  });
  return DinhMucSanPham;
};
