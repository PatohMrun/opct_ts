import { getUser } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  console.log(user);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  // Create a new object excluding the specified properties
  const { id: _, password, createdAt, updatedAt, token, ...safeUser } = user;

  return NextResponse.json(safeUser);
}

export async function PUT(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const updatedUser = await req.json();
  console.log(updatedUser);

    await prisma.user.update({
        where: { id: Number(id) },
        data: updatedUser,
    });

  return NextResponse.json({ message: "User updated successfully" });
}
