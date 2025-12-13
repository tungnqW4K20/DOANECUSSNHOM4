'use strict';
const toKhaiService = require('../services/to-khai.service');

const getToKhaiList = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const q = req.query.q || '';

    const data = await toKhaiService.getToKhaiList({ page, limit, q });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getToKhaiList };
