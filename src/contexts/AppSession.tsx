"use client";
import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';

export default function AppSession({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
