import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// import { supabase } from '@/lib/supabase';
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User signup
 *     description: Allows a user to sign up with an email and password. Sends a verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the account.
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Signup successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   description: The user data.
 *                 session:
 *                   type: object
 *                   description: The session data.
 *       400:
 *         description: Bad request. Missing email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Invalid credentials or signup failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *                 error:
 *                   type: string
 *                   example: User already exists
 */

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    const url = new URL(req.url);

    // Validate input fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get cookies
    const cookieStore = cookies();
    
    // Create Supabase client
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });

    if (!supabase) {
      console.error('Supabase client is not initialized.');
      return NextResponse.json(
        { message: 'Internal server error: Supabase client initialization failed.' },
        { status: 500 }
      );
    }

    // Step 1: Check if email already exists in the auth.users table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('profile')
      .select('email')
      .eq('email', email)
      .single();

    if (userCheckError) {
      console.error('Error checking existing user:', userCheckError.message);
      return NextResponse.json(
        { message: 'Error checking user email.', error: userCheckError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists. Please log in instead.' },
        { status: 409 }
      );
    }

    // Step 2: Call Supabase signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`,
      },
    });

    // Handle signup errors
    if (error) {
      console.error('Error during signup:', error.message);
      return NextResponse.json(
        { message: 'Signup failed. Invalid credentials or other error.', error: error.message },
        { status: 400 }
      );
    }

    // Step 3: Return success response
    return NextResponse.json({
      message: 'Signup successful. Please verify your email.',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error('Unexpected error:', (err as Error).message);
    return NextResponse.json(
      { message: 'Internal server error', error: (err as Error).message },
      { status: 500 }
    );
  }
}