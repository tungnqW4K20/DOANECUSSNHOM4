'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuyDoiNPL extends Model {
    static associate(models) {
      QuyDoiNPL.belongsTo(models.DoanhNghiep, { foreignKey: 'id_dn', as: 'doanhNghiep' });
      QuyDoiNPL.belongsTo(models.NguyenPhuLieu, { foreignKey: 'id_npl', as: 'nguyenPhuLieu' });
      QuyDoiNPL.belongsTo(models.DonViTinhHQ, { foreignKey: 'id_dvt_hq', as: 'donViTinhHQ' });
    }
  }

  QuyDoiNPL.init({
    id_qd: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_dn: { type: DataTypes.INTEGER, allowNull: false },
    id_npl: { type: DataTypes.INTEGER, allowNull: false },
    ten_dvt_dn: { type: DataTypes.STRING(50), allowNull: false },
    id_dvt_hq: { type: DataTypes.INTEGER, allowNull: false },
    he_so: { type: DataTypes.DECIMAL(18, 6), allowNull: false }
  }, {
    sequelize,
    modelName: 'QuyDoiNPL',
    tableName: 'QuyDoiNPL',
    timestamps: false
  });

  return QuyDoiNPL;
};
