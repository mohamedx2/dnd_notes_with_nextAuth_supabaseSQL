"use client"
import { useState } from 'react';

import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      //router.push('/dashboard'); // Redirect to a protected page upon success
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: auto;
          padding-top: 5rem;
          text-align: center;
        }
        .login-form {
          display: flex;
          flex-direction: column;
        }
        .login-form label {
          margin: 0.5rem 0 0.2rem;
          font-weight: bold;
        }
        .login-form input {
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .login-form button {
          padding: 0.7rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .login-form button:hover {
          background-color: #005bb5;
        }
        .error {
          color: red;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
