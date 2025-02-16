import { useState } from "react";
import axios from "axios";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    address: "",
    doctorDepartment: "",
    role: "Doctor",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and get missing fields
  const validateForm = () => {
    const missingFields = [];

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "role" && key !== "doctorDepartment" && value.trim() === "") {
        missingFields.push(key);
      }
    });

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    setErrorMessage(""); 
    return true;
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form data
  if (Object.values(formData).some((value) => value === "")) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/user/adddoctor",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert(response.data.message || "Doctor registered successfully!");

    // Clear form data after successful submission
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      password: "",
      address: "",
      doctorDepartment: "",
      role: "Doctor", // Keep the default role for new entries
    });
  } catch (err) {
    console.error("Error submitting the form:", err);
    alert(err.response?.data?.message || "Error submitting the form.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-5">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-8">
          Register a New Doctor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
              {errorMessage}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full bg-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="doctorDepartment"
              value={formData.doctorDepartment}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full bg-white"
              required
            >
              <option value="">Select Department</option>
              {departmentsArray.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#161e2d] text-white rounded-lg py-2 px-6 hover:bg-blue-900"
            >
              Register New Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
