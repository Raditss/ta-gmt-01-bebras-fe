import type React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata = {
  title: 'Solvio - Platform Pembelajaran Komputasi',
  description:
    'Platform pembelajaran komputasi yang interaktif untuk siswa dan guru.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/graphic/logo-only.png',
    shortcut: '/graphic/logo-only.png',
    apple: '/graphic/logo-only.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        <link rel="icon" href="/graphic/logo-only.png" />
        <title>Solvio</title>
      </head>
      <body data-gptw="" cz-shortcut-listen="true">
        {/*<ThemeProvider*/}
        {/*  attribute="class"*/}
        {/*  defaultTheme="system"*/}
        {/*  enableSystem*/}
        {/*  disableTransitionOnChange*/}
        {/*>*/}
        <TooltipProvider>{children}</TooltipProvider>

        <Toaster />
        {/*</ThemeProvider>*/}
      </body>
    </html>
  );
}
