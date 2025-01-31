// app/api/auth/check-session/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Retrieve session data from Supabase
        const { data, error } = await supabase.auth.getSession();

        if (error || data.session === null) {
            console.log('session doesnt exist')
            return NextResponse.json({
                status: 401,
                message: 'No valid session found',
                session: null,
            }, { status: 401 });
        }
        console.log('error =',error)
        console.log('session = ',data.session)
        return NextResponse.json({
            status: 200,
            message: 'Session is valid',
            session: data.session,
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
