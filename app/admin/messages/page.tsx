'use client'
import React, { useState } from 'react';
import { FiMessageSquare, FiMaximize2 } from 'react-icons/fi';

interface Message {
  id: string;
  senderName: string;
  nationalId: string;
  message: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    senderName: 'John Doe',
    nationalId: '12345678',
    message: 'Hello, I have a question about my application.',
    timestamp: '2024-07-23T10:30:00Z',
  },
  {
    id: '2',
    senderName: 'Jane Smith',
    nationalId: '87654321',
    message: 'When will I receive a response to my application?',
    timestamp: '2024-07-23T11:45:00Z',
  },
  // Add more sample messages as needed
];

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const openReplyModal = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const openMessageModal = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageModalOpen(true);
  };

  const closeModal = () => {
    setIsReplyModalOpen(false);
    setIsMessageModalOpen(false);
    setSelectedMessage(null);
    setReplyMessage('');
  };

  const handleReply = () => {
    // Here you would typically send the reply to an API
    console.log(`Replying to ${selectedMessage?.senderName}: ${replyMessage}`);
    // For now, we'll just close the modal
    closeModal();
  };

  return (
    <section className='py-2 min-h-screen font-poppins mx-auto w-[72vw] sm:w-[85vw] lg:w-[92vw]'> 
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Messages</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">Sender Name</th>
              <th scope="col" className="py-3 px-6">National ID</th>
              <th scope="col" className="py-3 px-6">Message</th>
              <th scope="col" className="py-3 px-6">Timestamp</th>
              <th scope="col" className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {message.senderName}
                </td>
                <td className="py-4 px-6">{message.nationalId}</td>
                <td className="py-4 px-6">
                  {message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message}
                  <button
                    onClick={() => openMessageModal(message)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FiMaximize2 />
                  </button>
                </td>
                <td className="py-4 px-6">{new Date(message.timestamp).toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => openReplyModal(message)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
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

      {isReplyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
               onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Reply to {selectedMessage.senderName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMessageModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-80 sm:w-96 shadow-lg rounded-md bg-white"
               onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Message from {selectedMessage.senderName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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