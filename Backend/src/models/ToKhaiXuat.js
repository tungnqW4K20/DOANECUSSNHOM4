'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ToKhaiXuat extends Model {
    static associate(models) {
      ToKhaiXuat.belongsTo(models.LoHang, { foreignKey: 'id_lh', as: 'loHang' });
      ToKhaiXuat.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
    }
  }
  ToKhaiXuat.init({
    id_tkx: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lh: { type: DataTypes.INTEGER, allowNull: false },
    so_tk: { type: DataTypes.STRING(50), allowNull: false },
    ngay_tk: { type: DataTypes.DATEONLY, allowNull: false },
    tong_tri_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    id_tt: { type: DataTypes.INTEGER, allowNull: true },
    file_to_khai: { type: DataTypes.STRING(255), allowNull: true },
    trang_thai: { type: DataTypes.ENUM('Chờ duyệt','Thông quan','Kiểm tra hồ sơ','Kiểm tra thực tế','Tịch thu'), allowNull: false, defaultValue: 'Chờ duyệt' }
  }, {
    sequelize,
    modelName: 'ToKhaiXuat',
    tableName: 'ToKhaiXuat',
    timestamps: false
  });
  return ToKhaiXuat;
};
