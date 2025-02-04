import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';  // Ensure supabase client is correctly imported

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


// API handler to refresh the access token
export async function POST(req: NextRequest) {
    try {
        // Refresh the session
        const { data, error } = await supabase.auth.refreshSession();

        if (error || !data?.session) {
            return NextResponse.json({
                status: 401,
                message: 'Unable to refresh session',
                session: null,
            }, { status: 401 });
        }

        // If the session was refreshed successfully, return the new session and token
        return NextResponse.json({
            status: 200,
            message: 'Session refreshed successfully',
            session: data.session,  // Send the refreshed session data
        }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error during session refresh:', error);

        if (error instanceof Error) {
            return NextResponse.json({
                status: 500,
                message: 'Server error during session refresh',
                session: null,
                error: error.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 500,
            message: 'Unknown server error',
            session: null,
        }, { status: 500 });
    }
}