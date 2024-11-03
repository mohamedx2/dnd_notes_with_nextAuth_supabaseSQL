import './globals.css';

import AppSession from '@/contexts/AppSession';
import { NextUIProvider } from '@nextui-org/react';

// Define metadata
export const metadata = {
  title: 'My dnd ', // Replace with your title
  description: 'dnd next js / supabase SQL/next-auth/nextui', // Replace with your description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppSession  session={null}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </AppSession>
      </body>
    </html>
  );
}
