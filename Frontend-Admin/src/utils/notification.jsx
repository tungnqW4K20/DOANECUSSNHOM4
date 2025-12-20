import { notification } from 'antd';

// Success notifications
export const showSuccess = (message, description) => {
  notification.success({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

export const showCreateSuccess = (itemName = 'dữ liệu') => {
  notification.success({
    message: '✅ Thêm mới thành công',
    description: `${itemName} đã được thêm vào hệ thống`,
    placement: 'topRight',
    duration: 3,
  });
};

export const showUpdateSuccess = (itemName = 'dữ liệu') => {
  notification.success({
    message: '✅ Cập nhật thành công',
    description: `${itemName} đã được cập nhật`,
    placement: 'topRight',
    duration: 3,
  });
};

export const showDeleteSuccess = (itemName = 'dữ liệu') => {
  notification.success({
    message: '✅ Xóa thành công',
    description: `${itemName} đã được xóa khỏi hệ thống`,
    placement: 'topRight',
    duration: 3,
  });
};

// Error notifications
export const showError = (message, description) => {
  notification.error({
    message,
    description,
    placement: 'topRight',
    duration: 4,
  });
};

export const showLoadError = (itemName = 'dữ liệu') => {
  notification.error({
    message: '❌ Không thể tải dữ liệu',
    description: `Đã xảy ra lỗi khi tải ${itemName}. Vui lòng thử lại.`,
    placement: 'topRight',
    duration: 4,
  });
};

export const showSaveError = (itemName = 'dữ liệu') => {
  notification.error({
    message: '❌ Không thể lưu',
    description: `Đã xảy ra lỗi khi lưu ${itemName}. Vui lòng kiểm tra lại thông tin.`,
    placement: 'topRight',
    duration: 4,
  });
};

export const showDeleteError = (itemName = 'dữ liệu') => {
  notification.error({
    message: '❌ Không thể xóa',
    description: `Đã xảy ra lỗi khi xóa ${itemName}. Vui lòng thử lại.`,
    placement: 'topRight',
    duration: 4,
  });
};

// Warning notifications
export const showWarning = (message, description) => {
  notification.warning({
    message,
    description,
    placement: 'topRight',
    duration: 4,
  });
};

// Info notifications
export const showInfo = (message, description) => {
  notification.info({
    message,
    description,
    placement: 'topRight',
    duration: 3,
  });
};

// Approval notifications
export const showApproveSuccess = (itemName = 'doanh nghiệp') => {
  notification.success({
    message: '✅ Duyệt thành công',
    description: `${itemName} đã được phê duyệt`,
    placement: 'topRight',
    duration: 3,
  });
};

export const showRejectSuccess = (itemName = 'doanh nghiệp') => {
  notification.warning({
    message: '⚠️ Đã từ chối',
    description: `${itemName} đã bị từ chối`,
    placement: 'topRight',
    duration: 3,
  });
};

// Upload notifications
export const showUploadSuccess = (fileName = 'file') => {
  notification.success({
    message: '✅ Upload thành công',
    description: `${fileName} đã được tải lên`,
    placement: 'topRight',
    duration: 3,
  });
};

export const showUploadError = () => {
  notification.error({
    message: '❌ Upload thất bại',
    description: 'Không thể tải file lên. Vui lòng kiểm tra định dạng và kích thước file.',
    placement: 'topRight',
    duration: 4,
  });
};
