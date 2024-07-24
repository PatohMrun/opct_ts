import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the auth_token from the request cookies
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ message: 'No active session' }, { status: 400 });
    }

    // Find the user with this token
    const user = await prisma.user.findFirst({
      where: { token: authToken },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    // Clear the token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { token: null },
    });

    // Create the response
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the auth_token cookie
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 0, // This will cause the cookie to expire immediately
      path: '/',
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : 'yourdomain.com',
    });

    return response;

  } catch (error: unknown) {
    console.error('Logout error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}