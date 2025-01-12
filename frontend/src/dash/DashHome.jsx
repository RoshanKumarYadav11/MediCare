import { Navigate } from "react-router-dom";
import { IoTrashBin } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import { useState } from "react";

const Dashboard = () => {
  const isAuthenticated = true; // Static content for authentication
  const admin = {
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
  }; // Static admin content

  const [appointments, setAppointments] = useState([
    {
      _id: "1",
      firstName: "Alice",
      lastName: "Smith",
      appointment_date: "2024-12-25T10:00:00Z",
      doctor: { firstName: "Dr. Bob", lastName: "Brown" },
      department: "Cardiology",
      status: "Pending",
      hasVisited: false,
    },
    {
      _id: "2",
      firstName: "Charlie",
      lastName: "Johnson",
      appointment_date: "2024-12-26T11:00:00Z",
      doctor: { firstName: "Dr. Alice", lastName: "White" },
      department: "Neurology",
      status: "Accepted",
      hasVisited: true,
    },
  ]);

  const doctors = [
    { firstName: "Dr. Bob", lastName: "Brown" },
    { firstName: "Dr. Alice", lastName: "White" },
  ];

  const getDefaultImage = (gender) => {
    if (gender === "Male") return "dash/male-default.png";
    if (gender === "Female") return "dash/female-default.png";
    return "/other-default.png";
  };

  const handleStatusChange = (id, status) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment._id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const handleDelete = (id) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment._id !== id)
    );
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src={getDefaultImage(admin.gender)}
              alt="docImg"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <div className="text-center my-auto">
              <p className="text-gray-500">
                Hello,{`${admin.firstName} ${admin.lastName}`}
              </p>
            </div>
          </div>

          <div className="bg-blue-100 p-6 my-auto rounded-lg shadow-md text-center space-y-3">
            <LuCalendarClock className="mx-auto text-3xl" />
            <p className="text-gray-700 font-semibold ">Total Appointments</p>
            <h3 className="text-4xl font-bold">{appointments.length}</h3>
          </div>

          <div className="bg-green-100 p-6 my-auto rounded-lg shadow-md text-center space-y-3">
            <FaUserDoctor className="mx-auto text-3xl" />
            <p className="text-gray-700 font-semibold ">Registered Doctors</p>
            <h3 className="text-4xl font-bold">{doctors.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h5 className="text-xl font-bold mb-4">Appointments</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Patient</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Doctor</th>
                  <th className="px-4 py-2 border">Department</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="even:bg-gray-50">
                    <td className="px-4 py-2 border">{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td className="px-4 py-2 border">
                      {new Date(appointment.appointment_date).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-4 py-2 border">{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td className="px-4 py-2 border">
                      {appointment.department}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 border text-center flex justify-center gap-4">
                      <IoTrashBin
                        className="text-red-500  text-xl cursor-pointer "
                        title="Delete Appointment"
                        onClick={() => handleDelete(appointment._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
