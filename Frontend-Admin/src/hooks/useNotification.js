import { useState, useEffect } from 'react';
import notificationHistoryService from '../services/notificationHistory.service';

/**
 * Custom hook để quản lý thông báo
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const allNotifications = notificationHistoryService.getAll();
    setNotifications(allNotifications);
    setUnreadCount(notificationHistoryService.getUnreadCount());
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notificationAdded', handleUpdate);
    window.addEventListener('notificationUpdated', handleUpdate);

    return () => {
      window.removeEventListener('notificationAdded', handleUpdate);
      window.removeEventListener('notificationUpdated', handleUpdate);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    refresh: loadNotifications,
  };
};

export default useNotification;
