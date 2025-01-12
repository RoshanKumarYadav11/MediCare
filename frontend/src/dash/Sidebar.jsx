import PropTypes from "prop-types";
import {
  FaHome,
  FaUserMd,
  FaPlus,
  FaEnvelope,
  FaReceipt,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ role, onLogout }) => {
  return (
    <div className="h-screen w-44 md:w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white fixed shadow-lg">
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <img
          src="/logo.png" 
          alt="Medicare Logo"
          className="w-20 h-20 mr-2 object-cover"
        />
      </div>

      <nav className="flex flex-col mt-6">
        <Link
          to="/dashboard"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaHome className="mr-3 text-lg" />
          Home
        </Link>

        {role === "Admin" && (
          <>
            <Link
              to="/dashboard/messages"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
            >
              <FaEnvelope className="mr-3 text-lg" />
              Messages
            </Link>
            <Link
              to="/dashboard/doctors"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
            >
              <FaUserMd className="mr-3 text-lg" />
              Doctors Page
            </Link>
            <Link
              to="/dashboard/adddoctor"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
            >
              <FaPlus className="mr-3 text-lg" />
              Add New Doctor
            </Link>
          </>
        )}

        {role === "Doctor" && (
          <Link
            to="/dashboard/prescription"
            className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
          >
            <FaReceipt className="mr-3 text-lg" />
            Prescriptions
          </Link>
        )}

        {role === "Patient" && (
          <>
            <Link
              to="/dashboard/my-health"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
            >
              <FaClipboardList className="mr-3 text-lg" />
              My Health Records
            </Link>
          </>
        )}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center px-6 py-3 w-full text-left hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};
// Add propTypes for props validation
Sidebar.propTypes = {
  role: PropTypes.string.isRequired, // role must be a string and is required
  onLogout: PropTypes.func.isRequired, // onLogout must be a function and is required
};

export default Sidebar;

