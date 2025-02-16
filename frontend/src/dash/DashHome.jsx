import { IoTrashBin } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Authentication token not found!");

          const { data } = await axios.get(
            "http://localhost:4000/api/v1/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Set the user data
          setUserName(data.user.fullName);
          setUserRole(data.user.role);
        } catch (error) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to fetch user data.",
            "error"
          );
        }
      };
      fetchUserData();
    }, []);
    
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found!");
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(data.appointments);
      } catch (error) {
        swal.fire("Error", error.response.data.message, "error");
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire("Error", "User not authenticated. Please log in.", "error");
        }
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDoctors(data.doctors);
      } catch (error) {
        swal.fire("Error", error.response.data.message, "error");
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  const getDefaultImage = (userRole) => {
    if (userRole === "Doctor") return "/dash/doctor-default.png";
    if (userRole === "Admin") return "/dash/admin-default.png";
    return "/dash/patient-default.png";
  };

  const handleStatusChange = async (id, newStatus) => {
    // Confirm before updating the status
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to change the status to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (!result.isConfirmed) {
      return; // User canceled the action
    }

    try {
      // Optimistically update the local state
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      // Send the update to the backend
      const response = await axios.patch(
        `http://localhost:4000/api/v1/appointment/appointment/${id}`,
        {
          status: newStatus,
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Appointment status updated successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating appointment:", error);

      // Rollback the local state if the API call fails
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "Pending" }
            : appointment
        )
      );

      Swal.fire({
        title: "Error!",
        text: "Failed to update the appointment. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting appointment with ID:", id); // Debugging log

      const result = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:4000/api/v1/appointment/appointment/${id}`,
          { withCredentials: true }
        );

        console.log("Delete response:", response.data); // Log response

        setAppointments((prev) =>
          prev.filter((appointment) => appointment._id !== id)
        );

        swal.fire("Deleted!", "The appointment has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete the appointment.",
        "error"
      );
    }
  };

  return (
    <>
      <section className="dashboard page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md ">
            <img
              src={getDefaultImage(userRole )}
              alt={userRole+"-icon"}
              className="w-24 h-auto rounded-full mx-auto mb-4"
            />
            <div className="text-center my-auto">
              <p className="text-gray-500">
                Hello,
                {userName
                  ? userName.replace(/['"]+/g, "").charAt(0).toUpperCase() +
                    userName.replace(/['"]+/g, "").slice(1)
                  : ""}
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
                {appointments && appointments.length > 0
                  ? appointments.map((appointment) => (
                      <tr key={appointment._id} className="even:bg-gray-50">
                        <td className="px-4 py-2 border">
                          {appointment.fullName}
                        </td>

                        <td className="px-4 py-2 border">
                          {new Date(appointment.appointmentDate).toLocaleString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2 border">
                          {appointment.doctorName}
                        </td>
                        <td className="px-4 py-2 border">
                          {appointment.doctorDepartment}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          <select
                            value={appointment.status}
                            onChange={(e) =>
                              handleStatusChange(
                                appointment._id,
                                e.target.value
                              )
                            }
                            className={
                              appointment.status === "Pending"
                                ? "bg-yellow-400 text-gray-700"
                                : appointment.status === "Accepted"
                                ? "bg-green-400 text-gray-700"
                                : "bg-red-400 text-gray-700"
                            }
                          >
                            <option
                              className="bg-yellow-400 text-gray-700 "
                              value="Pending"
                            >
                              Pending
                            </option>
                            <option
                              className="bg-green-400 text-gray-700"
                              value="Accepted"
                            >
                              Accepted
                            </option>
                            <option
                              className="bg-red-400 text-gray-700"
                              value="Rejected"
                            >
                              Rejected
                            </option>
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
                    ))
                  : "No Appointments Found!"}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
