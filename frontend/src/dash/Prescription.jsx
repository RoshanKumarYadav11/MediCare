import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";

const Prescription = () => {
  const [doctor, setDoctor] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [prescriptions, setPrescriptions] = useState({});
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing!");
          return;
        }

        const response = await fetch(`http://localhost:4000/api/v1/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.user && data.user._id) {
          setDoctorId(data.user._id);
          setDoctor(data.user);
          fetchPatients(data.user._id);
        } else {
          console.error("Doctor ID is missing in the response!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchDoctorData();
  }, []);

  const fetchPatients = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/prescriptions/patients/${doctorId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
    }
  };

  const handlePatientSelection = (event) => {
    const selectedIds = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedPatients(selectedIds);

    const newPrescriptions = {};
    selectedIds.forEach((id) => {
      if (!prescriptions[id]) {
        newPrescriptions[id] = {
          medicines: [{ name: "", dosage: "", timing: "", duration: "" }],
          // instructions: "",
        };
      } else {
        newPrescriptions[id] = prescriptions[id];
      }
    });

    setPrescriptions(newPrescriptions);
  };

  const deleteMedicine = (patientId, index) => {
    setPrescriptions((prev) => {
      const updatedMeds = prev[patientId].medicines.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [patientId]: { ...prev[patientId], medicines: updatedMeds },
      };
    });
  };

  const updateMedicine = (patientId, index, field, value) => {
    setPrescriptions((prev) => {
      const updatedMeds = prev[patientId].medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      );

      return {
        ...prev,
        [patientId]: { ...prev[patientId], medicines: updatedMeds },
      };
    });
  };

    const addMedicine = (patientId) => {
      setPrescriptions((prev) => ({
        ...prev,
        [patientId]: {
          ...prev[patientId],
          medicines: [
            ...prev[patientId].medicines,
            { name: "", dosage: "", timing: "", duration: "" },
          ],
        },
      }));
    };


const sendPrescription = async () => {
  try {
    if (!doctorId) {
      console.error("Doctor ID is missing!");
      alert("Doctor ID is missing!");
      return;
    }

    if (selectedPatients.length === 0) {
      alert("Please select at least one patient.");
      return;
    }

    const prescriptionsToSend = selectedPatients
      .map((patientId) => {
        if (
          !prescriptions[patientId] ||
          prescriptions[patientId].medicines.length === 0
        ) {
          alert(`Please add at least one medicine for ${patientId}`);
          return null;
        }

        return {
          doctorId: doctorId, // Ensure doctorId is properly set
          patientId,
          medicines: prescriptions[patientId].medicines.map((med) => ({
            name: med.name.trim(),
            dosage: med.dosage.trim(),
            timing: med.timing.trim(),
            duration: med.duration.trim(),
          })),
          date: new Date().toISOString(),
        };
      })
      .filter(Boolean); // Remove null values

    if (prescriptionsToSend.length === 0) return;

    console.log("Sending Prescription Data:", prescriptionsToSend);

    const response = await fetch(
      "http://localhost:4000/api/v1/user/addprescription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionsToSend[0]), // Send only one object, not an array
      }
    );

    const responseData = await response.json();
    console.log("Server Response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to send prescription");
    }

    alert("Prescription sent successfully!");
    // Clear input fields after submission
    setPrescriptions({});
    setSelectedPatients([]);
  } catch (error) {
    console.error("Error sending prescription:", error.message);
    alert("Failed to send prescription");
  }
};




  if (!doctor) {
    return <p className="text-center text-gray-500">Loading doctor info...</p>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-300 flex flex-col md:flex-row">
        {/* Select Patients */}
        <div className="mb-6 md:mb-0 md:w-1/4 md:border-r md:border-gray-300 md:pr-6">
          <label className="block text-lg font-semibold mb-2">
            Select Treated Patients
          </label>
          <select
            multiple
            className="w-full h-auto p-2 rounded overflow-auto"
            onChange={handlePatientSelection}
          >
            {patients &&
              patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
          </select>
        </div>

        <div className="w-full md:w-3/4 bg-white shadow-lg p-4 md:p-6 rounded-lg border border-gray-300 md:ml-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Prescription</h2>
            <p className="text-gray-500">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Doctor Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Doctor:</h3>
            <p>{doctor.fullName}</p>
            <p>{doctor.doctorDepartment}</p>
            <p>{doctor.phone}</p>
          </div>

          {selectedPatients.map((patientId) => {
            const patient = patients.find((p) => p._id === patientId);
            const prescription = prescriptions[patientId];

            return (
              <div key={patientId} className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold">
                  Prescription for {patient.fullName}
                </h3>
                <p>
                  Age: {patient.age} | Gender: {patient.gender}
                </p>

                {/* Medicine Table */}
                <h4 className="text-md font-semibold mt-2">
                  Prescribed Medicines
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 text-left mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Medicine Name</th>
                        <th className="p-2 border">Dosage</th>
                        <th className="p-2 border">Timing</th>
                        <th className="p-2 border">Duration</th>
                        <th className="p-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medicines.map((med, index) => (
                        <tr key={index}>
                          <td className="p-2 border">
                            <input
                              type="text"
                              className="w-full border p-1"
                              value={med.name}
                              onChange={(e) =>
                                updateMedicine(
                                  patientId,
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              type="text"
                              className="w-full border p-1"
                              value={med.dosage}
                              onChange={(e) =>
                                updateMedicine(
                                  patientId,
                                  index,
                                  "dosage",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              type="text"
                              className="w-full border p-1"
                              value={med.timing}
                              onChange={(e) =>
                                updateMedicine(
                                  patientId,
                                  index,
                                  "timing",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              type="text"
                              className="w-full border p-1"
                              value={med.duration}
                              onChange={(e) =>
                                updateMedicine(
                                  patientId,
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-2 border text-center">
                            <FaTrash
                              className="text-red-500 cursor-pointer"
                              onClick={() => deleteMedicine(patientId, index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => addMedicine(patientId)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Add Medicine
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={sendPrescription}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send Prescription
          </button>
        </div>
        {/* UI remains unchanged */}
      </div>
    </>
  );
};

Prescription.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      gender: PropTypes.string.isRequired,
    })
  ).isRequired,
};

Prescription.defaultProps = {
  patients: [],
};

export default Prescription;
