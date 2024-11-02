"use client"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Notes from '../components/page';

export default function Home() {
  const session=useSession();
  const router = useRouter();
  if (!session?.data?.user) {
    router.push('/login');
    
  }
  return (
    <div >
      <Notes/>
    </div>
  );
}
