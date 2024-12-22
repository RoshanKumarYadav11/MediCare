

const Login = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?fit=crop&w=1920&q=80')",
      }}
    >
      <div className="relative w-full max-w-md p-12 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Medicare Login
        </h2>
        <form>
          <div className="mb-4">
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
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#00df9a] text-white font-bold hover:bg-[#248164] transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Don’t have an account?{" "}
          <a href="#" className="text-[#248164] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
