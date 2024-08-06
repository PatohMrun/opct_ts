import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  const notifications = await prisma.notification.findMany({
    where: { userId: Number(id) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  await prisma.notification.updateMany({
    where: { userId: Number(id) },
    data: { isRead: true },
  });

  return NextResponse.json({ message: "Notifications marked as read" });
}
