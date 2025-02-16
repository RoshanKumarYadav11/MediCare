import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaUserMd,
  FaPlus,
  FaEnvelope,
  FaReceipt,
  FaSignOutAlt,
  FaClipboardList,
  FaBell,
  FaBars,
} from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import { MdEventAvailable, MdMessage } from "react-icons/md";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ role, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  useEffect(() => {
    const fetchUser = async () => {
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
        setUserId(data.user._id);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "An error occurred",
          "error"
        );
        setUserId(null);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/notifications/${userId}`
        );
        const unreadNotifications = data.filter(
          (notification) => !notification.isRead
        );
        setNotifications(unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger Icon for small/medium devices */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white focus:outline-none"
            >
              <FaBars className="text-2xl" />
            </button>
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Medicare Logo"
              className="w-20 h-20 ml-2 object-cover"
            />
          </div>
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center text-white hover:text-red-500 transition duration-300"
          >
            <FaSignOutAlt className="mr-2 text-lg" />
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed mt-[6.5rem] inset-y-0 left-0 w-44 md:w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
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
              <Link
                to="/dashboard/addinvoice"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <FaReceipt className="mr-3 text-lg" />
                Add Invoice
              </Link>
            </>
          )}

          {role === "Doctor" && (
            <>
              <Link
                to="/dashboard/prescription"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <FaReceipt className="mr-3 text-lg" />
                Prescriptions
              </Link>
              <Link
                to="/dashboard/availability"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <MdEventAvailable className="mr-3 text-lg" />
                Availability
              </Link>
              <Link
                to="/dashboard/chat"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <MdMessage className="mr-3 text-lg" />
                Chat
              </Link>
            </>
          )}

          {role === "Patient" && (
            <>
              <Link
                to="/dashboard/notifications"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <FaBell className="mr-3 text-lg" />
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {notifications.length}
                  </span>
                )}
              </Link>
              <Link
              to="/dashboard/invoice"
              className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
            >
              <FaReceipt className="mr-3 text-lg" />
              Invoices
            </Link>
              <Link
                to="/dashboard/patientreport"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <FaClipboardList className="mr-3 text-lg" />
                My Health Records
              </Link>
              <Link
                to="/dashboard/appointmenthistory"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <LuCalendarClock className="mr-3 text-lg" />
                Appointment History
              </Link>
              <Link
                to="/dashboard/chat"
                className="flex items-center px-6 py-3 hover:bg-gray-700 transition duration-300"
              >
                <MdMessage className="mr-3 text-lg" />
                Chat
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

      {/* Overlay for small/medium devices */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
