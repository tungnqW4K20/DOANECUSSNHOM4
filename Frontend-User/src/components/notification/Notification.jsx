import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import notificationHistoryService from '../../services/notificationHistory.service';
import './styles.css';

let notificationContainer = null;
let notificationId = 0;

const createNotificationContainer = () => {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  return notificationContainer;
};

const NotificationItem = ({ type, message, description, onClose }) => {
  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />
  };

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">{icons[type]}</div>
      <div className="notification-content">
        <div className="notification-message">{message}</div>
        {description && <div className="notification-description">{description}</div>}
      </div>
      <button className="notification-close" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};

const showNotification = (type, message, description) => {
  // Lưu vào lịch sử
  notificationHistoryService.add({
    type,
    message,
    description,
  });

  const container = createNotificationContainer();
  const id = ++notificationId;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'notification-wrapper';
  wrapper.id = `notification-${id}`;
  
  container.appendChild(wrapper);
  
  const root = createRoot(wrapper);
  
  const handleClose = () => {
    wrapper.classList.remove('notification-show');
    wrapper.classList.add('notification-exit');
    setTimeout(() => {
      root.unmount();
      wrapper.remove();
    }, 300);
  };
  
  root.render(
    <NotificationItem 
      type={type} 
      message={message} 
      description={description}
      onClose={handleClose}
    />
  );
  
  setTimeout(() => {
    wrapper.classList.add('notification-show');
  }, 10);
  
  setTimeout(handleClose, 3000);
};

export const showSuccess = (message, description) => showNotification('success', message, description);
export const showError = (message, description) => showNotification('error', message, description);
export const showWarning = (message, description) => showNotification('warning', message, description);
export const showInfo = (message, description) => showNotification('info', message, description);

export const showCreateSuccess = (itemName = 'dữ liệu') => {
  showSuccess('Thêm mới thành công', `${itemName} đã được thêm vào hệ thống`);
};

export const showUpdateSuccess = (itemName = 'dữ liệu') => {
  showSuccess('Cập nhật thành công', `${itemName} đã được cập nhật`);
};

export const showDeleteSuccess = (itemName = 'dữ liệu') => {
  showSuccess('Xóa thành công', `${itemName} đã được xóa khỏi hệ thống`);
};

export const showLoadError = (itemName = 'dữ liệu') => {
  showError('Không thể tải dữ liệu', `Đã xảy ra lỗi khi tải ${itemName}. Vui lòng thử lại.`);
};

export const showSaveError = (itemName = 'dữ liệu') => {
  showError('Không thể lưu', `Đã xảy ra lỗi khi lưu ${itemName}. Vui lòng kiểm tra lại thông tin.`);
};

export const showDeleteError = (itemName = 'dữ liệu') => {
  showError('Không thể xóa', `Đã xảy ra lỗi khi xóa ${itemName}. Vui lòng thử lại.`);
};

export const showApproveSuccess = (itemName = 'doanh nghiệp') => {
  showSuccess('Duyệt thành công', `${itemName} đã được phê duyệt`);
};

export const showRejectSuccess = (itemName = 'doanh nghiệp') => {
  showWarning('Đã từ chối', `${itemName} đã bị từ chối`);
};

export const showUploadSuccess = (fileName = 'file') => {
  showSuccess('Upload thành công', `${fileName} đã được tải lên`);
};

export const showUploadError = () => {
  showError('Upload thất bại', 'Không thể tải file lên. Vui lòng kiểm tra định dạng và kích thước file.');
};
