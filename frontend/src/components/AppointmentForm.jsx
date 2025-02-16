import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AppointmentForm = () => {
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [doctorName, setDoctor] = useState("");
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [doctorMapping, setDoctorMapping] = useState({});
  const [doctorIdMapping, setDoctorIdMapping] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    doctorDepartment: "",
    doctorName: "",
    appointmentDate: "",
    message: "",
    patientId: "",
    doctorId: "",
  });

  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) throw new Error("Authentication token not found!");

        // Fetch doctors data from API
        const response = await fetch(
          "http://localhost:4000/api/v1/user/doctors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const doctors = data.doctors || data;

        if (!Array.isArray(doctors)) {
          throw new Error("Doctors data is not an array");
        }

        const departments = new Set();
        const mapping = {};
        const idMapping = {};

        doctors.forEach((doctor) => {
          if (doctor.role === "Doctor") {
            const department = doctor.doctorDepartment || "Other";
            departments.add(department);

            if (!mapping[department]) {
              mapping[department] = [];
            }

            mapping[department].push(doctor.fullName);
            idMapping[doctor.fullName] = doctor._id;
          }
        });

        setDepartmentsArray([...departments]);
        setDoctorMapping(mapping);
        setDoctorIdMapping(idMapping);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctorsAndDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication token not found!");

      // Fetch the patient info from the API
      const userResponse = await fetch("http://localhost:4000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userResponse.json();
      const { _id: patientId, role } = userData.user;
     
      // Ensure the user is a patient
       if (role !== "Patient") {
         Swal.fire("Error", "Only patients can book an appointment.", "error");
         return;
       }

      const doctorID = doctorIdMapping[doctorName];

      // Prepare the data for form submission
      const response = await axios.post(
        "http://localhost:4000/api/v1/appointment/appointment",
        {
          ...formData,
          doctorDepartment,
          doctorName,
          patientId,
          doctorId: doctorID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Appointment submitted successfully!");

      // Reset form after successful submission
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        doctorDepartment: "",
        doctorName: "",
        appointmentDate: "",
        message: "",
        patientId: "",
        doctorId: "",
      });
      setDoctorDepartment("");
      setDoctor("");
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Failed to submit appointment. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Full Name */}
      <div className="col-span-1">
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
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
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Appointment Date */}
      <div className="col-span-1">
        <label
          htmlFor="appointmentDate"
          className="block text-sm font-medium mb-1"
        >
          Appointment Date
        </label>
        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="w-full h-10 p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
          required
        />
      </div>

      {/* Department */}
      <div className="col-span-1">
        <label
          htmlFor="doctorDepartment"
          className="block text-sm font-medium mb-1"
        >
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
        <label htmlFor="doctorName" className="block text-sm font-medium mb-1">
          Doctor
        </label>
        <select
          value={doctorName}
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
          className="w-full  p-3 bg-white bg-opacity-20 border-none rounded-lg focus:ring-2 focus:ring-green-300 placeholder-white placeholder-opacity-70 text-white"
        />
      </div>

      {/* Submit */}
      <div className="col-span-1 md:col-span-2">
        <button
          type="submit"
          className="w-full h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Submit Appointment
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
