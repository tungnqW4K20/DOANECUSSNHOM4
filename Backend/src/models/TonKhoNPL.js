'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TonKhoNPL extends Model {
    static associate(models) {
      TonKhoNPL.belongsTo(models.Kho, { foreignKey: 'id_kho', as: 'kho' });
      TonKhoNPL.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
    }
  }

  TonKhoNPL.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_kho: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    so_luong_ton: { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0.0 }
  }, {
    sequelize,
    modelName: 'TonKhoNPL',
    tableName: 'TonKhoNPL',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_kho', 'id_npl']
      }
    ]
  });

  return TonKhoNPL;
};
