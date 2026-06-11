import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing.');
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request) {
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);

    // Pass authenticated user context via custom headers to downstream routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    );
  }
}

// Protected routes configuration
export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/orders/:path*',
    '/api/commissions/:path*',
    '/api/admin/:path*',
  ],
};
