# 🔔 Hệ Thống Thông Báo - Quick Start

## ✨ Tính Năng Chính

1. **Toast Notifications** - Thông báo popup tự động ẩn
2. **Notification Center** - Lịch sử thông báo trên header
3. **LocalStorage** - Tự động lưu trữ
4. **Export/Import** - Xuất/nhập dữ liệu
5. **Statistics** - Thống kê chi tiết

## 🚀 Sử Dụng Ngay

### 1. Hiển thị thông báo

```javascript
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo 
} from '@/components/notification/Notification';

// Thành công
showSuccess('Lưu thành công', 'Dữ liệu đã được cập nhật');

// Lỗi
showError('Lỗi', 'Không thể kết nối server');

// Cảnh báo
showWarning('Cảnh báo', 'Vui lòng kiểm tra lại');

// Thông tin
showInfo('Thông tin', 'Hệ thống sẽ bảo trì');
```

### 2. Helper Functions (Khuyên dùng)

```javascript
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
} from '@/components/notification/Notification';

// Sau khi tạo mới
showCreateSuccess('Doanh nghiệp');

// Sau khi cập nhật
showUpdateSuccess('Thông tin tài khoản');

// Sau khi xóa
showDeleteSuccess('Đơn vị tính');
```

### 3. Xem lịch sử

- Click vào icon 🔔 trên header
- Xem tất cả thông báo
- Đánh dấu đã đọc
- Xóa thông báo

### 4. Test trong Console

```javascript
// Mở Console (F12) và chạy:
window.testNotifications()      // Test tất cả loại
window.testRealisticScenario()  // Test kịch bản thực tế
```

## 📊 Quản Lý

### Xem thống kê

1. Click icon 🔔 trên header
2. Click icon ⚙️ (Settings)
3. Click "Xem thống kê"

### Xuất dữ liệu

1. Mở Settings
2. Chọn format: JSON, CSV, hoặc Text
3. File tự động download

### Xóa lịch sử

1. Click icon 🔔
2. Click icon 🗑️ (Xóa tất cả)

## 💡 Tips

- Thông báo tự động lưu vào localStorage
- Giới hạn 50 thông báo gần nhất
- Badge hiển thị số thông báo chưa đọc
- Chuông rung khi có thông báo mới

## 🎯 Ví Dụ Thực Tế

```javascript
// Trong component DoanhNghiep.jsx
const handleCreate = async (values) => {
  try {
    await api.post('/doanh-nghiep', values);
    showCreateSuccess('Doanh nghiệp');
    fetchData();
  } catch (error) {
    showSaveError('doanh nghiệp');
  }
};
```

## 📱 Responsive

- Desktop: Dropdown 420px
- Mobile: Full width với padding

## 🔗 Tài Liệu Đầy Đủ

Xem file `README.md` trong thư mục `components/notification/`

---

**Đã sẵn sàng sử dụng!** 🎉
