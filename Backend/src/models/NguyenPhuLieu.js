'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguyenPhuLieu extends Model {
    static associate(models) {
      NguyenPhuLieu.belongsTo(models.DonViTinhHQ, { foreignKey: 'id_dvt_hq', as: 'donViTinhHQ' });
      NguyenPhuLieu.hasMany(models.DinhMucSanPham, { foreignKey: 'id_npl', as: 'dinhMucSanPhams' });
      NguyenPhuLieu.hasMany(models.HoaDonNhapChiTiet, { foreignKey: 'id_npl', as: 'hoaDonNhapChiTiets' });
      NguyenPhuLieu.hasMany(models.TonKhoNPL, { foreignKey: 'id_npl', as: 'tonKhoNPLs' });
NguyenPhuLieu.hasMany(models.QuyDoiNPL, { foreignKey: 'id_npl', as: 'quyDoiNPLs' });

    }
  }
  NguyenPhuLieu.init({
    id_npl: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_npl: { type: DataTypes.STRING(255), allowNull: false },
    mo_ta: { type: DataTypes.TEXT, allowNull: true },
    id_dvt_hq: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'NguyenPhuLieu',
    tableName: 'NguyenPhuLieu',
    timestamps: false
  });
  return NguyenPhuLieu;
};


