'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DonViTinhHQ extends Model {
    static associate(models) {
      DonViTinhHQ.hasMany(models.SanPham, { foreignKey: 'id_dvt_hq', as: 'sanPhams' });
      DonViTinhHQ.hasMany(models.NguyenPhuLieu, { foreignKey: 'id_dvt_hq', as: 'nguyenPhuLieus' });
      DonViTinhHQ.hasMany(models.QuyDoiDonViDN, { foreignKey: 'id_dvt_hq', as: 'quyDoiDonVis' });
      DonViTinhHQ.hasMany(models.QuyDoiDonViSP, { foreignKey: 'id_dvt_hq', as: 'quyDoiDonViSPs' });
    }
  }
  
  DonViTinhHQ.init({
    id_dvt_hq: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_dvt: { type: DataTypes.STRING(50), allowNull: false },
    mo_ta: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'DonViTinhHQ',
    tableName: 'DonViTinhHQ',
    timestamps: false
  });
  return DonViTinhHQ;
};

