"use client";
import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation';

import {
  Button,
  Input,
  Spacer,
} from '@nextui-org/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: username, password }),
      });

      if (res.ok) {
        // Automatically sign in the user after successful signup
        await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred during signup: ' + err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h3 className="text-2xl font-bold text-center mb-6">Create an Account</h3>
      <form onSubmit={handleSignup}>
        <Input
          label="Username"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4"
        />
        <Spacer y={1} />
        <Input
          label="Email"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Spacer y={1} />
        <Input
          label="Password"
          fullWidth
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Spacer y={1.5} />
        <Button type="submit" color="primary" className="w-full">
          Sign Up
        </Button>
        {error && (
          <>
            <Spacer y={1} />
            <h3 className="text-red-500 text-center">{error}</h3>
          </>
        )}
      </form>
      <Spacer y={2} />
      <p className="text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
