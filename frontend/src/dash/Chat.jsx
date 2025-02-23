import { useState, useEffect, useRef } from "react";
import { FaUser, FaUserDoctor } from "react-icons/fa6";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000", {
  transports: ["websocket"],
});

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const chatEndRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing!");
          return;
        }

        const response = await fetch(`http://localhost:4000/api/v1/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.user._id) {
          setUserId(data.user._id);
          setRole(data.user.role);
        } else {
          console.error("User ID is missing in the response!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  // Fetch users based on role
  useEffect(() => {
    if (!role) return;
    const fetchUsers = async () => {
      try {
        const endpoint = role === "Doctor" ? "patients" : "doctors";
        const response = await fetch(
          `http://localhost:4000/api/v1/user/${endpoint}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(role === "Doctor" ? data.patients || [] : data.doctors || []);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, [role]);

  // Fetch chat history when user selects another user
  useEffect(() => {
    if (!selectedUser || !userId) return;

    const fetchChatHistory = async () => {
      setCurrentChat([]);
      const patient = role === "Patient" ? userId : selectedUser._id;
      const doctor = role === "Doctor" ? userId : selectedUser._id;

      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/chat/messages/${patient}/${doctor}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setCurrentChat(data);
        } else {
          setCurrentChat([]);
        }
       
      } catch (error) {
        console.error("Error fetching chat history:", error.message);
      }
    };

    fetchChatHistory();
  }, [selectedUser, userId]);

  // Emit user ID to the socket server after it's fetched
  useEffect(() => {
    if (userId) {
      socket.emit("set_user", userId);
    }
  }, [userId]);

  const sendMessage = () => {

    if (!userId) {
      alert("You must be logged in to send a message.");
      return;
    }

    if (!selectedUser) {
      alert("Please select a user to chat with.");
      return;
    }

    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    const msgData = {
      sender: userId,
      receiver: selectedUser._id,
      content: message,
    };


    socket.emit("send_message", msgData);
    setCurrentChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedUser && data.sender === selectedUser._id) {
        setCurrentChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  return (
    <div className="flex min-h-[70vh] max-h-[80vh] bg-gray-100 border">
      <div className="w-1/5 bg-gray-200 p-4">
        <h2 className="sticky top-0 text-xl font-bold mb-4 bg-slate-500 p-3 rounded-md text-white">
          Chat List
        </h2>
        <div
          className="h-[85%] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer capitalize ${
                  selectedUser && selectedUser._id === user._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                {user.fullName || "Unnamed User"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-center bg-blue-600 text-white p-4">
          {selectedUser && (
            <h1 className="text-2xl flex font-semibold text-wrap capitalize">
              {selectedUser.role === "Doctor" ? (
                <div className="flex">
                  <FaUserDoctor className="mr-3 text-3xl" /> Dr.
                </div>
              ) : (
                <div className="flex">
                  <FaUser className="mr-3 text-3xl" />
                </div>
              )}
              {selectedUser.fullName || "User"}
            </h1>
          )}
        </div>
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100"
          style={{ scrollbarWidth: "none" }}
        >
          {currentChat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg shadow ${
                  msg.sender === userId ? "bg-blue-100" : "bg-gray-300"
                } max-w-xs`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="flex items-center bg-white p-3 border-t">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-full p-2 mx-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="px-5 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
