"use client";
import type { ReactNode } from 'react';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface AppSessionProps {
  children: ReactNode;
  session: Session | null;
}

export default function AppSession({
  children,
  session,
}: AppSessionProps) {  
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

