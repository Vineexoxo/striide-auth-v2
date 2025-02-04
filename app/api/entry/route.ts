import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';
// import { checkUser } from '@/utils/checkSession';
import { use } from 'react';

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


/**
 * @swagger
 * /api/entry:
 *   post:
 *     summary: Update user entry
 *     description: Allows a logged-in user to update their profile with additional information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dummy@gmail.com"
 *               user_info:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Bangalore"
 *                   state:
 *                     type: string
 *                     example: "Karnataka"
 *                   occupation:
 *                     type: string
 *                     example: "engineer"
 *                   gender:
 *                     type: string
 *                     example: "Male"
 *                   birthdate:
 *                     type: string
 *                     example: "2025-01-02T00:00:00Z"
 *                   phone_number:
 *                     type: string
 *                     example: ""
 *                   transport_modes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Walking"
 *                     example: ["Walking", "PublicTransport", "Driving", "Biking"]
 *                   commute_frequency:
 *                     type: string
 *                     example: "Weekly"
 *                   travel_time:
 *                     type: string
 *                     example: "Evening"
 *                   feed_type:
 *                     type: string
 *                     example: "Email_Newsletter"
 *                   onboard:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Successfully updated user entry.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized (user not logged in).
 *       500:
 *         description: Internal server error.
 */

export async function POST(req: NextRequest) {
  try {
    const { email, user_info } = await req.json();

    // Check if email is provided
    if (!email || !user_info) {
      return NextResponse.json(
        { message: 'Email and user info are required' },
        { status: 400 }
      );
    }

    
    const { error: updateError } = await supabase
    .from('profile')
    .update({
      city: user_info.city,
      state: user_info.state,
      occupation: user_info.occupation,
      gender: user_info.gender,
      birthdate: user_info.birthdate,
      phone_number: user_info.phone_number,
      transport_modes: user_info.transport_modes,
      commute_frequency: user_info.commute_frequency,
      travel_time: user_info.travel_time,
      feed_type: user_info.feed_type,
      onboard: user_info.onboard
    })
    .eq('email', email); // Use email as the filter
    // Handle upsert errors
    if (updateError) {
        console.error('Error during profile upsert:', updateError.message);
        return NextResponse.json(
          { message: 'Failed to update profile', error: updateError.message },
          { status: 500 }
        );
      }
      console.log('profile updated')
      return NextResponse.json(
        { message: 'Profile updated successfully' },
        { status: 200 }
      );


  } catch (err) {
    console.error('Unexpected error:', (err as Error).message);
    return NextResponse.json(
      { message: 'Internal server error', error: (err as Error).message },
      { status: 500 }
    );
  }
}
