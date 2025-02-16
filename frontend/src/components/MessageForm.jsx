import  { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          Swal.fire("Success", res.data.message, "success");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      Swal.fire("Error", error.response.data.message, "error");
    }
  };



  return (
    <div id="message-form" className="relative py-20 flex items-center justify-center bg-gradient-to-br from-teal-600 to-blue-500">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-lg rounded-xl p-12 w-full max-w-3xl text-white">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6">Send Us A Message</h2>

        {/* Form */}
        <form onSubmit={handleMessage}  method="POST"  className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
           />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#00df9a] hover:bg-[#248164] text-white font-semibold rounded-lg transition-all duration-300 shadow-md"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
