// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// /**
//  * @swagger
//  * /api/auth/callback:
//  *   get:
//  *     summary: Handle OAuth callback
//  *     description: This endpoint processes the authentication callback by exchanging the code for a session.
//  *     parameters:
//  *       - in: query
//  *         name: code
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The authentication code returned by the provider.
//  *     responses:
//  *       302:
//  *         description: Redirects to the origin URL after processing the callback.
//  *       400:
//  *         description: Missing or invalid code parameter.
//  */
// //set the session
// export async function GET(req: NextRequest){
//     const url = new URL(req.url)

//     const code = url.searchParams.get('code');

//     if(code){
//         const cookieStore = cookies();
//         const supabase = createRouteHandlerClient({
//             cookies: () => cookieStore
//           });
//         await supabase
//           .auth
//           .exchangeCodeForSession(code)
//     }

    
//     return NextResponse.redirect(url.origin)
// }

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
 *       401:
 *         description: Session not active.
 */
import { checkSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Extract the code parameter from the URL
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Missing or invalid code parameter" },
      { status: 400 }
    );
  }

  // Correctly use cookies() without awaiting
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  try {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);

        // Check if the session is active
        const sessionCheck = await checkSession();
        if (sessionCheck.status !== 200) {
          return NextResponse.json(
            { message: sessionCheck.message, error: sessionCheck.error },
            { status: sessionCheck.status }
          );
        }

    // Redirect to the origin URL
    return NextResponse.redirect(url.origin);
  } catch (error) {
    console.error("Error during OAuth callback:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
