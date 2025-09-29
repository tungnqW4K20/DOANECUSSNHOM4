'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ToKhaiNhap extends Model {
    static associate(models) {
      ToKhaiNhap.belongsTo(models.LoHang, { foreignKey: 'id_lh', as: 'loHang' });
      ToKhaiNhap.belongsTo(models.TienTe, { foreignKey: 'id_tt', as: 'tienTe' });
    }
  }
  ToKhaiNhap.init({
    id_tkn: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lh: { type: DataTypes.INTEGER, allowNull: false },
    so_tk: { type: DataTypes.STRING(50), allowNull: false },
    ngay_tk: { type: DataTypes.DATEONLY, allowNull: false },
    tong_tri_gia: { type: DataTypes.DECIMAL(18,2), allowNull: true },
    id_tt: { type: DataTypes.INTEGER, allowNull: true },
    file_to_khai: { type: DataTypes.STRING(255), allowNull: true },
    trang_thai: { type: DataTypes.ENUM('Chờ duyệt','Thông quan','Kiểm tra hồ sơ','Kiểm tra thực tế','Tái xuất','Tịch thu'), allowNull: false, defaultValue: 'Chờ duyệt' }
  }, {
    sequelize,
    modelName: 'ToKhaiNhap',
    tableName: 'ToKhaiNhap',
    timestamps: false
  });
  return ToKhaiNhap;
};
