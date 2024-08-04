"use client";
import React, { useState, useEffect, useRef } from "react";
import { getUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import { Loader2, Send } from "lucide-react";

export const dynamic = "force-dynamic"

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

interface ReceivedMessage {
  id: string;
  senderName: string;
  nationalId: string;
  content: string;
  createdAt: string;
  senderId: number;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      redirect("/login");
    } else {
      setUser({
        id: currentUser.id,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
      });
      fetchMessages(currentUser.id);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchMessages(userId: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/retrieve?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(messageToSend: Message) {
    console.log(messageToSend);
    try {
      const url = `/api/messages/send?fromId=${messageToSend.senderId}&message=${messageToSend.message}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      alert("An error occurred while sending the message.");
      console.error("Error sending message:", error);
      // Optionally, remove the message from the UI if it failed to send
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToSend.id)
      );
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messageToSend = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: messageToSend.id,
        senderName: messageToSend.senderName,
        nationalId: "",
        content: messageToSend.message,
        createdAt: messageToSend.timestamp,
        senderId: parseInt(messageToSend.senderId),
      },
    ]);
    setNewMessage("");

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      alert("An error occurred while sending the message.");
      console.error("Error sending message:", error);
      // Optionally, remove the message from the UI if it failed to send
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToSend.id)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.senderId.toString() == user?.id
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.senderId.toString() === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="font-semibold">{message.senderName}</p>
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 mr-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
