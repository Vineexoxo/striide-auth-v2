import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic"; // Add this line to force dynamic rendering


export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: 'Report ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Report not found', error: error.message }, { status: 404 });
    }

    return NextResponse.json({ status: 200, report: data }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
