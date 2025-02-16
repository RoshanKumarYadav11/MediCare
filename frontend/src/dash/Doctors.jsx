import { useEffect, useState } from "react";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctors data from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found!");
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); 
        setDoctors(response.data.doctors || []); 
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch doctors data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Doctors List</h2>
      {loading ? (
        <p className="text-gray-600">Loading doctors...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : doctors.length === 0 ? (
        <p className="text-gray-600">No doctors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  Image
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  Email
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  Phone
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  DOB
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  Department
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                  Gender
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{doctor.email}</td>
                  <td className="py-2 px-4 border-b">{doctor.phone}</td>
                  <td className="py-2 px-4 border-b">{doctor.dob}</td>
                  <td className="py-2 px-4 border-b">{doctor.doctorDepartment}</td>
                  <td className="py-2 px-4 border-b">{doctor.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Doctors;
