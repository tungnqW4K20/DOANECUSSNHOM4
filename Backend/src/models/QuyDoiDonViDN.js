'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuyDoiDonViDN extends Model {
    static associate(models) {
      QuyDoiDonViDN.belongsTo(models.DoanhNghiep, { foreignKey: 'id_dn', as: 'doanhNghiep' });
      QuyDoiDonViDN.belongsTo(models.DonViTinhHQ, { foreignKey: 'id_dvt_hq', as: 'donViTinhHQ' });
      // id_mat_hang is free-text reference to product id (not FK in SQL)
    }
  }
  QuyDoiDonViDN.init({
    id_qd: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dn: { type: DataTypes.INTEGER, allowNull: false },
    id_mat_hang: { type: DataTypes.INTEGER, allowNull: false },
    ten_dvt_dn: { type: DataTypes.STRING(50), allowNull: false },
    id_dvt_hq: { type: DataTypes.INTEGER, allowNull: false },
    he_so: { type: DataTypes.DECIMAL(18,6), allowNull: false }
  }, {
    sequelize,
    modelName: 'QuyDoiDonViDN',
    tableName: 'QuyDoiDonViDN',
    timestamps: false
  });
  return QuyDoiDonViDN;
};
