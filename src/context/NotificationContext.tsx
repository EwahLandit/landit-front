import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGetNotifications, apiMarkRead, apiMarkAllRead, NotificationItem } from '../lib/api';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = async () => {
    const res = await apiGetNotifications();
    if (!('error' in res)) {
      setNotifications(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    // Optimistically update local state
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    // Then make API call
    await apiMarkRead(id);
  };

  const markAllAsRead = async () => {
    // Optimistically update local state
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    // Then make API call
    await apiMarkAllRead();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}