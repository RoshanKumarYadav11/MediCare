import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null); // State for selected message
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  const openModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };
  // Truncate message to a limit of 50 characters
  const truncateMessage = (message, limit = 30) => {
    return message.length > limit
      ? `${message.substring(0, limit)}...`
      : message;
  };
  return (
    <div className="px-6 py-12 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Messages
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr
                key={message._id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => openModal(message)}
              >
                <td className="px-4 py-2">{`${message.firstName} ${message.lastName}`}</td>
                <td className="px-4 py-2">{message.email}</td>
                <td className="px-4 py-2">{message.phone}</td>
                <td className="px-4 py-2">
                  {truncateMessage(message.message)}{" "}
                  {/* Display truncated message */}
                </td>

                <td className="mx-auto text-2xl ">
                  <FaEye className="mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing the full message */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Message from {selectedMessage.firstName}{" "}
              {selectedMessage.lastName}
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Email:</strong> {selectedMessage.email}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Phone:</strong> {selectedMessage.phone}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Message:</strong> {selectedMessage.message}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
