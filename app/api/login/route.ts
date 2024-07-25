import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const { nationalId, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { nationalId },
    });

    const governmentRecord = await prisma.governmentRecord.findUnique({
      where: { nationalId },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken();

    await prisma.user.update({
      where: { id: user.id },
      data: { token: token },
    });

    const userData = {
      id: user.id,
      nationalId: user.nationalId,
      firstName: governmentRecord?.firstName,
      middleName: governmentRecord?.middleName,
      lastName: governmentRecord?.lastName,
      kraPin: governmentRecord?.kraPin,
    };

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: false, // httpOnly for auth token
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : 'yourdomain.com',
    });

    response.cookies.set({
      name: 'user',
      value: JSON.stringify(userData),
      httpOnly: false, // not httpOnly to be accessible from client-side
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : 'yourdomain.com',
    });

    return response;

  } catch (error: unknown) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
