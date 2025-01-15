import { NextRequest, NextResponse } from 'next/server';
import {supabase} from '@/lib/supabase'

export default function CheckSession(){
const getSession = async () => {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { message: 'Session not active' },
      { status: 401 }
    );
  }
  console.log(session)

  return NextResponse.json(
    { session, message: 'Session active' },
    { status: 200 }
  );
}
}
