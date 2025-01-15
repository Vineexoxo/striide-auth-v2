// app/api/auth/check-session/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Retrieve session data from Supabase
        const { data: session, error } = await supabase.auth.getSession();

        if (error || !session) {
            return NextResponse.json({
                status: 401,
                message: 'No valid session found',
                session: null,
            }, { status: 401 });
        }

        // If session exists, return it with success status
        return NextResponse.json({
            status: 200,
            message: 'Session is valid',
            session: session,
        }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error during session check:', error);

        if (error instanceof Error) {
            return NextResponse.json({
                status: 500,
                message: 'Server error during session check',
                session: null,
                error: error.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 500,
            message: 'An unknown error occurred during session check',
            session: null,
        }, { status: 500 });
    }
}
