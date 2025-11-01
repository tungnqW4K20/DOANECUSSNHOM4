'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TyGia extends Model {
    static associate(models) {
      TyGia.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
    }
  }
  
  TyGia.init({
    id_tg: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_tt: { type: DataTypes.INTEGER, allowNull: false },
    ngay: { type: DataTypes.DATEONLY, allowNull: false },
    ty_gia: { type: DataTypes.DECIMAL(18,6), allowNull: false },
  }, {
    sequelize,
    modelName: 'TyGia',
    tableName: 'TyGia',
    timestamps: false,
  });

  return TyGia;
};
