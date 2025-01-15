// pages/api/auth/refresh-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';  // Ensure supabase client is correctly imported

// API handler to refresh the access token
export default async function POST(req: NextApiRequest, res: NextApiResponse) {

        try {
            // Refresh the session
            const { data, error } = await supabase.auth.refreshSession();

            if (error || !data?.session) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unable to refresh session',
                    session: null,
                });
            }

            // If the session was refreshed successfully, return the new session and token
            return res.status(200).json({
                status: 200,
                message: 'Session refreshed successfully',
                session: data.session,  // Send the refreshed session data
            });
        } catch (error: unknown) {
            console.error('Error during session refresh:', error);

            if (error instanceof Error) {
                return res.status(500).json({
                    status: 500,
                    message: 'Server error during session refresh',
                    session: null,
                    error: error.message,
                });
            }

            return res.status(500).json({
                status: 500,
                message: 'An unknown error occurred during session refresh',
                session: null,
            });
        }
}
