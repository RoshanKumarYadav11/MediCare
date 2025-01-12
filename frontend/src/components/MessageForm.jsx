const MessageForm = () => {
  return (
    <div className="relative py-20 flex items-center justify-center bg-gradient-to-br from-teal-600 to-blue-500">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-lg rounded-xl p-12 w-full max-w-3xl text-white">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6">Send Us A Message</h2>

        {/* Form */}
        <form method="POST"  className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
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
