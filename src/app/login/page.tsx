"use client";
import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Button,
  Input,
  Spacer,
} from '@nextui-org/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Uncomment and use the router for redirection upon success
       router.push('/'); 
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="mb-4"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="mb-4"
        />
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <Button type="submit" color="primary" className="w-full">
          Sign In
        </Button>
      </form>
      <Spacer y={2} />
      <p className="text-center">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
