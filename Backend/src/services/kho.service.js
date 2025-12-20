'use strict';
const db = require('../models');
const Kho = db.Kho;
const DoanhNghiep = db.DoanhNghiep;

const createKho = async ({ id_dn, ten_kho, dia_chi }) => {
  if (!id_dn || !ten_kho) throw new Error("Thiếu dữ liệu bắt buộc");
  return await Kho.create({ id_dn, ten_kho, dia_chi });
};

const getAllKho = async (id_dn) => {
  return await Kho.findAll({  where: { id_dn }, include: [{ model: DoanhNghiep, as: 'doanhNghiep' }] });
};

const getKhoById = async (id_kho) => {
  return await Kho.findByPk(id_kho, { include: [{ model: DoanhNghiep, as: 'doanhNghiep' }] });
};

const updateKho = async (id_kho, data) => {
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error("Không tìm thấy kho");
  await kho.update(data);
  return kho;
};

const deleteKho = async (id_kho) => {
  const kho = await Kho.findByPk(id_kho);
  if (!kho) throw new Error("Không tìm thấy kho");
  await kho.destroy();
};

module.exports = { createKho, getAllKho, getKhoById, updateKho, deleteKho };
