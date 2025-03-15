'use client';

import Toast from '@/components/Toast';
import { NotificationProvider } from '@/contexts/NotificationContext';
import QueryProvider from '@/providers/QueryProvider';
import { WebSocketProvider } from '@/providers/WebSocketProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <WebSocketProvider>
          <NotificationProvider>
            <html lang="en">
              <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                <Toast />
                <Toaster position="top-right" />
              </body>
            </html>
          </NotificationProvider>
        </WebSocketProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
