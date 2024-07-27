import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';

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
      role: user.role, // Include the user's role
    };

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
        redirect: user.role === 'ADMIN' ? '/admin' : '/home',
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
    });

    response.cookies.set({
      name: 'user_role',
      value: user.role,
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
    });

    response.cookies.set({
      name: 'user',
      value: JSON.stringify(userData),
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: "Internal server error, sorry!" }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}