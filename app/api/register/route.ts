// File: app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { nationalId, password } = await request.json();

    // Check if the government record exists
    const governmentRecord = await prisma.governmentRecord.findUnique({
      where: { nationalId },
    });

    if (!governmentRecord) {
      return NextResponse.json({ message: 'Invalid National ID' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { nationalId },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with minimal information
    await prisma.user.create({
      data: {
        nationalId,
        password: hashedPassword,
        maritalStatus: 'Single',
        employmentStatus: 'Unemployed',
        chronicIllness: false,
        disabled: false,
        county: governmentRecord.district,
        subCounty: governmentRecord.division,
        constituency: governmentRecord.location,
        ward: governmentRecord.sublocation,
        village: '',
      },
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}