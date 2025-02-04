import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkSession } from '@/lib/session';

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: 'Report ID is required' }, { status: 400 });
    }


    // Fetch likes and dislikes for the report
    const { data, error } = await supabase
      .from('report_likes')
      .select('likes, dislikes, user_liked')
      .eq('report_id', id)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Likes data not found', error: error.message }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      likes: data.likes || 0,
      dislikes: data.dislikes || 0,
      user_liked: data.user_liked,
    }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
