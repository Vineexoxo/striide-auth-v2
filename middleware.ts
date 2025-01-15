import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight (OPTIONS) requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...corsHeaders,
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle actual requests
  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  console.log(`CORS middleware invoked for: ${request.url}`);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
