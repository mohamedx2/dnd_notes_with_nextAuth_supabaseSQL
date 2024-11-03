// src/app/layout.tsx
import './globals.css';

import { getServerSession } from 'next-auth';

import AppSession from '@/contexts/AppSession';
import authOptions
  from '@/lib/authOptions'; // Adjust the import path to where your authOptions are located
import { NextUIProvider } from '@nextui-org/react';

// Define metadata
export const metadata = {
  title: 'My dnd', // Replace with your title
  description: 'dnd next js / supabase SQL/next-auth/nextui', // Replace with your description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="antialiased">
        <AppSession session={session}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </AppSession>
      </body>
    </html>
  );
}
