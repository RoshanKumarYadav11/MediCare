import { useEffect, useRef, useState } from "react";
import {
  deletePatientReport,
  getPatientReports,
  uploadPatientReport,
} from "../../api/patientReports";
import { FaCloudUploadAlt } from "react-icons/fa";

const PatientReports = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  //  Fetch Reports on Component Mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getPatientReports(token);
      setReports(data.patientReports);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //  Handle File Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    try {
      setLoading(true);
      await uploadPatientReport(file, token);
      fetchReports(); // Refresh after upload
      // Reset the input field after successful upload
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //  Handle Report Deletion
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      setLoading(true);
      await deletePatientReport(reportId, token);
      fetchReports(); // Refresh after deletion
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Patient Reports</h2>
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="w-full">
        {/* Custom File Input */}
        <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <FaCloudUploadAlt className="text-blue-500 text-2xl mr-2" />
          <span className="text-gray-700">
            {file ? file.name : "Choose a file..."}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        {/* Upload Button */}
        <button
          type="submit"
          className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Reports List */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      )}
      {!loading && reports.length === 0 && (
        <div className="flex justify-center items-center py-4">
          <p className="text-gray-500">No reports found.</p>
        </div>
      )}
      {!loading && reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-sm rounded-md">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {report.altText}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="flex items-center space-x-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientReports;
