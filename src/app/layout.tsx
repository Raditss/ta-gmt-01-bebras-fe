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

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.className}>
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
