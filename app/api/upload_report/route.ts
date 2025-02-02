import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * @swagger
 * /api/upload_report:
 *   post:
 *     summary: Upload a new report
 *     description: Allows a user to upload a new report with location, description, and other details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               location:
 *                 type: string
 *                 example: "42.362, -71.057"
 *               description:
 *                 type: string
 *                 example: "A description of the report"
 *               duration:
 *                 type: string
 *                 example: "Short ~ less than a day"
 *               is_published:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully uploaded report.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

export async function POST(req: NextRequest) {
  try {
    const { address, location, description, duration, is_published } = await req.json();

    // Validate required fields
    if (!address || !location || !description || !duration) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert the report into the database
    const { error } = await supabase
      .from('reports')
      .insert({
        address,
        location,
        description,
        duration,
        is_published,
      });

    if (error) {
      console.error('Error inserting report:', error.message);
      return NextResponse.json(
        { message: 'Failed to upload report', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Report uploaded successfully' },
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
