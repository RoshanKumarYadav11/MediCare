import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { GrInProgress } from "react-icons/gr";
import { ImCross } from "react-icons/im";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
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
        Swal.fire("Error", error.response.data.message, "error");
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);
  
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h5 className="text-xl font-bold mb-4">Appointments History</h5>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Patient</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Doctor</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Status</th>
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
                      <td className="px-4 py-2 border text-center flex justify-center ">
                        {appointment.status === "Pending" ? (
                          <div className="flex space-x-2">
                            <div className="flex items-center justify-center bg-yellow-400 text-white rounded-full w-8 h-8">
                              <GrInProgress className="text-white" />
                            </div>{" "}
                            <div className="my-auto text-yellow-800">Pending</div>
                          </div>
                        ) : appointment.status === "Accepted" ? (
                          <div className="flex space-x-2">
                            {" "}
                            <div className="flex items-center justify-center bg-green-400 text-white rounded-full w-8 h-8">
                              <IoMdCheckmarkCircle className="text-white" />
                            </div>
                            <div className="my-auto text-green-800">Accepted</div>
                          </div>
                        ) : (
                          <div className="flex space-x-2" >
                            <div className="flex items-center justify-center bg-red-400 text-white rounded-full w-8 h-8">
                              <ImCross className="text-white" />
                            </div>
                            <div className="my-auto text-red-800">Rejected</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AppointmentHistory;
