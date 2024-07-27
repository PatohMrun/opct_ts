"use client";
import { getUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiMaximize2 } from "react-icons/fi";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  senderName: string;
  nationalId: string;
  content: string;
  createdAt: string;
  senderId: number;
}

const initialMessages: Message[] = [
  // ... (previous initial messages remain unchanged)
];

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const openReplyModal = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const openMessageModal = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageModalOpen(true);
  };

  async function fetchMessages() {
    const user = getUser();

    if (!user) {
      redirect("/login");
      return;
    }

    const userId = user.id;
    const url = `/api/messages/retrieve?userId=${userId}`;

    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        console.log(data.messages);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      alert("An error occurred while fetching messages.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(
    selectedMessage: Message | null,
    replyMessage: string
  ) {
    const currentUser = getUser()!;
    const url = `/api/messages/send?fromId=${currentUser.id}&message=${replyMessage}&toId=${selectedMessage?.senderId}`;

    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.success) {
        throw new Error("Failed to send reply");
      }

      console.log("Reply sent successfully:", data);
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("An error occurred while sending the reply.");
    }

    setLoading(false);

    closeModal();
  }

  const closeModal = () => {
    setIsReplyModalOpen(false);
    setIsMessageModalOpen(false);
    setSelectedMessage(null);
    setReplyMessage("");
  };

  const handleReply = () => {
    console.log(`Replying to ${selectedMessage?.senderName}: ${replyMessage}`);
    sendReply(selectedMessage, replyMessage);
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <section className="py-2 min-h-screen font-poppins mx-auto w-[72vw] sm:w-[85vw] lg:w-[92vw]">
      <h1 className="text-3xl font-bold mt-6 mb-2 text-center ">Messages</h1>
      {messages.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">No messages found.</p>
          <p className="text-md text-gray-500 mt-2">
            Check back later for new messages.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Sender
                </th>
                <th scope="col" className="py-3 px-6">
                  National ID
                </th>
                <th scope="col" className="py-3 px-6">
                  Message
                </th>
                <th scope="col" className="py-3 px-6">
                  Timestamp
                </th>
                <th scope="col" className="py-3 px-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {message.senderName}
                  </td>
                  <td className="py-4 px-6">{message.nationalId}</td>
                  <td className="py-4 px-6">
                    {message.content.length > 50
                      ? `${message.content.substring(0, 50)}...`
                      : message.content}
                    <button
                      onClick={() => openMessageModal(message)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FiMaximize2 />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(message.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => openReplyModal(message)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                    >
                      <FiMessageSquare className="mr-2" />
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply Modal */}
      {isReplyModalOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={closeModal}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Reply to {selectedMessage.senderName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={closeModal}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-80 sm:w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Message from {selectedMessage.senderName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {selectedMessage.content}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Messages;
