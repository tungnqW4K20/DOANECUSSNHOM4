'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HaiQuan extends Model {
    static associate(models) {}
  }
  HaiQuan.init({
    id_hq: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ten_hq: { type: DataTypes.STRING(255), allowNull: false },
    email: DataTypes.STRING(100),
    sdt: DataTypes.STRING(20),
    tai_khoan: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    mat_khau: { type: DataTypes.STRING(255), allowNull: false },
  }, {
    sequelize,
    modelName: 'HaiQuan',
    tableName: 'HaiQuan',
    timestamps: false,
  });
  return HaiQuan;
};


