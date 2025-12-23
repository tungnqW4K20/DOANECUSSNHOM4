# Hệ Thống Thông Báo - Notification System

Hệ thống thông báo chuyên nghiệp với lưu trữ lịch sử vào localStorage.

## Tính Năng

✅ **Thông báo toast** - Hiển thị thông báo tạm thời trên màn hình
✅ **Lịch sử thông báo** - Lưu trữ và hiển thị lịch sử trong dropdown
✅ **LocalStorage** - Tự động lưu vào localStorage
✅ **Đánh dấu đã đọc** - Quản lý trạng thái đọc/chưa đọc
✅ **Xóa thông báo** - Xóa từng thông báo hoặc xóa tất cả
✅ **Real-time update** - Cập nhật tự động khi có thông báo mới
✅ **Responsive** - Tương thích mobile

## Sử Dụng

### 1. Hiển thị thông báo toast

```javascript
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo 
} from '@/components/notification/Notification';

// Thông báo thành công
showSuccess('Thành công', 'Dữ liệu đã được lưu');

// Thông báo lỗi
showError('Lỗi', 'Không thể kết nối đến server');

// Thông báo cảnh báo
showWarning('Cảnh báo', 'Dữ liệu chưa được lưu');

// Thông báo thông tin
showInfo('Thông tin', 'Hệ thống sẽ bảo trì vào 2h sáng');
```

### 2. Sử dụng các helper functions

```javascript
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showLoadError,
  showSaveError,
  showDeleteError,
  showApproveSuccess,
  showRejectSuccess,
  showUploadSuccess,
  showUploadError,
} from '@/components/notification/Notification';

// Thêm mới thành công
showCreateSuccess('Kho');

// Cập nhật thành công
showUpdateSuccess('Sản phẩm');

// Xóa thành công
showDeleteSuccess('Tờ khai');

// Lỗi tải dữ liệu
showLoadError('danh sách kho');

// Lỗi lưu
showSaveError('phiếu nhập');

// Upload
showUploadSuccess('document.pdf');
showUploadError();
```

### 3. Quản lý lịch sử thông báo

```javascript
import notificationHistoryService from '@/services/notificationHistory.service';

// Lấy tất cả thông báo
const allNotifications = notificationHistoryService.getAll();

// Lấy số lượng chưa đọc
const unreadCount = notificationHistoryService.getUnreadCount();

// Lấy thông báo chưa đọc
const unreadNotifications = notificationHistoryService.getUnread();

// Lấy theo loại
const errorNotifications = notificationHistoryService.getByType('error');

// Đánh dấu đã đọc
notificationHistoryService.markAsRead(notificationId);

// Đánh dấu tất cả đã đọc
notificationHistoryService.markAllAsRead();

// Xóa một thông báo
notificationHistoryService.remove(notificationId);

// Xóa tất cả
notificationHistoryService.clearAll();
```

### 4. Sử dụng Custom Hook

```javascript
import useNotification from '@/hooks/useNotification';

function MyComponent() {
  const { notifications, unreadCount, refresh } = useNotification();

  return (
    <div>
      <p>Bạn có {unreadCount} thông báo chưa đọc</p>
      <button onClick={refresh}>Làm mới</button>
    </div>
  );
}
```

### 5. Component NotificationCenter

Component này đã được tích hợp sẵn vào Header. Nó hiển thị:
- Badge với số lượng thông báo chưa đọc
- Dropdown với danh sách thông báo
- Các nút hành động (đánh dấu đã đọc, xóa)

## Cấu Trúc Dữ Liệu

### Notification Object

```javascript
{
  id: 1234567890.123,           // Unique ID
  type: 'success',               // 'success' | 'error' | 'warning' | 'info'
  message: 'Thành công',         // Tiêu đề
  description: 'Đã lưu dữ liệu', // Mô tả (optional)
  timestamp: '2025-12-20T...',   // ISO timestamp
  read: false                    // Trạng thái đọc
}
```

## LocalStorage

- **Key**: `user_notification_history`
- **Giới hạn**: 50 thông báo gần nhất
- **Format**: JSON array

## Events

Hệ thống dispatch các custom events:

- `notificationAdded` - Khi có thông báo mới
- `notificationUpdated` - Khi thông báo được cập nhật

## Styling

Các file CSS:
- `styles.css` - Toast notification styles
- `NotificationCenter.css` - Dropdown notification center styles

## Best Practices

1. **Sử dụng helper functions** thay vì gọi trực tiếp `showNotification`
2. **Cung cấp mô tả rõ ràng** để người dùng hiểu ngữ cảnh
3. **Không spam thông báo** - Chỉ hiển thị khi cần thiết
4. **Sử dụng đúng loại** - success/error/warning/info
5. **Test trên mobile** - Đảm bảo responsive

## Ví Dụ Thực Tế

```javascript
// Trong component Kho.jsx
import { showCreateSuccess, showSaveError } from '@/components/notification/Notification';

const handleCreate = async (values) => {
  try {
    await api.post('/kho', values);
    showCreateSuccess('Kho');
    fetchData();
  } catch (error) {
    showSaveError('kho');
  }
};
```
