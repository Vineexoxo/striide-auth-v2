import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
/**
 * @swagger
 * /api/auth/callback:
 *   get:
 *     summary: Handle OAuth callback
 *     description: This endpoint processes the authentication callback by exchanging the code for a session.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The authentication code returned by the provider.
 *     responses:
 *       302:
 *         description: Redirects to the origin URL after processing the callback.
 *       400:
 *         description: Missing or invalid code parameter.
 */
//set the session
export async function GET(req: NextRequest){
    const url = new URL(req.url)

    const code = url.searchParams.get('code');

    if(code){
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({
            cookies: () => cookieStore
          });
        await supabase
          .auth
          .exchangeCodeForSession(code)
    }
    return NextResponse.redirect(url.origin)
}