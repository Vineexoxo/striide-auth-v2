/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: This endpoint allows a user to log in with an email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: testpassword
 *     responses:
 *       200:
 *         description: Login successful
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
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkSession } from '@/lib/session';

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Attempt to sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ message: 'Invalid credentials', error: error.message }, { status: 401 });
    }

    // Check if the session is active
    const sessionCheck = await checkSession();
    if (sessionCheck.status !== 200) {
      return NextResponse.json(
        { message: sessionCheck.message, error: sessionCheck.error },
        { status: sessionCheck.status }
      );
    }

        // Fetch the 'onboard' field from the user's profile
        const { data: userProfile, error: profileError } = await supabase
        .from('profile')
        .select('onboard')
        .eq('email', email)
        .single();
  
      if (profileError) {
        return NextResponse.json({ message: 'Error fetching user profile', error: profileError.message }, { status: 500 });
      }

    

    // Return login success with user and session info
    return NextResponse.json({
      onboard: userProfile?.onboard, // Add onboard field to the response
      message: 'Login successful',
      user: data.user,
      session: sessionCheck.session, // Use the verified session
      

    }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error in POST /api/login:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
