import { useState } from "react";

const AppointmentForm = () => {
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

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

  const doctorMapping = {
    Pediatrics: ["Dr. Mira Koirala", "Dr. Anurag Koirala"],
    Orthopedics: ["Dr. Hem Sagar Rimal"],
    Cardiology: ["Dr. Anurag Koirala"],
    Neurology: ["Dr. Mira Koirala"],
    Oncology: [],
    Radiology: [],
    "Physical Therapy": [],
    Dermatology: [],
    ENT: [],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Appointment submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Name */}
      <div className="col-span-1">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Email */}
      <div className="col-span-1">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Phone */}
      <div className="col-span-1">
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="w-full h-10  p-3  bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Date */}
      <div className="col-span-1">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Appointment Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Department */}
      <div className="col-span-1">
        <label htmlFor="department" className="block text-sm font-medium mb-1">
          Department
        </label>
        <select
          value={doctorDepartment}
          onChange={(e) => {
            setDoctorDepartment(e.target.value);
            setDoctor(""); // Reset doctor selection when department changes
          }}
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
        >
          <option value="">Select Department</option>
          {departmentsArray.map((depart, index) => (
            <option value={depart} key={index}>
              {depart}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div className="col-span-1">
        <label htmlFor="doctor" className="block text-sm font-medium mb-1">
          Doctor
        </label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          disabled={!doctorDepartment} // Disable if no department is selected
        >
          <option value="">Select Doctor</option>
          {(doctorMapping[doctorDepartment] || []).map((doc, index) => (
            <option value={doc} key={index}>
              {doc}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="col-span-1 md:col-span-2">
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter additional details (optional)"
          rows="5"
          className="w-full p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-1 md:col-span-2 text-center">
        <button
          type="submit"
          className="bg-[#00df9a] hover:bg-[#248164] text-white font-semibold py-3 px-8 rounded-md transition duration-300"
        >
          Submit Appointment
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
