import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'FriendZone',
    template: '%s | FriendZone'
  },
  description: 'A real-time social media platform built with WebSocket',
  keywords: ['social media', 'websocket', 'real-time', 'chat', 'social network'],
  authors: [{ name: 'Tuan Anh Jr' }],
  creator: 'Tuan Anh Jr',
  publisher: 'Soft Ware TA Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
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