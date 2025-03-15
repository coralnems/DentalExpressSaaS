'use client';

import { useWebSocket } from '@/providers/WebSocketProvider';
import { createContext, useContext, useEffect, useState } from 'react';

type Notification = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isConnected } = useWebSocket();

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>,
  ) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [
      { ...notification, id, timestamp: new Date() },
      ...prev,
    ]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Listen for notification events from WebSocket
    const handleNotification = (event: CustomEvent) => {
      const { type, message } = event.detail;
      addNotification({ type, message });
    };

    window.addEventListener('notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener(
        'notification',
        handleNotification as EventListener,
      );
    };
  }, []);

  // Show connection status notifications
  useEffect(() => {
    if (isConnected) {
      addNotification({
        type: 'success',
        message: 'Connected to real-time updates',
      });
    } else {
      addNotification({
        type: 'warning',
        message: 'Disconnected from real-time updates. Reconnecting...',
      });
    }
  }, [isConnected]);

  return (
    <NotificationContext
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext>
  );
}

export const useNotifications = () => useContext(NotificationContext);
