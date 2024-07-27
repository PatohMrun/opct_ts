// File: app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/utils/prisma';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const { status } = await request.json();

  console.log(`Received request to update application ${id} to status ${status}`); // Debugging log

  if (isNaN(id)) {
    console.error(`Invalid ID: ${params.id}`); // Debugging log
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { id: id },
      data: { status },
    });

    console.log('Updated application:', updatedApplication); // Debugging log

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating applicationnnnnn:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}