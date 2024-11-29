import { auth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

    // Create response
    const response = NextResponse.json({ status: 'success' });

    // Set cookie in response
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error setting session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Create response
    const response = NextResponse.json({ status: 'success' });

    // Delete cookie from response
    response.cookies.delete('__session');

    return response;
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
