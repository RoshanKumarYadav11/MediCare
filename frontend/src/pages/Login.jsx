import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("user"); // Tracks active tab (user/admin)
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

const handleLogin = async (e) => {
  e.preventDefault();
  const endpoint =
    activeTab === "admin"
      ? "http://localhost:4000/api/v1/user/adminlogin"
      : "http://localhost:4000/api/v1/user/login";

  try {
    const response = await axios.post(endpoint, {
      email,
      password,
    });

    const { token } = response.data; // Only store token
    localStorage.setItem("token", token);
    
    // Set Axios default headers for future requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user details separately
    const userResponse = await axios.get("http://localhost:4000/api/v1/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { user } = userResponse.data;
    const { role } = user;

    // Redirect based on role and activeTab
    if (activeTab === "admin") {
      if (role === "Admin") {
        navigate("/dashboard");
      } else {
        setError("Unauthorized access for Admin Dashboard.");
      }
    } else {
      if (role === "Doctor") {
        navigate("/dashboard");
      } else if (role === "Patient") {
        navigate("/");
      } else {
        setError("Invalid user role. Contact support.");
      }
    }
  } catch (error) {
    setError(error.response?.data?.message || "Login failed. Try again.");
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?fit=crop&w=1920&q=80')",
      }}
    >
      <div className="relative w-full max-w-md p-12 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-lg ${
              activeTab === "user"
                ? "bg-[#00df9a] text-white"
                : "bg-white bg-opacity-20 text-white"
            }`}
            onClick={() => setActiveTab("user")}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg ml-2 ${
              activeTab === "admin"
                ? "bg-[#00df9a] text-white"
                : "bg-white bg-opacity-20 text-white"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin Login
          </button>
        </div>
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          {activeTab === "admin" ? "Admin Login" : "User Login"}
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-white mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 top-8 flex items-center text-white focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <LiaEyeSlashSolid className="text-xl" />
              ) : (
                <LiaEyeSolid className="text-xl" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#00df9a] text-white font-bold hover:bg-[#248164] transition duration-300"
          >
            Login
          </button>
        </form>
        {activeTab === "user" && (
          <p className="text-white text-center mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#248164] hover:underline">
              Sign up
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
