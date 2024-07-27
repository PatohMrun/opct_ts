import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromId = searchParams.get("fromId");
  const toId = searchParams.get("toId");
  const message = searchParams.get("message");

  console.log(fromId, toId, message);

  if (!fromId || !message) {
    return Response.json(
      { error: "Missing parameters", success: false },
      { status: 400 }
    );
  }

 

  //   if did not receive id it means a user is sending a message to an admin. otherwise the admin will be sending to the user and id will be provided
  const finalToId =
    (searchParams.get("toId") ||
      (
        await prisma.user.findFirst({
          where: {
            role: "ADMIN",
          },
        })
      )?.id) ??
    1;


  const newMessage = await prisma.message.create({
    data: {
      content: message,
      receiverId: parseInt(finalToId.toString()),
      senderId: parseInt(fromId),
    },
  });

  console.log(newMessage);

  return Response.json({ newMessage, success: true });
}
