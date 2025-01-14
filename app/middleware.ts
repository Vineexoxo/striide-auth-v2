import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const res = NextResponse.next();
  
  // Allow all origins during local development
  const allowedOrigins = ['http://localhost:3000'];

  const origin = req.headers.get('Origin');
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);  // Allow the request origin
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  }

  return res;
}

export const config = {
  matcher: '/api/*', // Apply middleware only to API routes
};
