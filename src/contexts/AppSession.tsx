"use client"
import { SessionProvider } from 'next-auth/react';

export default function AppSession({
    children,
    session,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }:any){  

    return(
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}