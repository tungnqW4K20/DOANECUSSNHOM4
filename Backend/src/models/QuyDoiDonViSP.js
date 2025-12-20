'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuyDoiDonViSP extends Model {
    static associate(models) {
      QuyDoiDonViSP.belongsTo(models.DoanhNghiep, { foreignKey: 'id_dn', as: 'doanhNghiep' });
      QuyDoiDonViSP.belongsTo(models.SanPham, { foreignKey: 'id_sp', as: 'sanPham' });
      QuyDoiDonViSP.belongsTo(models.DonViTinhHQ, { foreignKey: 'id_dvt_hq', as: 'donViTinhHQ' });
    }
  }
  QuyDoiDonViSP.init({
    id_qd: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dn: { type: DataTypes.INTEGER, allowNull: false },
    id_sp: { type: DataTypes.INTEGER, allowNull: false },
    ten_dvt_sp: { type: DataTypes.STRING(50), allowNull: false },
    id_dvt_hq: { type: DataTypes.INTEGER, allowNull: false },
    he_so: { type: DataTypes.DECIMAL(18,6), allowNull: false }
  }, {
    sequelize,
    modelName: 'QuyDoiDonViSP',
    tableName: 'QuyDoiDonViSP',
    timestamps: false
  });
  return QuyDoiDonViSP;
};
