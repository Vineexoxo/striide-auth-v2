import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
/**
 * @swagger
 * /api/auth/check-session:
 *   get:
 *     summary: Check active session
 *     description: Verifies if a user has an active session.
 *     responses:
 *       200:
 *         description: Session is active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session active
 *                 session:
 *                   type: object
 *                   description: The user's session details
 *       401:
 *         description: No active session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session not active
 */
export async function GET(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res: NextResponse.next() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { message: 'Session not active' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { session, message: 'Session active' },
    { status: 200 }
  );
}
