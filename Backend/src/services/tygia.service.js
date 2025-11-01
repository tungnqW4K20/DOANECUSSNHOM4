
'use strict';
const axios = require('axios');
const db = require('../models');

const updateTyGiaFromAPI = async () => {
  try {
 // 1️⃣ Gọi API
    const res = await axios.get('https://open.er-api.com/v6/latest/USD');
    if (res.data.result !== 'success') throw new Error('Không thể lấy dữ liệu tỷ giá từ API');

    const rates = res.data.rates;
    const today = new Date().toISOString().slice(0, 10);

    // 2️⃣ Lấy toàn bộ danh sách tiền tệ trong DB
    const currencies = await db.TienTe.findAll();
    const usdToVnd = rates.VND;
    if (!usdToVnd) throw new Error('API không trả về tỷ giá VND');

    let updatedList = [];

    // 3️⃣ Lặp qua từng đồng tiền trong DB
    for (const currency of currencies) {
      const { id_tt, ma_tt } = currency;

      // Bỏ qua nếu API không có đồng này
      if (!rates[ma_tt]) {
        console.log(`⚠️ Không tìm thấy tỷ giá cho ${ma_tt}`);
        continue;
      }

      // 4️⃣ Tính tỷ giá quy đổi sang VND
      const rateToVND = usdToVnd / rates[ma_tt];

      // 5️⃣ Kiểm tra và cập nhật/insert
      const existing = await db.TyGia.findOne({ where: { id_tt, ngay: today } });

      if (existing) {
        await existing.update({ ty_gia: rateToVND });
        console.log(`🔁 Cập nhật ${ma_tt} → VND = ${rateToVND.toFixed(2)}`);
      } else {
        await db.TyGia.create({ id_tt, ngay: today, ty_gia: rateToVND });
        console.log(`✅ Tạo mới ${ma_tt} → VND = ${rateToVND.toFixed(2)}`);
      }

      updatedList.push({ ma_tt, ty_gia: rateToVND });
    }

    return {
      success: true,
      date: today,
      updated: updatedList.length,
      data: updatedList
    };
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật tỷ giá:', err.message);
    throw err;
  }
};

module.exports = { updateTyGiaFromAPI };