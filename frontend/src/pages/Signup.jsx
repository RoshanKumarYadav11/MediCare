import { useState } from "react";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate(); // React Router's useNavigate hook

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    confirmPassword: "",
    role: "Patient", // Default role set to "Patient"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, dob, phone, email, address, password, confirmPassword } =
      formData;

    // Check for empty fields
    if (
      !fullName ||
      !dob ||
      !phone ||
      !email ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      Swal.fire("Error", "Please fill all the fields.", "error");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return false;
    }

    // Check for valid phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Swal.fire(
        "Error",
        "Please enter a valid 10-digit phone number.",
        "error"
      );
      return false;
    }

    // Check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Please enter a valid email address.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register", // Replace with your backend URL
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        Swal.fire("Success", "Registration successful!", "success").then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Something went wrong!",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to connect to the server!",
        "error"
      );
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
      <div className="relative w-full max-w-4xl p-8 bg-white bg-opacity-10 rounded-lg backdrop-blur-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Medicare Signup
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-white mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
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
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-white mb-2" htmlFor="phone">
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-white mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-white mb-2" htmlFor="password">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
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

            {/* Confirm Password */}
            <div className="relative">
              <label
                className="block text-white mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-3 top-8 flex items-center text-white focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <LiaEyeSlashSolid className="text-xl" />
                ) : (
                  <LiaEyeSolid className="text-xl" />
                )}
              </button>
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

        {/* Already have an account */}
        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#00df9a] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
