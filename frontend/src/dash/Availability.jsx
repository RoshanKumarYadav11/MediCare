import axios from "axios";
import { useState, useEffect } from "react";

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null); // Store doctor info here
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Get token from localStorage
  const token = localStorage.getItem("token");
  
  // Fetch doctor info from API
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!token) {
        alert("Token is missing. Please log in again.");
        return;
      }

      try {
        // Fetch doctor info using the token
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token for authentication
            },
          }
        );
        if (response.status === 200) {
          setDoctorInfo(response.data.user); // Set complete doctor info
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        alert("Failed to fetch doctor info. Please try again.");
      }
    };

    fetchDoctorInfo();
  }, [token]);

  // Fetch availability when doctor info is available
  useEffect(() => {
    if (!doctorInfo) return; // Wait for doctor info to be fetched
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/doctor/${doctorInfo._id}/availability`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setAvailability(response.data.availability || []);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        alert("Failed to fetch availability. Please try again.");
      }
    };

    fetchAvailability();
  }, [doctorInfo, token]); // Trigger availability fetch when doctor info is fetched

  // Handle adding new availability
  const handleAddAvailability = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please fill out all fields.");
      return;
    }
    if (new Date(`${date} ${startTime}`) >= new Date(`${date} ${endTime}`)) {
      alert("Start time must be before end time.");
      return;
    }

    const newEntry = {
      date: date,
      timeSlots: [{ startTime, endTime }],
    };

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/doctor/${doctorInfo._id}/availability`,
        newEntry,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Availability added successfully!");
        setAvailability([...availability, { ...newEntry, id: Date.now() }]);
        setDate("");
        setStartTime("");
        setEndTime("");
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
      alert("Failed to add availability. Please try again.");
    }
  };

  // Handle removing availability
  const handleRemoveAvailability = async (availabilityId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/doctor/${doctorInfo._id}/availability/${availabilityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAvailability(
          availability.filter((entry) => entry._id !== availabilityId)
        );
        alert("Availability removed successfully!");
      }
    } catch (error) {
      console.error("Error deleting availability:", error);
      alert("Failed to remove availability. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Doctor Availability</h1>

      {/* Form for Adding Availability */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleAddAvailability}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Availability
        </button>
      </div>

      {/* Availability Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Availability</h2>
        {availability.length === 0 ? (
          <p className="text-gray-500">No availability added yet.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Start Time
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  End Time
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {availability.map((entry) => (
                <tr key={entry._id} className="border-b">
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.timeSlots[0].startTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.timeSlots[0].endTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleRemoveAvailability(entry._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Availability;
