'use strict';

// ✅ 1. Import thư viện node-cron (để chạy lịch tự động)
const cron = require('node-cron');

// ✅ 2. Import service có chứa logic update tỷ giá
const tygiaService = require('../services/tygia.service');

// ✅ 3. (Tuỳ chọn) Import moment nếu muốn format thời gian đẹp hơn
// const moment = require('moment');

function scheduleTyGiaUpdate() {
  // 🕗 Cron chạy mỗi ngày vào lúc 8:00 sáng
  // Cấu trúc cron: (phút giờ ngày-tháng tháng ngày-trong-tuần)
  // => '0 8 * * *' nghĩa là “lúc 08:00 mỗi ngày”
  cron.schedule('* 1 * * *', async () => {
    console.log('⏰ [Cron] Đang tự động cập nhật tỷ giá...');

    try {
      const result = await tygiaService.updateTyGiaFromAPI();

      console.log(`✅ [Cron] Đã cập nhật ${result.updated} loại tiền ngày ${result.date}`);
    } catch (err) {
      console.error('❌ [Cron] Lỗi khi cập nhật tỷ giá:', err.message);
    }
  });

  console.log('🚀 Cron job tỷ giá đã khởi động (sẽ chạy tự động lúc 8:00 sáng mỗi ngày)');
}

module.exports = scheduleTyGiaUpdate;