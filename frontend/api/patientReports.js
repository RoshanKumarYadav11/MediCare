import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/user"; // Update with your backend URL

// 🔹 Upload Patient Report
export const uploadPatientReport = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("patientReports", file);

    const response = await axios.post(`${API_URL}/upload-report`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading patient report:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Fetch Patient Reports
export const getPatientReports = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching patient reports:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Delete Report
export const deletePatientReport = async (reportId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting patient report:", error.response?.data || error.message);
    throw error;
  }
};



