'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NhapKhoSP extends Model {
    static associate(models) {
      NhapKhoSP.belongsTo(models.Kho, { foreignKey: 'id_kho', as: 'kho' });
      NhapKhoSP.hasMany(models.NhapKhoSPChiTiet, { foreignKey: 'id_nhap', as: 'chiTiets' });
    }
  }

  NhapKhoSP.init({
    id_nhap: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_kho: { type: DataTypes.INTEGER, allowNull: false },
    ngay_nhap: { type: DataTypes.DATEONLY, allowNull: false },
    file_phieu: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    sequelize,
    modelName: 'NhapKhoSP',
    tableName: 'NhapKhoSP',
    timestamps: false
  });

  return NhapKhoSP;
};
