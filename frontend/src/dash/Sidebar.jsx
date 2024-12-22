
import { FaHome, FaUserMd, FaPlus, FaEnvelope, FaReceipt, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ( ) => {
  return (
    <div className="h-screen w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white fixed shadow-lg">
      {/* Logo & Project Name */}
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <img
          src="/logo.png" // Replace with your logo image path
          alt="Medicare Logo"
          className="w-20 h-20 mr-2 object-cover"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col mt-6">
        <Link
          to="#"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaHome className="mr-3 text-lg" />
          Home
        </Link>
        <Link to="doctors"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaUserMd className="mr-3 text-lg" />
          Doctors Page
        </Link>
        <Link
          to="adddoctor"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaPlus className="mr-3 text-lg" />
          Add New Doctor
        </Link>
        <Link
          to="messages"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaEnvelope className="mr-3 text-lg" />
          Message
        </Link>
        <Link
          to="#"
          className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
        >
          <FaReceipt className="mr-3 text-lg" />
          Prescription
        </Link>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          className="flex items-center px-6 py-3 w-full text-left hover:bg-red-700 transition duration-300"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const handleLogout = () => {
    alert("Logged out successfully!");
    // Add logout functionality here
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

    
    </div>
  );
};

export default Dashboard;
