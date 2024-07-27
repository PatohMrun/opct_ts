import prisma from "@/utils/prisma";
interface Message {
  id: string | number;
  senderName: string;
  nationalId: string;
  content: string;
  createdAt: string;
  senderId: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing userId", success: false }),
      { status: 400 }
    );
  }

  // Fetch the user's role
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { role: true },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found", success: false }),
      { status: 404 }
    );
  }

  const isAdmin = user.role === "ADMIN";

  // Construct the query based on the user's role
  const messages: Message[] = await Promise.all(
    (
      await prisma.message.findMany({
        where: isAdmin
          ? { receiverId: parseInt(userId) }
          : {
              OR: [
                { receiverId: parseInt(userId) },
                { senderId: parseInt(userId) },
              ],
            },
        include: {
          sender: true,
        },
      })
    ).map(async (message) => ({
      id: message.id,
      senderName: await getUserName(message.sender.nationalId),
      nationalId: message.sender.nationalId,
      content: message.content,
      createdAt: message.createdAt.toISOString(), // Call the method to get the string
      senderId: message.senderId,
    }))
  );

  console.log(messages);

  return new Response(
    JSON.stringify({ messages, success: true }),
    { status: 200 }
  );
}

async function getUserName(nationalId: string) {
  const user = await prisma.governmentRecord.findFirst({
    where: {
      nationalId: nationalId,
    },
  });

  return `${user?.firstName} ${user?.lastName}`;
}
