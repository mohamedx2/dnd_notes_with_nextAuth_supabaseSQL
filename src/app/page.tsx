"use client";
import { useEffect } from 'react';

import {
  signOut,
  useSession,
} from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@nextui-org/react';

import Notes from '../components/page';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if there's no session and status is not loading
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading message while session is loading
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Button onClick={() => signOut()} style={{ marginBottom: '1rem' ,  fontFamily: 'Calibri' }}
                   
                       variant="light" className="h-[27px] mt-3 ml-3 w-[97px] rounded-[5px] p-[10px] text-[#D95806] text-[11.5px] font-[400] leading-[20px] text-left border border-[#D95806]">
        Logout
      </Button>
      <Notes />
    </div>
  );
}