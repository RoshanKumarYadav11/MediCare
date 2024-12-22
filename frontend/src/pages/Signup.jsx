const Signup = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?fit=crop&w=1920&q=80')",
      }}
    >
      <div className="relative w-full max-w-4xl p-8 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Medicare Signup
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-white mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-white mb-2" htmlFor="dob">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Gender */}
            {/* <div>
              <label className="block text-white mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="text-white flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="text-white flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="mr-2"
                  />
                  Female
                </label>
                <label className="text-white flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="mr-2"
                  />
                  Other
                </label>
              </div>
            </div> */}

            {/* Mobile Number */}
            <div>
              <label className="block text-white mb-2" htmlFor="mobile">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                placeholder="Enter your mobile number"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Confirm Password */}
            <div className="">
              <label className="block text-white mb-2" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#00df9a] text-white font-bold hover:bg-[#248164] transition duration-300"
            >
              Signup
            </button>
          </div>
        </form>

        {/* Already have account */}
        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <a href="#" className="text-[#00df9a] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
