// authOptions.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AuthOptions,
  DefaultSession,
  Session,
} from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { supabase } from './supabase';

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ensure that User also has id
  }
}

// Define your User type
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  token?: string;
};

interface SupabaseTokenPayload {
  sub: string;
  role: string;
  user_metadata: {
    name: string;
    email: string | null | undefined;
    id?: string;
  };
  exp: number;
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Fetch the user from Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // Validate the password using bcrypt
        const validPass = await bcrypt.compare(credentials.password, user.password);
        if (!validPass) {
          throw new Error("Invalid credentials");
        }

        return user as User;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 6, // 6 hours
  },
  jwt: {
    maxAge: 60 * 60 * 10, // 10 hours
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub) {
        session.user.id = token.sub; // Assign the id to session.user
        session.user.name = token.name as string;
        session.user.email = session.user?.email ?? '';
      }

      if (session.user) {
        const supabaseTokenPayload: SupabaseTokenPayload = {
          sub: session.user.id,
          role: "authenticated",
          user_metadata: {
            name: session.user.name ?? "",
            email: session.user.email,
          },
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
        };

        session.user.token = jwt.sign(supabaseTokenPayload, process.env.NEXTAUTH_SECRET!);
      }

      return session;
    },
    async jwt({ token }: { token: JWT }) {
      if (!token.sub) {
        return token;
      }

      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, name')
          .eq('id', token.sub)
          .single();

        if (error || !user) {
          return token;
        }

        token.name = user.name;
      } catch (error) {
        console.error(error);
      }

      return token;
    },
  },
};

export default authOptions;
