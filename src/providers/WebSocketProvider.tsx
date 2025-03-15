'use client';

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    // In production, use wss:// for secure WebSocket connection
    const ws = new WebSocket(`ws://${window.location.host}/api/ws`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Send authentication message
      ws.send(JSON.stringify({
        type: 'auth',
        token: user.id,
      }));
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (user) {
          setSocket(new WebSocket(`ws://${window.location.host}/api/ws`));
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle different types of messages
      switch (data.type) {
        case 'notification':
          // Dispatch notification event
          const event = new CustomEvent('notification', { detail: data });
          window.dispatchEvent(event);
          break;

        case 'post_update':
          // Invalidate React Query cache for posts
          window.dispatchEvent(new CustomEvent('invalidate_posts'));
          break;

        default:
          console.log('Received message:', data);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user]);

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext value={{ socket, isConnected, sendMessage }}>
      {children}
    </WebSocketContext>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
