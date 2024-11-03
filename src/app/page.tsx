"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Notes from '../components/page';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Wait until the session has finished loading
  if (status === 'loading') {
    return <p>Loading...</p>; // You can replace this with a loading spinner if preferred
  }

  // If session is not available, redirect to login
  if (!session) {
    router.push('/login');
    return null; // Prevents further rendering while redirecting
  }

  return (
    <div>
      <Notes />
    </div>
  );
}
