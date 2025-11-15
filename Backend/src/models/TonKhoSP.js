'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TonKhoSP extends Model {
    static associate(models) {
      TonKhoSP.belongsTo(models.Kho, { foreignKey: 'id_kho', as: 'kho' });
      TonKhoSP.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
    }
  }

  TonKhoSP.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_kho: { type: DataTypes.INTEGER, allowNull: false },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    so_luong_ton: { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0.0 }
  }, {
    sequelize,
    modelName: 'TonKhoSP',
    tableName: 'TonKhoSP',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_kho', 'id_sp']
      }
    ]
  });

  return TonKhoSP;
};
