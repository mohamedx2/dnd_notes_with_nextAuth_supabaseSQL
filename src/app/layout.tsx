"use client"
import { useSession } from 'next-auth/react';

import AppSession from '@/contexts/AppSession';
import { NextUIProvider } from '@nextui-org/react';

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();

  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AppSession session={session}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </AppSession>
      </body>
    </html>
  );
}