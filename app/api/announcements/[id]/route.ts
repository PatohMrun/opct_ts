import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const id = parseInt(params.id, 10);
  const { title, content } = body;
  if (!title || !content) {
    return NextResponse.json(
      {
        success: false,
        message: "Title and content are required",
      },
      { status: 400 }
    );
  }

  const updatedAnnouncement = await prisma.announcement.update({
    where: { id: id },
    data: { title, content },
  });

  return NextResponse.json({
    success: true,
    announcement: updatedAnnouncement,
    message: "Announcement updated successfully",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  const deletedAnnouncement = await prisma.announcement.delete({
    where: { id: id },
  });

  return NextResponse.json({
    success: true,
    message: "Announcement deleted successfully",
  });
}
