import { useState, useEffect } from 'react';
import { Dropdown, Badge, Button, Empty, Spin, Tooltip } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import notificationHistoryService from '../../services/notificationHistory.service';
import NotificationSettings from './NotificationSettings';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load notifications
  const loadNotifications = () => {
    const allNotifications = notificationHistoryService.getAll();
    setNotifications(allNotifications);
    setUnreadCount(notificationHistoryService.getUnreadCount());
  };

  useEffect(() => {
    loadNotifications();

    // Listen for new notifications
    const handleNotificationAdded = () => {
      loadNotifications();
    };

    const handleNotificationUpdated = () => {
      loadNotifications();
    };

    window.addEventListener('notificationAdded', handleNotificationAdded);
    window.addEventListener('notificationUpdated', handleNotificationUpdated);

    return () => {
      window.removeEventListener('notificationAdded', handleNotificationAdded);
      window.removeEventListener('notificationUpdated', handleNotificationUpdated);
    };
  }, []);

  // Icon mapping
  const getIcon = (type) => {
    const iconMap = {
      success: <CheckCircleOutlined className="notification-icon-success" />,
      error: <CloseCircleOutlined className="notification-icon-error" />,
      warning: <ExclamationCircleOutlined className="notification-icon-warning" />,
      info: <InfoCircleOutlined className="notification-icon-info" />,
    };
    return iconMap[type] || iconMap.info;
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle mark as read
  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    notificationHistoryService.markAsRead(notificationId);
  };

  // Handle delete
  const handleDelete = (notificationId, e) => {
    e.stopPropagation();
    notificationHistoryService.remove(notificationId);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setLoading(true);
    notificationHistoryService.markAllAsRead();
    setTimeout(() => setLoading(false), 300);
  };

  // Handle clear all
  const handleClearAll = () => {
    setLoading(true);
    notificationHistoryService.clearAll();
    setTimeout(() => setLoading(false), 300);
  };

  // Dropdown content
  const dropdownContent = (
    <div className="notification-center-dropdown">
      {/* Header */}
      <div className="notification-center-header">
        <div className="notification-center-title">
          <BellOutlined style={{ fontSize: 18, marginRight: 8 }} />
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Badge 
              count={unreadCount} 
              style={{ 
                backgroundColor: '#2563eb',
                marginLeft: 8,
              }} 
            />
          )}
        </div>
        <div className="notification-center-actions">
          <Tooltip title="Cài đặt">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => {
                setSettingsOpen(true);
                setOpen(false);
              }}
            />
          </Tooltip>
          {unreadCount > 0 && (
            <Tooltip title="Đánh dấu tất cả đã đọc">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
                disabled={loading}
              />
            </Tooltip>
          )}
          {notifications.length > 0 && (
            <Tooltip title="Xóa tất cả">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleClearAll}
                disabled={loading}
                danger
              />
            </Tooltip>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="notification-center-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có thông báo"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={(e) => handleMarkAsRead(notification.id, e)}
              >
                <div className="notification-item-icon">
                  {getIcon(notification.type)}
                </div>
                <div className="notification-item-content">
                  <div className="notification-item-message">
                    {notification.message}
                  </div>
                  {notification.description && (
                    <div className="notification-item-description">
                      {notification.description}
                    </div>
                  )}
                  <div className="notification-item-time">
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                <div className="notification-item-actions">
                  <Tooltip title="Xóa">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="notification-delete-btn"
                    />
                  </Tooltip>
                </div>
                {!notification.read && (
                  <div className="notification-unread-dot" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="notification-center-footer">
          <span className="notification-count">
            Tổng {notifications.length} thông báo
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Dropdown
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomRight"
        open={open}
        onOpenChange={setOpen}
        overlayClassName="notification-center-overlay"
      >
        <Tooltip title="Thông báo">
          <Badge count={unreadCount} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: '18px' }} />}
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                color: '#64748b',
              }}
              className={unreadCount > 0 ? 'notification-bell-animate' : ''}
            />
          </Badge>
        </Tooltip>
      </Dropdown>

      <NotificationSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default NotificationCenter;
