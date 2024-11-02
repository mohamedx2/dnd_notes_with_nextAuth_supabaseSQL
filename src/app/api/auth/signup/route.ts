import bcrypt from 'bcrypt'; // or 'bcryptjs' if you chose that
import { NextResponse } from 'next/server';

import { supabase } from '../../../../lib/supabase';

interface SignupData {
  email: string;
  name: string;
  password: string;
}

export async function POST(request: Request) {
  const { email, name, password }: SignupData = await request.json();

  // Validate the input fields
  if (!email || !name || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Insert the user data with hashed password into the Supabase "users" table
    const { error } = await supabase.from('users')
      .insert({ email, name, password: hashedPassword }) // Store the hashed password

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
