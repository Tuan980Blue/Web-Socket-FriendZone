import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'WebSocket Social',
    template: '%s | WebSocket Social'
  },
  description: 'A real-time social media platform built with WebSocket',
  keywords: ['social media', 'websocket', 'real-time', 'chat', 'social network'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}; 