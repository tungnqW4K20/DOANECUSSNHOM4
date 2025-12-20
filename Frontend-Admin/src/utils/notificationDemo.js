/**
 * Demo và test notification system
 * Sử dụng trong console: window.testNotifications()
 */

import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showApproveSuccess,
  showRejectSuccess,
} from '../components/notification/Notification';

/**
 * Test tất cả các loại thông báo
 */
export const testAllNotifications = () => {
  console.log('🔔 Testing all notification types...');

  setTimeout(() => showSuccess('Thành công', 'Thao tác đã được thực hiện thành công'), 0);
  setTimeout(() => showError('Lỗi', 'Đã xảy ra lỗi khi xử lý yêu cầu'), 500);
  setTimeout(() => showWarning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin'), 1000);
  setTimeout(() => showInfo('Thông tin', 'Hệ thống sẽ bảo trì vào 2h sáng'), 1500);
};

/**
 * Test các helper functions
 */
export const testHelperFunctions = () => {
  console.log('🔔 Testing helper functions...');

  setTimeout(() => showCreateSuccess('Doanh nghiệp ABC'), 0);
  setTimeout(() => showUpdateSuccess('Thông tin tài khoản'), 500);
  setTimeout(() => showDeleteSuccess('Đơn vị tính USD'), 1000);
  setTimeout(() => showApproveSuccess('Công ty XYZ'), 1500);
  setTimeout(() => showRejectSuccess('Công ty DEF'), 2000);
};

/**
 * Test spam notifications (stress test)
 */
export const testSpamNotifications = () => {
  console.log('🔔 Spam test - Creating 20 notifications...');

  for (let i = 1; i <= 20; i++) {
    setTimeout(() => {
      const types = ['success', 'error', 'warning', 'info'];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = {
        success: 'Thành công',
        error: 'Lỗi',
        warning: 'Cảnh báo',
        info: 'Thông tin',
      };
      
      if (type === 'success') showSuccess(messages[type], `Thông báo số ${i}`);
      else if (type === 'error') showError(messages[type], `Thông báo số ${i}`);
      else if (type === 'warning') showWarning(messages[type], `Thông báo số ${i}`);
      else showInfo(messages[type], `Thông báo số ${i}`);
    }, i * 200);
  }
};

/**
 * Test realistic scenario
 */
export const testRealisticScenario = () => {
  console.log('🔔 Testing realistic scenario...');

  setTimeout(() => showInfo('Đang tải', 'Đang tải dữ liệu doanh nghiệp...'), 0);
  setTimeout(() => showSuccess('Tải thành công', 'Đã tải 150 doanh nghiệp'), 2000);
  setTimeout(() => showInfo('Đang xử lý', 'Đang cập nhật thông tin...'), 3000);
  setTimeout(() => showSuccess('Cập nhật thành công', 'Thông tin đã được cập nhật'), 5000);
  setTimeout(() => showWarning('Cảnh báo', 'Có 5 doanh nghiệp chưa được phê duyệt'), 6000);
};

// Export to window for console testing
if (typeof window !== 'undefined') {
  window.testNotifications = testAllNotifications;
  window.testHelperFunctions = testHelperFunctions;
  window.testSpamNotifications = testSpamNotifications;
  window.testRealisticScenario = testRealisticScenario;
  
  console.log(`
🔔 Notification Demo Commands:
  
  window.testNotifications()      - Test all notification types
  window.testHelperFunctions()    - Test helper functions
  window.testSpamNotifications()  - Stress test (20 notifications)
  window.testRealisticScenario()  - Test realistic user scenario
  `);
}
