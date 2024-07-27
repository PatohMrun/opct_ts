// File: app/api/applications/[id]/route.ts
import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  console.log(`Received request to get application status for user ${userId}`);
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const userIdNumber = parseInt(userId);
  const application = await prisma.application.findFirst({
    where: { userId: userIdNumber },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found", status: "No Application" },
      { status: 404 }
    );
  }

  const applicationStatus = application.status;

  return NextResponse.json({ status: applicationStatus });
}
