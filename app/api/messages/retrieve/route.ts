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
    return Response.json(
      { error: "Missing userId", success: false },
      { status: 400 }
    );
  }

  const messages: Message[] = await Promise.all(
    (
      await prisma.message.findMany({
        where: {
          receiverId: parseInt(userId),
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

  return Response.json({ messages, success: true });
}

async function getUserName(nationalId: string) {
  const user = await prisma.governmentRecord.findFirst({
    where: {
      nationalId: nationalId,
    },
  });

  return `${user?.firstName} ${user?.lastName}`;
}
