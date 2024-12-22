const Doctors = () => {
  // Sample data for doctors
  const doctors = [
    {
      id: 1,
      image: "doctor1.jpg", // Image URL or path
      email: "dr.john@example.com",
      phone: "+1234567890",
      dob: "1985-06-15",
      department: "Cardiology",
      nmc: "D12345",
      gender: "Male",
    },
    {
      id: 2,
      image: "doctor2.jpg",
      email: "dr.susan@example.com",
      phone: "+0987654321",
      dob: "1990-09-25",
      department: "Neurology",
      nmc: "D67890",
      gender: "Female",
    },
    // Add more doctor objects as needed
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Doctors List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Image</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Email</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Phone</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">DOB</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Department</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">NMC Number</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Gender</th>
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
                <td className="py-2 px-4 border-b">{doctor.department}</td>
                <td className="py-2 px-4 border-b">{doctor.nmc}</td>
                <td className="py-2 px-4 border-b">{doctor.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Doctors;
