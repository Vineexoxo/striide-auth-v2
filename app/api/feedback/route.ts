import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback
 *     description: Allows a user to submit feedback with type, comments, severity, stars, and contact preference.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               report_type:
 *                 type: string
 *                 example: "Bug"
 *               comments:
 *                 type: string
 *                 example: "This is a feedback comment."
 *               severity:
 *                 type: string
 *                 example: "Moderate"
 *               stars:
 *                 type: integer
 *                 example: 4
 *               contact:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully submitted feedback.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

export async function POST(req: NextRequest) {
  try {
    const { report_type, comments, severity, stars, contact } = await req.json();

    // Validate required fields
    if (!report_type || !comments || !severity || stars === undefined || contact === undefined) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert the feedback into the database
    const { error } = await supabase
      .from('feedback')
      .insert({
        report_type,
        comments,
        severity,
        stars,
        contact,
      });

    if (error) {
      console.error('Error inserting feedback:', error.message);
      return NextResponse.json(
        { message: 'Failed to submit feedback', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Feedback submitted successfully' },
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
