import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ announcements });
}

async function POST(request: NextRequest) {
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json(
      { success: false, message: "Title and content are required" },
      { status: 400 }
    );
  }

  const newAnnouncement = await prisma.announcement.create({
    data: { title, content },
  });

  return NextResponse.json({
    success: true,
    announcement: newAnnouncement,
    message: "Announcement created successfully",
  });
}

export { POST };
